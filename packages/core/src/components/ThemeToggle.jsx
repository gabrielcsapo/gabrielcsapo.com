import React from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "../ThemeProvider";
import IconButton from "./IconButton";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      icon={theme === "dark" ? faMoon : faSun}
    />
  );
};

export default ThemeToggle;
