import React, { useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import mediumZoom from "medium-zoom";

import Layout from "../Layout";
import CodeBlock from "./CodeBlock";
import styles from "./BlogLayout.module.css";

const FullWidthImage = (props) => {
  const { alt } = props;
  const zoomRef = useRef(null);

  function getZoom() {
    if (zoomRef.current === null) {
      zoomRef.current = mediumZoom({});
    }

    return zoomRef.current;
  }

  function attachZoom(image) {
    const zoom = getZoom();

    if (image) {
      zoom.attach(image);
    } else {
      zoom.detach();
    }
  }

  return (
    <div className={styles.fullWidthImage}>
      <img {...props} ref={attachZoom} />
      {alt && <figcaption className={styles.imageCaption}>{alt}</figcaption>}
    </div>
  );
};

const components = {
  img: FullWidthImage,
  code: ({ className, children }) => {
    const language = className ? className.replace("langauge-", "") : "";

    return language ? (
      <CodeBlock language={language} code={children} />
    ) : (
      <code>{children}</code>
    );
  },
};

export default function BlogLayout(props) {
  const { tags, title, image, author, date, slug, children } = props;

  return (
    <Layout>
      <div className={styles.blogLayout}>
        <div
          className={styles.bannerImage}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className={styles.heading}>
          <div className={styles.title}>{title}</div>
          <div className={styles.date}>{new Date(date).toDateString()}</div>
        </div>
        <div className={styles.content}>
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>
      </div>
    </Layout>
  );
}
