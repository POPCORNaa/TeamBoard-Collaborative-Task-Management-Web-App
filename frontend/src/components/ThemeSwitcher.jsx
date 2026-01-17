import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, themes, toggleTheme } = useTheme();

  return (
    <div className="theme-switcher">
      <select value={theme} onChange={(e) => toggleTheme(e.target.value)}>
        {Object.entries(themes).map(([key, value]) => (
          <option key={key} value={key}>
            {value.name}
          </option>
        ))}
      </select>
    </div>
  );
}
