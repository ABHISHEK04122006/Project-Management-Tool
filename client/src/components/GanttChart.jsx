import React from "react";

function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
}

export default function GanttChart({ tasks }) {
  const datedTasks = tasks.filter((t) => t.startDate && t.dueDate);
  if (datedTasks.length === 0) {
    return <div className="gantt-empty">No tasks with dates to display.</div>;
  }

  const startDates = datedTasks.map((t) => new Date(t.startDate));
  const minStart = new Date(Math.min(...startDates));

  return (
    <div className="gantt-container">
      <h3>Gantt Chart (Timeline)</h3>
      <div className="gantt-list">
        {datedTasks.map((task) => {
          const offsetDays = daysBetween(minStart, task.startDate);
          const durationDays = daysBetween(task.startDate, task.dueDate);
          return (
            <div key={task._id} className="gantt-row">
              <div className="gantt-label">
                {task.title}{" "}
                <span className="gantt-dates">
                  ({task.startDate?.slice(0, 10)} →{" "}
                  {task.dueDate?.slice(0, 10)})
                </span>
              </div>
              <div className="gantt-bar-wrapper">
                <div
                  className="gantt-bar"
                  style={{
                    marginLeft: `${offsetDays * 12}px`,
                    width: `${durationDays * 12}px`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

