import React from "react";

export default function AnalyticsCards({ projects, tasks }) {
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="analytics-container">
      <div className="analytics-card">
        <h4>Total Projects</h4>
        <div className="analytics-number">{totalProjects}</div>
      </div>
      <div className="analytics-card">
        <h4>Total Tasks</h4>
        <div className="analytics-number">{totalTasks}</div>
      </div>
      <div className="analytics-card">
        <h4>Completed Tasks</h4>
        <div className="analytics-number">
          {completedTasks} ({completionRate}%)
        </div>
      </div>
    </div>
  );
}

