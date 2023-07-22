import React from "react";
import { Link } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import ThemeToggle from "@components/ThemeToggle";

import styles from "./Layout.module.css";

import { globals } from "virtual:pages";
import RSSIcon from "./components/Icons/RSSIcon";

const components = {
  // Define custom components here if needed
  img: (props) => {
    return React.createElement("img", { ...props });
  },
};

export default function Layout({ children }) {
  return (
    <div className={styles.app}>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <Link to="/">{globals.siteName}</Link>
        </div>
        <ul className={styles.navbarLinks}></ul>
        <ThemeToggle />
      </nav>

      <MDXProvider components={components} children={children} />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2023 Gabriel J. Csapo. All Rights Reserved.</p>
        <p>
          <a href="/feed.xml" className={styles.footerIcon}>
            <RSSIcon />
          </a>{" "}
          |{" "}
        </p>
      </footer>
    </div>
  );
}
