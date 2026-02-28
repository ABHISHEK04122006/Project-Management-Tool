import React, { useEffect, useState } from "react";
import axios from "axios";
import KanbanBoard from "./components/KanbanBoard.jsx";
import GanttChart from "./components/GanttChart.jsx";
import CommentsPanel from "./components/CommentsPanel.jsx";
import AnalyticsCards from "./components/AnalyticsCards.jsx";

const API_BASE = "/api";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState("kanban");

  const [newProjectName, setNewProjectName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");

  const loadData = async () => {
    const [projectsRes, tasksRes] = await Promise.all([
      axios.get(`${API_BASE}/projects`),
      axios.get(`${API_BASE}/tasks`, {
        params: selectedProjectId ? { projectId: selectedProjectId } : {}
      })
    ]);
    setProjects(projectsRes.data);
    setTasks(tasksRes.data);
  };

  useEffect(() => {
    loadData().catch((err) => console.error(err));
  }, [selectedProjectId]);

  const handleCreateProject = async () => {
    if (!newProjectName) return;
    await axios.post(`${API_BASE}/projects`, {
      name: newProjectName,
      status: "backlog"
    });
    setNewProjectName("");
    await loadData();
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle || !selectedProjectId) return;

    if (
      newTaskStartDate &&
      newTaskDueDate &&
      newTaskStartDate > newTaskDueDate
    ) {
      alert("Start date cannot be after due date.");
      return;
    }

    await axios.post(`${API_BASE}/tasks`, {
      title: newTaskTitle,
      assignee: newTaskAssignee,
      project: selectedProjectId,
      status: newTaskStatus,
      priority: newTaskPriority,
      startDate: newTaskStartDate || null,
      dueDate: newTaskDueDate || null
    });

    setNewTaskTitle("");
    setNewTaskAssignee("");
    setNewTaskStartDate("");
    setNewTaskDueDate("");
    setNewTaskPriority("medium");
    setNewTaskStatus("todo");

    await loadData();
  };

  const handleTaskStatusChange = async (taskId, status) => {
    await axios.put(`${API_BASE}/tasks/${taskId}`, { status });
    await loadData();
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Delete task "${task.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    await axios.delete(`${API_BASE}/tasks/${task._id}`);

    if (selectedItem && selectedItem._id === task._id) {
      setSelectedItem(null);
    }

    await loadData();
  };

  const handleAddComment = async (item, comment) => {
    const isTask = !!item.title && !item.name;

    if (isTask) {
      await axios.post(`${API_BASE}/tasks/${item._id}/comments`, comment);
    } else {
      await axios.post(`${API_BASE}/projects/${item._id}/comments`, comment);
    }

    await loadData();
  };

  const handleDeleteProject = async (project) => {
    const confirmed = window.confirm(
      `Delete project "${project.name}"? This will also delete all related tasks.`
    );
    if (!confirmed) return;

    await axios.delete(`${API_BASE}/projects/${project._id}`);

    if (selectedProjectId === project._id) {
      setSelectedProjectId("");
    }

    if (selectedItem && selectedItem._id === project._id) {
      setSelectedItem(null);
    }

    await loadData();
  };

  const selectedProject =
    projects.find((p) => p._id === selectedProjectId) || null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Project Management Tool</h1>
        <div className="header-right">
          <button
            className={view === "kanban" ? "active" : ""}
            onClick={() => setView("kanban")}
          >
            Kanban
          </button>
          <button
            className={view === "gantt" ? "active" : ""}
            onClick={() => setView("gantt")}
          >
            Gantt
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="sidebar">
          <h2>Projects</h2>

          <div className="project-list">
            {projects.map((p) => (
              <div
                key={p._id}
                className={
                  "project-item" +
                  (p._id === selectedProjectId ? " selected" : "")
                }
                onClick={() => {
                  setSelectedProjectId(p._id);
                  setSelectedItem(p);
                }}
              >
                <div className="project-item-main">
                  <div className="project-name">{p.name}</div>
                  {p.analytics && (
                    <div className="project-analytics">
                      {p.analytics.doneTasks}/{p.analytics.totalTasks} done
                    </div>
                  )}
                </div>

                <button
                  className="project-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(p);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="project-form">
            <input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <button onClick={handleCreateProject}>Add Project</button>
          </div>

          <AnalyticsCards projects={projects} tasks={tasks} />
        </section>

        <section className="content">
          <div className="toolbar">
            <h2>Add Task</h2>

            <div className="task-form">
              <input
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />

              <input
                placeholder="Assignee"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
              />

              <select
                className="task-input"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

              {/* Dates only visible in Gantt view */}
              {view === "gantt" && (
                <>
                  <input
                    type="date"
                    value={newTaskStartDate}
                    onChange={(e) => setNewTaskStartDate(e.target.value)}
                  />

                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </>
              )}

              <select
                className="task-input"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>

              <button
                onClick={handleCreateTask}
                disabled={!selectedProjectId}
              >
                Add Task
              </button>
            </div>
          </div>

          {view === "kanban" ? (
            <KanbanBoard
              tasks={tasks}
              onStatusChange={handleTaskStatusChange}
              onSelectTask={setSelectedItem}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <GanttChart tasks={tasks} />
          )}
        </section>

        <aside className="aside">
          <CommentsPanel item={selectedItem} onAddComment={handleAddComment} />
        </aside>
      </main>
    </div>
  );
}