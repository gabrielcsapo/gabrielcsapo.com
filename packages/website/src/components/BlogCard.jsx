import React from "react";
import clsx from "clsx";

import { timeSince } from "@utils/index";

import styles from "./BlogCard.module.css";
import ImageLoader from "./ImageLoader";

const BlogCard = ({ post, className }) => {
  const { tags, title, author, date, slug, defaultSlug, readingTime } = post;

  return (
    <a className={clsx(className, styles.blogCard)} href={slug ?? defaultSlug}>
      <div className={styles.image}>
        <ImageLoader slug={slug} />
      </div>

      <div className={styles.articleComponent}>
        {tags && <div className={styles.tag}>{tags[0]}</div>}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.meta}>
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
