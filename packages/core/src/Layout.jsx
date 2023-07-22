import React from "react";
import { MDXProvider } from "@mdx-js/react";

import Navbar from "@components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

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

      <footer className={styles.footer}>
        <div>© 2023 Gabriel J. Csapo. All Rights Reserved.</div>
        <ul className={styles.footerLinks}>
          <li>
            <a
              href="/feed.xml"
              className={styles.footerIcon}
              aria-label="RSS Link"
            >
              <FontAwesomeIcon icon={faRss} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/gabrielcsapo"
              className={styles.footerIcon}
              aria-label="LinkedIn Link"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/gabrielcsapo"
              className={styles.footerIcon}
              aria-label="Github Link"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
