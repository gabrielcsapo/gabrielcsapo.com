import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";

import { getPostImage } from "virtual:pages.jsx";

import styles from "./ImageLoader.module.css";

export default function ImageLoader({ slug, className, alt }) {
  const [image, setImage] = useState();
  const imgRef = useRef();

  useEffect(() => {
    let observer;

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadImage();
            observer.unobserve(imgRef.current);
          }
        },
        { threshold: 0.1 }
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
    console.log("loading", slug);
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
      {image.sources["webp"].map((image, index, images) => {
        return (
          <source
            key={image.src}
            srcSet={`${image.src} ${image.w}w`}
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
