import { useParams } from "react-router-dom";

import BlogCard from "@components/BlogCard";

import { posts } from "virtual:pages.jsx";

import styles from "./:name.module.css";

export default function Tags() {
  const { name: tagName } = useParams();

  const postsForTag = posts.filter((post) => {
    return post.tags && post.tags.indexOf(tagName) > -1;
  });

  return (
    <div className={styles.tagContainer}>
      <h3 className={styles.tagTitle}>
        Posts for{" "}
        <b>
          {tagName} ({postsForTag.length})
        </b>
      </h3>
      <div className={styles.postContainer}>
        {postsForTag.map((post) => {
          return <BlogCard key={post} post={post} />;
        })}
      </div>
    </div>
  );
}
