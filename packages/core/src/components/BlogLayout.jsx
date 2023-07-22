import React, { useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import mediumZoom from "medium-zoom";
import { NavLink, useLocation } from "react-router-dom";

import Layout from "../Layout";
import CodeBlock from "./CodeBlock";
import styles from "./BlogLayout.module.css";
import clsx from "clsx";

const FullWidthImage = (props) => {
  const { alt, src } = props;
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
      <picture>
        <source srcSet={src} type="image/webp" />
        <img alt={alt} ref={attachZoom} />
      </picture>
      {alt && <figcaption className={styles.imageCaption}>{alt}</figcaption>}
    </div>
  );
};

const HeadingWithAnchor = ({ level, children }) => {
  const location = useLocation();
  const Tag = `h${level}`;
  const slug = children.toLowerCase().replace(/\W+/g, "-");

  return (
    <Tag id={slug}>
      <NavLink
        to={`#${slug}`}
        className={() => {
          return clsx(
            location.hash === `#${slug}` ? "active" : "inactive",
            styles.headers
          );
        }}
      >
        🔗 &nbsp;
        {children}
      </NavLink>
    </Tag>
  );
};

const components = {
  h1: (props) => <HeadingWithAnchor level={1} {...props} />,
  h2: (props) => <HeadingWithAnchor level={2} {...props} />,
  h3: (props) => <HeadingWithAnchor level={3} {...props} />,
  h4: (props) => <HeadingWithAnchor level={4} {...props} />,
  h5: (props) => <HeadingWithAnchor level={5} {...props} />,
  h6: (props) => <HeadingWithAnchor level={6} {...props} />,
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
