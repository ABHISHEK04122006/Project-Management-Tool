import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const router = express.Router();

// Get all projects with basic task counts (analytics)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    const projectIds = projects.map((p) => p._id);

    const taskCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
          doneTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "done"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const countsByProject = taskCounts.reduce((acc, item) => {
      acc[item._id.toString()] = {
        totalTasks: item.totalTasks,
        doneTasks: item.doneTasks
      };
      return acc;
    }, {});

    const data = projects.map((p) => ({
      ...p,
      analytics: countsByProject[p._id.toString()] || {
        totalTasks: 0,
        doneTasks: 0
      }
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Create project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating project" });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error updating project" });
  }
});

// Delete project and its tasks
router.delete("/:id", async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project and related tasks deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error deleting project" });
  }
});

// Add comment to project
router.post("/:id/comments", async (req, res) => {
  try {
    const { author, body } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    project.comments.push({ author, body });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error adding comment" });
  }
});

export default router;

