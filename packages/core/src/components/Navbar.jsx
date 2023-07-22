import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faBars, faTag } from "@fortawesome/free-solid-svg-icons";

import ThemeToggle from "@components/ThemeToggle";
import SearchInput from "@components/SearchInput";

import { globals } from "virtual:pages.jsx";

import styles from "./Navbar.module.css";
import IconButton from "./IconButton";

export default function Navbar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsNavbarVisible(window.innerWidth > 768); // Adjust the breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <Link to="/">{globals.siteName}</Link>
        </div>
        {isNavbarVisible && (
          <>
            <ul className={styles.navbarLinks}>
              <li className={styles.navbarLinksItem}>
                <Link to="/posts">Posts</Link>
              </li>
            </ul>
            <div className={styles.navbarRight}>
              <IconButton to="/tags" icon={faTag} />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <SearchInput />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <ThemeToggle />
            </div>
          </>
        )}
        {!isNavbarVisible && (
          <IconButton onClick={toggleNavbar} icon={faBars} />
        )}
      </nav>
      {!isNavbarVisible && isExpanded && (
        <div className={styles.expandedContents}>
          <ul className={styles.expandedLinks}>
            <li className={styles.expandedLinksItem}>
              <Link to="/posts">Posts</Link>
            </li>
          </ul>
          <div className={styles.expandedRight}>
            <SearchInput />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
