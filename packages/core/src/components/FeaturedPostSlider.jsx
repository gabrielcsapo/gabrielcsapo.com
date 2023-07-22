import React, { useState } from "react";
import styles from "./FeaturedPostSlider.module.css";

import ArrowRightIcon from "./Icons/ArrowRightIcon";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";
import StarIcon from "./Icons/StarIcon";

const FeaturedPostSlider = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goForth = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const canGoBack = currentIndex > 0 && posts.length > 0;
  const canGoForward = currentIndex < posts.length - 1;

  const currentPost = posts[currentIndex];
  const { image, date, readingTime, title, slug, defaultSlug } =
    currentPost.element;

  return (
    <div className={styles.featuredPostSlider}>
      <img className={styles.bannerImage} src={image} alt="banner" />
      <a className={styles.content} href={slug ?? defaultSlug}>
        <div className={styles.featured}>
          <StarIcon />
          &nbsp;Featured
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.dateAndTime}>
          {date} • {readingTime.text}
        </div>
      </a>
      <div className={styles.buttons}>
        <button type="button" onClick={goBack} disabled={!canGoBack}>
          <ArrowLeftIcon />
        </button>
        <button type="button" onClick={goForth} disabled={!canGoForward}>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default FeaturedPostSlider;
