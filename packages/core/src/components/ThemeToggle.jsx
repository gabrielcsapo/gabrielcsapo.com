import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import styles from "./ThemeToggle.module.css";
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
      {theme === "dark" ? (
        <FontAwesomeIcon icon={faMoon} />
      ) : (
        <FontAwesomeIcon icon={faSun} />
      )}
    </button>
  );
};

export default ThemeToggle;
