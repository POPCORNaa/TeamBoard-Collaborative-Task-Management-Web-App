import express from "express";
import users from "./users.js";
import emojis from "./emojis.js";
import auth from "./auth.js";
import tasks from "./tasks.js";
import teams from "./teams.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ message: "API - 👋🌎🌍🌏" });
});

router.use("/auth", auth);
router.use("/users", users);
router.use("/emojis", emojis);
router.use("/tasks", tasks);
router.use("/teams", teams);

export default router;
