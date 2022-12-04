/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TOC from "@theme/TOC";
import React from "react";
import clsx from "clsx";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { usePluralForm, useColorMode } from "@docusaurus/theme-common";
import { blogPostContainerID } from "@docusaurus/utils-common";
import MDXContent from "@theme/MDXContent";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import TagsListInline from "@theme/TagsListInline";
import BlogPostAuthors from "@theme/BlogPostItem/Header/Authors";
import type { Props } from "@theme/BlogPostItem";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

import styles from "./styles.module.css";

const utterancesSelector = "iframe.utterances-frame";

// Very simple pluralization: probably good enough for now
function useReadingTimePlural() {
  const { selectMessage } = usePluralForm();
  return (readingTimeFloat: number) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: "theme.blog.post.readingTime.plurals",
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One min read|{readingTime} min read",
        },
        { readingTime }
      )
    );
  };
}

interface PropsExtended extends Props {
  largeFormat: boolean;
}

function BlogPostItemLargeFormat({
  permalink,
  image,
  TitleHeading,
  date,
  formattedDate,
  readingTime,
  authors,
  readingTimePlural,
  assets,
  withBaseUrl,
  title,
  tagsExists,
  isBlogPostPage,
  children,
  truncatedPost,
  truncated,
  tags,
}) {
  return (
    <article
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting"
      style={{ display: "flex", margin: "5px" }}
    >
      <Link
        itemProp="url"
        to={permalink}
        style={{ maxWidth: "65%", marginRight: "20px" }}
      >
        {image ? (
          <img
            src={image}
            style={{
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        ) : (
          ""
        )}
      </Link>

      <header>
        <TitleHeading className={styles.blogPostTitle} itemProp="headline">
          <Link itemProp="url" to={permalink}>
            {title}
          </Link>
        </TitleHeading>
        <div className={clsx(styles.blogPostData, "margin-vert--md")}>
          <time dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>

          {typeof readingTime !== "undefined" && (
            <>
              {" · "}
              {readingTimePlural(readingTime)}
            </>
          )}
        </div>
        {image && (
          <meta
            itemProp="image"
            content={withBaseUrl(image, { absolute: true })}
          />
        )}

        <div
          // This ID is used for the feed generation to locate the main content
          id={isBlogPostPage ? blogPostContainerID : undefined}
          className="markdown"
          itemProp="articleBody"
        >
          <MDXContent>{children}</MDXContent>

          {(tagsExists || truncated) && (
            <div>{tagsExists && <TagsListInline tags={tags} />}</div>
          )}
        </div>
      </header>
    </article>
  );
}

export default function BlogPostItem(props: PropsExtended): JSX.Element {
  const readingTimePlural = useReadingTimePlural();
  const { withBaseUrl } = useBaseUrlUtils();
  const containerRef = React.useRef(null);
  const { children, truncated, largeFormat = false } = props;
  const { metadata, assets, isBlogPostPage, toc } = useBlogPost();
  const {
    date,
    formattedDate,
    permalink,
    tags,
    readingTime,
    title,
    authors,
    frontMatter,
  } = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  const image = assets.image ?? frontMatter.image;
  const truncatedPost = !isBlogPostPage && truncated;
  const tagsExists = tags.length > 0;
  const TitleHeading = isBlogPostPage ? "h1" : "h2";

  React.useEffect(() => {
    if (!isBlogPostPage) return;

    const createUtterancesEl = () => {
      if (ExecutionEnvironment.canUseDOM) {
        const script = document.createElement("script");

        script.src = "https://utteranc.es/client.js";
        script.setAttribute("repo", "gabrielcsapo/gabrielcsapo.com");
        script.setAttribute("issue-term", "pathname");
        script.setAttribute("label", "comment");
        script.setAttribute("theme", "preferred-color-scheme");
        script.crossOrigin = "anonymous";
        script.async = true;

        containerRef.current.appendChild(script);
      }
    };

    createUtterancesEl();
  }, []);

  return isBlogPostPage ? (
    <article
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting"
      style={{ width: "100%" }}
    >
      <header className="row">
        <div
          className="col col--4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {(tagsExists || truncated) && (
              <div className={clsx("col", { "col--9": truncatedPost })}>
                <TagsListInline tags={tags} />
              </div>
            )}

            <TitleHeading className={styles.blogPostTitle} itemProp="headline">
              {title}
            </TitleHeading>
            <div className={clsx(styles.blogPostData, "margin-vert--md")}>
              <time dateTime={date} itemProp="datePublished">
                {formattedDate}
              </time>

              {typeof readingTime !== "undefined" && (
                <>
                  {" · "}
                  {readingTimePlural(readingTime)}
                </>
              )}
            </div>
            <BlogPostAuthors authors={authors} assets={assets} />
          </div>
        </div>
        <div className="col col--8">
          <img
            src={image}
            style={{
              minHeight: "450px",
              maxWidth: "100%",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </div>
      </header>
      <br />
      <hr />
      <br />
      <div className="row">
        {hideTableOfContents ? undefined : (
          <div className="col col--2">
            <TOC
              toc={toc}
              minHeadingLevel={tocMinHeadingLevel}
              maxHeadingLevel={tocMaxHeadingLevel}
            />
          </div>
        )}
        <div className={hideTableOfContents ? "col col--12" : "col col--10"}>
          {image && (
            <meta
              itemProp="image"
              content={withBaseUrl(image, { absolute: true })}
            />
          )}

          <div
            // This ID is used for the feed generation to locate the main content
            id={isBlogPostPage ? blogPostContainerID : undefined}
            className="markdown"
            itemProp="articleBody"
          >
            <MDXContent>{children}</MDXContent>

            <div ref={containerRef} />
          </div>
        </div>
      </div>
    </article>
  ) : largeFormat ? (
    <BlogPostItemLargeFormat
      permalink={permalink}
      image={image}
      TitleHeading={TitleHeading}
      date={date}
      formattedDate={formattedDate}
      readingTime={readingTime}
      authors={authors}
      readingTimePlural={readingTimePlural}
      assets={assets}
      withBaseUrl={withBaseUrl}
      title={title}
      tagsExists={tagsExists}
      isBlogPostPage={isBlogPostPage}
      children={children}
      truncatedPost={truncatedPost}
      truncated={truncated}
      tags={tags}
    />
  ) : (
    <article
      className={clsx("margin-bottom--xl", styles.blogPostCard)}
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <header>
        <Link itemProp="url" to={permalink}>
          {image ? <img className={styles.blogPostImage} src={image} /> : ""}{" "}
        </Link>

        <TitleHeading className={styles.blogPostTitle} itemProp="headline">
          <Link itemProp="url" to={permalink}>
            {title}
          </Link>
        </TitleHeading>
        <div className={clsx(styles.blogPostData, "margin-vert--md")}>
          <time dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>
          {typeof readingTime !== "undefined" && (
            <>
              {" · "}
              {readingTimePlural(readingTime)}
            </>
          )}
        </div>
      </header>

      {image && (
        <meta
          itemProp="image"
          content={withBaseUrl(image, { absolute: true })}
        />
      )}

      <div
        // This ID is used for the feed generation to locate the main content
        className="markdown"
        itemProp="articleBody"
      >
        <MDXContent>{children}</MDXContent>

        {tagsExists && (
          <div>
            <TagsListInline tags={tags} />
          </div>
        )}
      </div>
    </article>
  );
}
