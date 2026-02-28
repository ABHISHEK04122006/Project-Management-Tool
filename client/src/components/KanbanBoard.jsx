import React from "react";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" }
];

export default function KanbanBoard({
  tasks,
  onStatusChange,
  onSelectTask,
  onDeleteTask
}) {
  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (event, status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) return;
    onStatusChange(taskId, status);
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <div className="kanban-container">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="kanban-column"
          onDragOver={allowDrop}
          onDrop={(e) => handleDrop(e, col.id)}
        >
          <h3>{col.title}</h3>
          {tasks
            .filter((t) => t.status === col.id)
            .map((task) => (
              <div
                key={task._id}
                className="kanban-card"
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
              >
                <div
                  className="kanban-card-main"
                  onClick={() => onSelectTask(task)}
                >
                  <div className="kanban-card-title">{task.title}</div>
                  <div className="kanban-card-meta">
                    <span>{task.assignee || "Unassigned"}</span>
                    <span className={`priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="kanban-card-actions">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      onStatusChange(task._id, e.target.value)
                    }
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    className="task-delete-btn"
                    onClick={() => onDeleteTask?.(task)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

