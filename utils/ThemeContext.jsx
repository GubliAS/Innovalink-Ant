"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(()=>{localStorage.getItem("theme")});

  useEffect(() => {
    const userPreference = localStorage.getItem("theme");
    if (userPreference) {
      setTheme(userPreference);
      document.documentElement.classList.toggle("dark", userPreference === "dark");
    } else {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = systemPreference ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", systemPreference);
    }
  }, []);

  // 💡 Update status bar color when theme changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }

    // Set black for dark mode, white for light mode
    const color = theme === "dark" ? "#000000" : "#ffffff";
    meta.setAttribute("content", color);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
