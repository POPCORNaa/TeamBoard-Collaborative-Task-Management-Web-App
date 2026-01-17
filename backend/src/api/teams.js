import express from "express";
import jwt from "jsonwebtoken";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get user's teams
router.get("/", auth, async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [{ owner: req.userId }, { members: req.userId }],
    }).populate("owner", "name email").populate("members", "name email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams", error: error.message });
  }
});

// Create team
router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = new Team({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });
    await team.save();

    // Update user's team
    await User.findByIdAndUpdate(req.userId, { team: team._id });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team", error: error.message });
  }
});

// Join team with invite code
router.post("/join", auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const team = await Team.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!team) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (team.members.includes(req.userId)) {
      return res.status(400).json({ message: "Already a member of this team" });
    }

    team.members.push(req.userId);
    await team.save();

    // Update user's team
    await User.findByIdAndUpdate(req.userId, { team: team._id });

    res.json({ message: "Joined team successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Failed to join team", error: error.message });
  }
});

// Get team details with tasks
router.get("/:id", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const tasks = await Task.find({ team: team._id })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json({ team, tasks });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team", error: error.message });
  }
});

// Leave team
router.post("/:id/leave", auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.owner.toString() === req.userId) {
      return res.status(400).json({ message: "Owner cannot leave team. Delete the team instead." });
    }

    team.members = team.members.filter(m => m.toString() !== req.userId);
    await team.save();

    await User.findByIdAndUpdate(req.userId, { team: null });

    res.json({ message: "Left team successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to leave team", error: error.message });
  }
});

export default router;
