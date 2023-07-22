import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { timeSince } from "@utils/index";

import { getPostImage } from "virtual:pages.jsx";

import styles from "./BlogCard.module.css";

const BlogCard = ({ post, className }) => {
  const [image, setImage] = useState();
  const { tags, title, author, date, slug, defaultSlug, readingTime } = post;

  useEffect(() => {
    async function fetchImage() {
      const potentialImage = await getPostImage(slug);
      setImage(potentialImage.default);
    }
    fetchImage();
  }, []);

  return (
    <a className={clsx(className, styles.blogCard)} href={slug ?? defaultSlug}>
      <div className={styles.image}>
        <picture>
          <source srcSet={image} type="image/webp" />
          <img alt={`${slug} image`} />
        </picture>
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
