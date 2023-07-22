import React from "react";
import { MDXProvider } from "@mdx-js/react";
import CodeBlock from "./CodeBlock";

import Layout from "../Layout";
import styles from "./BlogLayout.module.css";

const FullWidthImage = (props) => {
  const { alt } = props;

  return (
    <div className={styles.fullWidthImage}>
      <img {...props} />
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
