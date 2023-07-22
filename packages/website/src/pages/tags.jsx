import { Link } from "react-router-dom";

import { posts } from "virtual:pages.jsx";

import styles from "./tags.module.css";
import { useTitle } from "@utils/useTitle";

export default function Tags() {
  useTitle("Tags Page");

  const tags = posts
    .flatMap((post) => post.tags)
    .reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

  return (
    <ul className={styles.tagsContainer}>
      {Object.keys(tags).map((tagName) => {
        const tagCount = tags[tagName];
        return (
          <li key={tagName} className={styles.tagItem}>
            <Link to={`/tags/${tagName}`} className={styles.tagLink}>
              <span className={styles.tagName}>{tagName}</span>
              <span className={styles.tagCount}>({tagCount})</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
