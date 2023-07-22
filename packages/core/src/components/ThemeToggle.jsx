import React, { useEffect, useState } from "react";

import styles from "./ThemeToggle.module.css";
import MoonIcon from "./Icons/MoonIcon";
import SunIcon from "./Icons/SunIcon";

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("user-theme")
  );

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("user-theme", theme);
    setCurrentTheme(theme);
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  useEffect(() => {
    const userTheme = localStorage.getItem("user-theme");
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
  }, []);

  return (
    <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
      {currentTheme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
