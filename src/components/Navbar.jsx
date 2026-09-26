import LinkedInLink from "@components/LinkedInLink";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <nav className="wrap nav" aria-label="Main navigation">
        <Link className="wordmark" to="/">
          gc<span>.</span>
        </Link>
        <div className="nav-links">
          <LinkedInLink />
          <button
            onClick={toggleTheme}
            className="theme-button"
            aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
          >
            {theme === "dark" ? "◐" : "◑"}
          </button>
        </div>
      </nav>
    </header>
  );
}
