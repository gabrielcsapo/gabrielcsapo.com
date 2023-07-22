import React from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@components/ThemeProvider";
import IconButton from "@components/IconButton";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      icon={theme === "dark" ? faMoon : faSun}
      ariaLabel={`Theme toggle currently ${theme}`}
    />
  );
};

export default ThemeToggle;
