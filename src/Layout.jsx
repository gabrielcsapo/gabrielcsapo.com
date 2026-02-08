import React from "react";
import { MDXProvider } from "@mdx-js/react";

import Navbar from "@components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const components = {
  img: (props) => {
    return React.createElement("img", { ...props });
  },
};

export default function Layout(props) {
  const { children } = props;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <MDXProvider components={components} children={children} />
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-800 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-surface-500 dark:text-surface-400">
            &copy; {new Date().getFullYear()} Gabriel J. Csapo
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="/feed.xml"
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                aria-label="RSS Feed"
              >
                <FontAwesomeIcon icon={faRss} className="w-4 h-4" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/gabrielcsapo"
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                aria-label="LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/gabrielcsapo"
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
