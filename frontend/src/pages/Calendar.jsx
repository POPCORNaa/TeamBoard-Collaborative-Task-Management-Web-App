import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";   // ★ 修复 require —— 必须改成 import
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ★ 修复后的 locales
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/v1/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const tasks = await res.json();
        const calendarEvents = tasks
          .filter((task) => task.dueDate)
          .map((task) => ({
            id: task._id,
            title: task.title,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
            resource: task,
          }));
        setEvents(calendarEvents);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSelectEvent = (event) => {
    navigate("/dashboard");
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#007bff";
    if (event.resource.priority === "high") backgroundColor = "#dc3545";
    if (event.resource.priority === "low") backgroundColor = "#28a745";
    if (event.resource.status === "done") backgroundColor = "#6c757d";

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: event.resource.status === "done" ? 0.6 : 1,
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div className="dashboard">
      <header>
        <h1>{t("app.title")}</h1>
        <div className="header-row">
          <nav>
            <Link to="/dashboard" className="nav-link">{t("nav.tasks")}</Link>
            <Link to="/teams" className="nav-link">{t("nav.teams")}</Link>
            <Link to="/calendar" className="nav-link active">Calendar</Link>
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
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day"]}
          />
        </div>
      </main>
    </div>
  );
}
