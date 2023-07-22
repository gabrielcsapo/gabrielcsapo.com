import React, { useEffect, useState } from "react";

import clsx from "clsx";

import styles from "./ImageLoader.module.css";

import { getPostImage } from "virtual:pages.jsx";

export default function ImageLoader({ slug, className, alt }) {
  const [image, setImage] = useState();

  useEffect(() => {
    async function fetchImage() {
      const potentialImage = await getPostImage(slug);
      setImage(potentialImage.default);
    }
    fetchImage();
  }, [slug]);

  if (!image) {
    return <div className={clsx(className, styles.placeholder)}></div>;
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
