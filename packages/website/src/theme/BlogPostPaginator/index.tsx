/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import type { Props } from "@theme/BlogPostPaginator";
import clsx from "clsx";

import styles from "./styles.module.css";

export default function BlogPostPaginator(props: Props): JSX.Element {
  const { nextItem, prevItem } = props;

  return (
    <nav
      className={clsx(
        "pagination-nav docusaurus-mt-lg",
        styles.blogPostPaginator
      )}
      aria-label={translate({
        id: "theme.blog.post.paginator.navAriaLabel",
        message: "Blog post page navigation",
        description: "The ARIA label for the blog posts pagination",
      })}
    >
      {prevItem && (
        <PaginatorNavLink
          {...prevItem}
          subLabel={
            <Translate
              id="theme.blog.post.paginator.newerPost"
              description="The blog post button label to navigate to the newer/previous post"
            >
              Newer Post
            </Translate>
          }
        />
      )}
      {nextItem && (
        <PaginatorNavLink
          {...nextItem}
          subLabel={
            <Translate
              id="theme.blog.post.paginator.olderPost"
              description="The blog post button label to navigate to the older/next post"
            >
              Older Post
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}
