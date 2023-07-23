import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

import { timeSince } from "@utils/index";

import styles from "./FeaturedPostSlider.module.css";

import ImageLoader from "./ImageLoader";
import IconButton from "./IconButton";

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
        lazy={false}
      />
      <a className={styles.content} href={slug ?? defaultSlug}>
        <div className={styles.featured}>
          <FontAwesomeIcon icon={icon({ name: "star", style: "solid" })} />
          &nbsp;Featured
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.dateAndTime}>
          {timeSince(new Date(date))} • {readingTime.text}
        </div>
      </a>
      <div className={styles.buttons}>
        <IconButton
          circle={false}
          disabled={!canGoBack}
          onClick={goBack}
          icon={icon({ name: "arrow-left-long", style: "solid" })}
        />
        <IconButton
          circle={false}
          disabled={!canGoForward}
          onClick={goForth}
          icon={icon({ name: "arrow-right-long", style: "solid" })}
        />
      </div>
    </>
  );
};

const FeaturedPostSlider = ({ posts }) => {
  const sortedPosts = posts.sort((a, b) => {
    var c = new Date(a.date);
    var d = new Date(b.date);

    return d - c;
  });
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
