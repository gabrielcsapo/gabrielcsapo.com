/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";

import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogPostItem from "@theme/BlogPostItem";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import type { Props } from "@theme/BlogListPage";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import styles from "./styles.module.css";

function BlogListPageMetadata(props: Props): JSX.Element {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === "/";
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): JSX.Element {
  const { metadata, items, sidebar } = props;
  const { page, postsPerPage } = metadata;
  const [singleSize, setSingleSize] = React.useState(false);

  if (ExecutionEnvironment.canUseDOM) {
    React.useEffect(() => {
      if (document.body.clientWidth <= 780) {
        setSingleSize(true);
      }
    }, [document.body.clientWidth]);
  }

  return (
    <BlogLayout sidebar={sidebar}>
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
          <div className={styles.blogListPagePostContainer} style={style}>
            <BlogPostItem
              key={BlogPostContent.metadata.permalink}
              frontMatter={BlogPostContent.frontMatter}
              assets={BlogPostContent.assets}
              metadata={BlogPostContent.metadata}
              truncated={BlogPostContent.metadata.truncated}
              largeFormat={
                singleSize === false
                  ? index % 6 === 0 ||
                    index === 0 ||
                    (index === items.length - 1 && items.length < postsPerPage)
                  : false
              }
            >
              <BlogPostContent />
            </BlogPostItem>
          </div>
        );
      })}
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
