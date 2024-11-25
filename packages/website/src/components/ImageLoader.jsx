import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";

import { getPostImage } from "virtual:pages.jsx";

import styles from "./ImageLoader.module.css";

export default function ImageLoader({ slug, className, alt, lazy }) {
  const [image, setImage] = useState();
  const imgRef = useRef();

  useEffect(() => {
    let observer;

    if (typeof IntersectionObserver !== "undefined" && lazy) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadImage();
            observer.unobserve(imgRef.current);
          }
        },
        { threshold: 0.1 },
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
    } else {
      loadImage();
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [slug]);

  async function loadImage() {
    const potentialImage = await getPostImage(slug);
    setImage(potentialImage.default);
  }

  if (!image) {
    return (
      <div ref={imgRef} className={clsx(className, styles.placeholder)}></div>
    );
  }

  return (
    <picture className={className}>
      {image.sources["webp"].split(",").map((image, index, images) => {
        const parts = image.trim().split(" ");

        return (
          <source
            key={image.trim()}
            srcSet={image.trim()}
            media={
              index !== images.length - 1 ? `(max-width: ${image.w}px)` : ""
            }
            type="image/webp"
          />
        );
      })}
      <img className={className} alt={alt} />
    </picture>
  );
}
