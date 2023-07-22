import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children, theme }) => {
  const [currentTheme, setCurrentTheme] = useState(
    theme || localStorage.getItem("user-theme") || "light"
  );

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    setCurrentTheme(theme);
  };

  useEffect(() => {
    const userTheme = theme ?? localStorage.getItem("user-theme");
    const handleThemeChange = (event) => {
      if (event.key === "user-theme") {
        setTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleThemeChange);

    if (userTheme) {
      // Set theme from local storage
      setTheme(userTheme);
    } else {
      // Set theme based on system preference
      const systemTheme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      setTheme(systemTheme);
    }

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("user-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
