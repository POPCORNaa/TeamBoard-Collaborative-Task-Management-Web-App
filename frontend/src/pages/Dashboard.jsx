import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    team: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/v1/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/v1/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTask
        ? `/api/v1/tasks/${editingTask._id}`
        : "/api/v1/tasks";
      const method = editingTask ? "PUT" : "POST";

      const taskData = {
        ...formData,
        team: formData.team || null,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        fetchTasks();
        setShowForm(false);
        setEditingTask(null);
        setFormData({ title: "", description: "", priority: "medium", dueDate: "", team: "" });
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      team: task.team || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm(t("task.confirmDelete"))) return;
    try {
      const res = await fetch(`/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await fetch(`/api/v1/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#dc3545";
      case "medium": return "#ffc107";
      case "low": return "#28a745";
      default: return "#6c757d";
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.name : "";
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
  const pendingTasks = tasks.filter(t => t.status === "todo").length;

  return (
    <div className="dashboard">
      <header>
        <h1>{t("app.title")}</h1>
        <div className="header-row">
          <nav>
            <Link to="/dashboard" className="nav-link active">{t("nav.tasks")}</Link>
            <Link to="/teams" className="nav-link">{t("nav.teams")}</Link>
            <Link to="/calendar" className="nav-link">Calendar</Link>
          </nav>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <div className="user-info">
            <span>{t("dashboard.welcome")}, {user?.name}</span>
            <button onClick={handleLogout}>{t("auth.logout")}</button>
          </div>
        </div>
      </header>

      <main>
        <div className="analytics-container">
          <div className="analytics-card">
            <h3>Total Tasks</h3>
            <div className="number">{totalTasks}</div>
          </div>
          <div className="analytics-card success">
            <h3>Completed</h3>
            <div className="number">{completedTasks}</div>
          </div>
          <div className="analytics-card warning">
            <h3>In Progress</h3>
            <div className="number">{inProgressTasks}</div>
          </div>
          <div className="analytics-card danger">
            <h3>Pending</h3>
            <div className="number">{pendingTasks}</div>
          </div>
        </div>

        <div className="task-header">
          <h2>{t("dashboard.yourTasks")}</h2>
          <button
            className="add-btn"
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
              setFormData({ title: "", description: "", priority: "medium", dueDate: "", team: "" });
            }}
          >
            {t("dashboard.addTask")}
          </button>
        </div>

        {showForm && (
          <div className="task-form-overlay">
            <div className="task-form">
              <h3>{editingTask ? t("task.editTask") : t("task.newTask")}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={t("task.title")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder={t("task.description")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">{t("task.low")}</option>
                  <option value="medium">{t("task.medium")}</option>
                  <option value="high">{t("task.high")}</option>
                </select>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
                <select
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                >
                  <option value="">Personal Task</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
                <div className="form-buttons">
                  <button type="submit">{editingTask ? t("task.update") : t("task.create")}</button>
                  <button type="button" onClick={() => setShowForm(false)}>{t("task.cancel")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">{t("dashboard.noTasks")}</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.status} ${task.team ? 'team-task' : ''}`}>
                <div className="task-header-row">
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <span
                      className="priority-badge"
                      style={{ background: getPriorityColor(task.priority) }}
                    >
                      {t(`task.${task.priority}`)}
                    </span>
                    {task.team && (
                      <span className="team-badge">
                        {getTeamName(task.team)}
                      </span>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="status-select"
                  >
                    <option value="todo">{t("task.todo")}</option>
                    <option value="in-progress">{t("task.inProgress")}</option>
                    <option value="done">{t("task.done")}</option>
                  </select>
                </div>
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                {task.dueDate && (
                  <p className="due-date">{t("task.dueDate")}: {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
                {task.team && task.createdBy && (
                  <p className="created-by">Created by: {task.createdBy.name || task.createdBy.email}</p>
                )}
                <div className="task-actions">
                  <button onClick={() => handleEdit(task)}>{t("task.edit")}</button>
                  <button onClick={() => handleDelete(task._id)} className="delete-btn">{t("task.delete")}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
