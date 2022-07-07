import React from "react";
import clsx from "clsx";
import IdealImage from "@theme/IdealImage";

import styles from "./styles.module.css";

function transformImgClassName(className) {
  return clsx(className, styles.img);
}

export default function MDXImg(props) {
  return (
    <figure>
      <img
        loading="lazy"
        {...props}
        className={transformImgClassName(props.className)}
      />
      {props.alt && (
        <figcaption style={{ textAlign: "center" }}>
          <blockquote>{props.alt}</blockquote>
        </figcaption>
      )}
    </figure>
  );
}