import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    body: { type: String, required: true }
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["backlog", "in-progress", "review", "done"],
      default: "backlog"
    },
    startDate: { type: Date },
    endDate: { type: Date },
    members: [{ type: String }],
    comments: [CommentSchema]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;

