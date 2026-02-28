import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    body: { type: String, required: true }
  },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo"
    },
    assignee: { type: String },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    startDate: { type: Date },
    dueDate: { type: Date },
    comments: [CommentSchema]
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;

