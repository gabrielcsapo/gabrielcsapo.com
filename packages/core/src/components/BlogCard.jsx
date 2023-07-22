import React from "react";
import { timeSince } from "@utils/index";

import styles from "./BlogCard.module.css";

const BlogCard = ({ post }) => {
  const { tags, title, image, author, date, slug, defaultSlug, readingTime } =
    post.element;

  return (
    <a className={styles.blogCard} href={slug ?? defaultSlug}>
      <div className={styles.image}>
        <img src={image} alt="Article" />
      </div>
      <div className={styles.articleComponent}>
        {tags && <div className={styles.tag}>{tags[0]}</div>}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.meta}>
            <span className={styles.author}>{author}</span>
            <span className={styles.date}>{timeSince(new Date(date))}</span>
            <span>&nbsp;•&nbsp;</span>
            <span>{Math.ceil(readingTime.minutes)} min read</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
