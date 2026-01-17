import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
import Team from "../models/Team.js";

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

// Get all tasks for user (personal + team tasks)
router.get("/", auth, async (req, res) => {
  try {
    // Get user's teams
    const userTeams = await Team.find({ members: req.userId });
    const teamIds = userTeams.map(team => team._id);

    // Get personal tasks OR tasks assigned to user OR tasks from user's teams
    const tasks = await Task.find({
      $or: [
        { createdBy: req.userId, team: null },  // Personal tasks created by user
        { assignedTo: req.userId },              // Tasks assigned to user
        { team: { $in: teamIds } }               // All tasks from user's teams
      ],
    })
    .populate("createdBy", "name email")  // Populate creator info
    .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
});

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, team } = req.body;
    
    // If team task, verify user is member of team
    if (team) {
      const teamDoc = await Team.findOne({ _id: team, members: req.userId });
      if (!teamDoc) {
        return res.status(403).json({ message: "You are not a member of this team" });
      }
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      team: team || null,
      createdBy: req.userId,
    });
    await task.save();
    
    // Populate creator info before returning
    await task.populate("createdBy", "name email");
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, team } = req.body;
    
    // Get the task first
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permission: creator, assignee, or team member
    let hasPermission = false;
    
    if (existingTask.createdBy.toString() === req.userId) {
      hasPermission = true;
    } else if (existingTask.assignedTo?.toString() === req.userId) {
      hasPermission = true;
    } else if (existingTask.team) {
      const teamDoc = await Team.findOne({ _id: existingTask.team, members: req.userId });
      if (teamDoc) hasPermission = true;
    }

    if (!hasPermission) {
      return res.status(403).json({ message: "You don't have permission to edit this task" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate, assignedTo, team },
      { new: true }
    ).populate("createdBy", "name email");

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permission: creator or team member
    let hasPermission = false;
    
    if (existingTask.createdBy.toString() === req.userId) {
      hasPermission = true;
    } else if (existingTask.team) {
      const teamDoc = await Team.findOne({ _id: existingTask.team, members: req.userId });
      if (teamDoc) hasPermission = true;
    }

    if (!hasPermission) {
      return res.status(403).json({ message: "You don't have permission to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

export default router;
