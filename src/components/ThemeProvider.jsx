import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children, theme }) => {
  const [currentTheme, setCurrentTheme] = useState(
    theme || localStorage.getItem("user-theme") || "light",
  );

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setCurrentTheme(newTheme);
  };

  useEffect(() => {
    const userTheme = theme ?? localStorage.getItem("user-theme");
    const handleThemeChange = (event) => {
      if (event.key === "user-theme") {
        applyTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleThemeChange);

    if (userTheme) {
      applyTheme(userTheme);
    } else {
      const systemTheme =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      applyTheme(systemTheme);
    }

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("user-theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
