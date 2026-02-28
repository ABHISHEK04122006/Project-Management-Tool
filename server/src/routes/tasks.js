import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { project: projectId } : {};
    const tasks = await Task.find(filter)
      .populate("project", "name")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Create task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating task" });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error updating task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting task" });
  }
});

// Add comment to task
router.post("/:id/comments", async (req, res) => {
  try {
    const { author, body } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.comments.push({ author, body });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error adding comment" });
  }
});

export default router;

