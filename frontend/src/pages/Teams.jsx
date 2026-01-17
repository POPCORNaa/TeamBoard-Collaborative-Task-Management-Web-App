import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Teams() {
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    team: "",
  });
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchTasks();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchTeams();
        setShowCreateForm(false);
        setFormData({ name: "", description: "" });
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to create team");
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/v1/teams/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      if (res.ok) {
        fetchTeams();
        fetchTasks(); // Refresh tasks to get team tasks
        setShowJoinForm(false);
        setInviteCode("");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to join team");
    }
  };

  const handleLeave = async (teamId) => {
    if (!confirm(t("teams.confirmLeave"))) return;
    try {
      const res = await fetch(`/api/v1/teams/${teamId}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchTeams();
        fetchTasks(); // Refresh tasks
        setSelectedTeam(null);
      }
    } catch (error) {
      console.error("Failed to leave team:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      team: task.team || "",
    });
    setShowEditTaskForm(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskFormData),
      });
      if (res.ok) {
        fetchTasks();
        setShowEditTaskForm(false);
        setEditingTask(null);
        setTaskFormData({ title: "", description: "", priority: "medium", dueDate: "", team: "" });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#dc3545";
      case "medium": return "#ffc107";
      case "low": return "#28a745";
      default: return "#6c757d";
    }
  };

  // Get team tasks
  const getTeamTasks = (teamId) => {
    return tasks.filter(task => task.team === teamId);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>{t("app.title")}</h1>
        <div className="header-row">
          <nav>
            <Link to="/dashboard" className="nav-link">{t("nav.tasks")}</Link>
            <Link to="/teams" className="nav-link active">{t("nav.teams")}</Link>
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
        <div className="teams-header">
          <h2>{t("teams.yourTeams")}</h2>
          <div className="teams-actions">
            <button onClick={() => setShowCreateForm(true)} className="add-btn">
              {t("teams.createTeam")}
            </button>
            <button onClick={() => setShowJoinForm(true)} className="join-btn">
              {t("teams.joinTeam")}
            </button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {showCreateForm && (
          <div className="task-form-overlay">
            <div className="task-form">
              <h3>{t("teams.createTeam")}</h3>
              <form onSubmit={handleCreate}>
                <input
                  type="text"
                  placeholder={t("teams.teamName")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <textarea
                  placeholder={t("teams.description")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="form-buttons">
                  <button type="submit">{t("teams.create")}</button>
                  <button type="button" onClick={() => setShowCreateForm(false)}>{t("teams.cancel")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showJoinForm && (
          <div className="task-form-overlay">
            <div className="task-form">
              <h3>{t("teams.joinTeam")}</h3>
              <form onSubmit={handleJoin}>
                <input
                  type="text"
                  placeholder={t("teams.inviteCode")}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">{t("teams.join")}</button>
                  <button type="button" onClick={() => setShowJoinForm(false)}>{t("teams.cancel")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditTaskForm && (
          <div className="task-form-overlay">
            <div className="task-form">
              <h3>Edit Task</h3>
              <form onSubmit={handleUpdateTask}>
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                />
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                />
                <div className="form-buttons">
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setShowEditTaskForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="teams-list">
          {teams.length === 0 ? (
            <p className="no-tasks">{t("teams.noTeams")}</p>
          ) : (
            teams.map((team) => (
              <div key={team._id} className="task-card">
                <div className="task-header-row">
                  <h3>{team.name}</h3>
                  <button 
                    className="add-btn"
                    onClick={() => setSelectedTeam(selectedTeam === team._id ? null : team._id)}
                  >
                    {selectedTeam === team._id ? "Hide Tasks" : "View Tasks"}
                  </button>
                </div>
                {team.description && <p>{team.description}</p>}
                <div className="team-info">
                  <span>{t("teams.members")}: {team.members.length}</span>
                  <span>{t("teams.code")}: <strong>{team.inviteCode}</strong></span>
                </div>
                <div className="team-members">
                  {team.members.map((member) => (
                    <span key={member._id} className="member-badge">
                      {member.name}
                    </span>
                  ))}
                </div>
                
                {/* Team Tasks */}
                {selectedTeam === team._id && (
                  <div className="team-tasks">
                    <h4 style={{ marginTop: "20px", marginBottom: "15px", color: "var(--text-primary)" }}>
                      Team Tasks ({getTeamTasks(team._id).length})
                    </h4>
                    {getTeamTasks(team._id).length === 0 ? (
                      <p className="no-tasks">No tasks for this team yet.</p>
                    ) : (
                      getTeamTasks(team._id).map((task) => (
                        <div key={task._id} className={`task-card ${task.status}`} style={{ marginBottom: "10px" }}>
                          <div className="task-header-row">
                            <span
                              className="priority-badge"
                              style={{ background: getPriorityColor(task.priority) }}
                            >
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task, e.target.value)}
                              className="status-select"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                          <h3>{task.title}</h3>
                          {task.description && <p>{task.description}</p>}
                          {task.dueDate && (
                            <p className="due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          )}
                          {task.createdBy && (
                            <p className="created-by">Created by: {task.createdBy.name || task.createdBy.email}</p>
                          )}
                          <div className="task-actions">
                            <button onClick={() => handleEditTask(task)}>Edit</button>
                            <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                <button onClick={() => handleLeave(team._id)} className="delete-btn" style={{ marginTop: "15px" }}>
                  {t("teams.leave")}
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
