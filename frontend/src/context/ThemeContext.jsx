import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const themes = {
  light: {
    name: "Light",
    "--bg-primary": "#eee9e1",
    "--bg-secondary": "#f5f2ed",
    "--text-primary": "#333333",
    "--text-secondary": "#666666",
    "--accent": "#007bff",
    "--accent-hover": "#0056b3",
    "--danger": "#dc3545",
    "--success": "#28a745",
    "--warning": "#ffc107",
    "--border": "#dddddd",
  },
  dark: {
    name: "Dark",
    "--bg-primary": "#1a1a2e",
    "--bg-secondary": "#16213e",
    "--text-primary": "#eaeaea",
    "--text-secondary": "#b0b0b0",
    "--accent": "#4dabf7",
    "--accent-hover": "#339af0",
    "--danger": "#ff6b6b",
    "--success": "#51cf66",
    "--warning": "#fcc419",
    "--border": "#2d3748",
  },
  ocean: {
    name: "Ocean",
    "--bg-primary": "#a9bec4",
    "--bg-secondary": "#f5f2ed",
    "--text-primary": "#1a535c",
    "--text-secondary": "#4a7c82",
    "--accent": "#4ecdc4",
    "--accent-hover": "#3db9b1",
    "--danger": "#ff6b6b",
    "--success": "#2ecc71",
    "--warning": "#f39c12",
    "--border": "#b8d4d9",
  },
  sunset: {
    name: "Sunset",
    "--bg-primary": "#e2c1ad",
    "--bg-secondary": "#f5f2ed",
    "--text-primary": "#4a3728",
    "--text-secondary": "#7a6455",
    "--accent": "#ff6b6b",
    "--accent-hover": "#ee5a5a",
    "--danger": "#e74c3c",
    "--success": "#27ae60",
    "--warning": "#f39c12",
    "--border": "#e8d5d5",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeVars = themes[theme];
    
    Object.entries(themeVars).forEach(([key, value]) => {
      if (key.startsWith("--")) {
        root.style.setProperty(key, value);
      }
    });
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themes, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
