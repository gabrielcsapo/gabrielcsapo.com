import React, { useState } from "react";
import { Link } from "react-router-dom";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ThemeToggle from "@components/ThemeToggle";
import SearchInput from "@components/SearchInput";

import { globals } from "virtual:pages.jsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-semibold text-surface-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {globals.siteName}
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/posts"
            className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            Posts
          </Link>
          <Link
            to="/tags"
            className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            Tags
          </Link>
          <SearchInput />
          <ThemeToggle />
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 px-6 py-4 space-y-3">
          <Link
            to="/posts"
            className="block text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Posts
          </Link>
          <Link
            to="/tags"
            className="block text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Tags
          </Link>
          <div className="flex items-center gap-2 pt-2">
            <SearchInput />
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
