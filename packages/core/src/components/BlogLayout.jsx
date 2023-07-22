import React, { useRef, useState, useEffect } from "react";
import { MDXProvider } from "@mdx-js/react";
import mediumZoom from "medium-zoom";
import { NavLink, Link, useLocation } from "react-router-dom";
import clsx from "clsx";

import { getPostImage } from "virtual:pages.jsx";

import Layout from "../Layout";
import CodeBlock from "./CodeBlock";
import styles from "./BlogLayout.module.css";

const ResponsiveTable = ({ children }) => {
  return <table className={styles.table}>{children}</table>;
};

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
      <div className={styles.fullWidthImageContent}>
        <picture>
          <source srcSet={src} type="image/webp" />
          <img alt={alt} ref={attachZoom} />
        </picture>
        {alt && <figcaption className={styles.imageCaption}>{alt}</figcaption>}
      </div>
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

function CustomLink({ href, children }) {
  if (href.indexOf("/files/") > -1) {
    const assetFileLink = href.substring(href.indexOf("/files/"), href.length);

    return <a href={assetFileLink}>{children}</a>;
  }

  return <a href={href}>{children}</a>;
}

const components = {
  h1: (props) => <HeadingWithAnchor level={1} {...props} />,
  h2: (props) => <HeadingWithAnchor level={2} {...props} />,
  h3: (props) => <HeadingWithAnchor level={3} {...props} />,
  h4: (props) => <HeadingWithAnchor level={4} {...props} />,
  h5: (props) => <HeadingWithAnchor level={5} {...props} />,
  h6: (props) => <HeadingWithAnchor level={6} {...props} />,
  table: ResponsiveTable,
  a: (props) => <CustomLink {...props} />,
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
  const [image, setImage] = useState();
  const { tags, title, author, date, slug, children, readingTime } = props;

  useEffect(() => {
    async function fetchImage() {
      const potentialImage = await getPostImage(slug);
      setImage(potentialImage.default);
    }
    fetchImage();
  }, []);

  return (
    <Layout>
      <div className={styles.blogLayout}>
        <picture className={styles.bannerImage}>
          <source srcSet={image} type="image/webp" />
          <img alt={`${slug} image`} />
        </picture>
        <div className={styles.heading}>
          <div className={styles.title}>{title}</div>
          <ul className={styles.tagsContainer}>
            {tags.map((tagName) => {
              return (
                <li key={tagName} className={styles.tagItem}>
                  <Link to={`/tags/${tagName}`}>{tagName}</Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.date}>{new Date(date).toDateString()}</div>
        </div>
        <div className={styles.content}>
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>
      </div>
    </Layout>
  );
}
