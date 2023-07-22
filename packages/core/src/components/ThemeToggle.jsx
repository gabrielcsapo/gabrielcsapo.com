import React from "react";

import styles from "./ThemeToggle.module.css";
import MoonIcon from "./Icons/MoonIcon";
import SunIcon from "./Icons/SunIcon";
import { useTheme } from "../ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle Theme"
      className={styles.themeToggle}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
