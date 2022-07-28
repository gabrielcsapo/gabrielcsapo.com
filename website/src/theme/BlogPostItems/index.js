import React from "react";
import { BlogPostProvider } from "@docusaurus/theme-common/internal";
import BlogPostItem from "@theme/BlogPostItem";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import styles from "./styles.module.css";

export default function BlogPostItems({
  items,
  metadata,
  component: BlogPostItemComponent = BlogPostItem,
}) {
  const { postsPerPage = 10 } = metadata || {};
  const [singleSize, setSingleSize] = React.useState(false);

  if (ExecutionEnvironment.canUseDOM) {
    React.useEffect(() => {
      if (document.body.clientWidth <= 780) {
        setSingleSize(true);
      }
    }, [document.body.clientWidth]);
  }

  return (
    <>
      {items.map(({ content: BlogPostContent }, index) => {
        let style = {};

        /**
         * what is? `index === items.length - 1 && items.length < postsPerPage`
         * It is handling the case where we have less posts than the page
         * and the last post ends up defaulting to the default post but stretched 100% since it has no siblings
         */
        if (
          index % 6 === 0 ||
          index === 0 ||
          (index === items.length - 1 && items.length < postsPerPage)
        ) {
          style = {
            flex: "1 1 100%",
          };
        }

        return (
          <BlogPostProvider
            key={BlogPostContent.metadata.permalink}
            content={BlogPostContent}
          >
            <div className={styles.blogListPagePostContainer} style={style}>
              <BlogPostItemComponent
                largeFormat={
                  singleSize === false
                    ? index % 6 === 0 ||
                      index === 0 ||
                      (index === items.length - 1 &&
                        items.length < postsPerPage)
                    : false
                }
              >
                <BlogPostContent />
              </BlogPostItemComponent>
            </div>
          </BlogPostProvider>
        );
      })}
    </>
  );
}
