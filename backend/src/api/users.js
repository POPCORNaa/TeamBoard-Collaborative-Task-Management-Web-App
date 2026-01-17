// src/api/users.js
import express from "express";
import { getUserById } from "../db.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;
