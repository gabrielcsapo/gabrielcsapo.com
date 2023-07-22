import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { timeSince } from "@utils/index";

import styles from "./FeaturedPostSlider.module.css";

import ArrowRightIcon from "./Icons/ArrowRightIcon";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";
import ImageLoader from "./ImageLoader";

const FeaturedPostSliderCard = ({
  post,
  canGoBack,
  canGoForward,
  goForth,
  goBack,
}) => {
  const { date, readingTime, title, slug, defaultSlug } = post;

  return (
    <>
      <div className={styles.imageOverlay}></div>
      <ImageLoader
        className={styles.bannerImage}
        alt={`${slug} image`}
        slug={slug}
      />
      <a className={styles.content} href={slug ?? defaultSlug}>
        <div className={styles.featured}>
          <FontAwesomeIcon icon={faStar} />
          &nbsp;Featured
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.dateAndTime}>
          {timeSince(new Date(date))} • {readingTime.text}
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
    </>
  );
};

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

  return (
    <div className={styles.featuredPostSlider}>
      <FeaturedPostSliderCard
        post={currentPost}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        goBack={goBack}
        goForth={goForth}
      />
    </div>
  );
};

export default FeaturedPostSlider;
