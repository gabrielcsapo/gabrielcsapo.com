import React from "react";
import { MDXProvider } from "@mdx-js/react";

import Navbar from "@components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";

import styles from "./Layout.module.css";

const components = {
  img: (props) => {
    return React.createElement("img", { ...props });
  },
};

export default function Layout({ children }) {
  return (
    <div className={styles.app}>
      <Navbar />

      <MDXProvider components={components} children={children} />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2023 Gabriel J. Csapo. All Rights Reserved.</p>
        <p>
          <a
            href="/feed.xml"
            className={styles.footerIcon}
            aria-label="RSS Link"
          >
            <FontAwesomeIcon icon={faRss} />
          </a>{" "}
          |{" "}
        </p>
      </footer>
    </div>
  );
}
