/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { usePluralForm, useColorMode } from "@docusaurus/theme-common";
import { blogPostContainerID } from "@docusaurus/utils-common";
import MDXContent from "@theme/MDXContent";
import EditThisPage from "@theme/EditThisPage";
import TagsListInline from "@theme/TagsListInline";
import BlogPostAuthors from "@theme/BlogPostAuthors";
import type { Props } from "@theme/BlogPostItem";

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
        <BlogPostAuthors authors={authors} assets={assets} />

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
  const {
    children,
    frontMatter,
    assets,
    metadata,
    truncated,
    isBlogPostPage = false,
    largeFormat = false,
  } = props;
  const { date, formattedDate, permalink, tags, readingTime, title, authors } =
    metadata;

  const image = assets.image ?? frontMatter.image;
  const truncatedPost = !isBlogPostPage && truncated;
  const tagsExists = tags.length > 0;
  const TitleHeading = isBlogPostPage ? "h1" : "h2";

  React.useEffect(() => {
    if (!props.isBlogPostPage) return;

    const createUtterancesEl = () => {
      const script = document.createElement("script");

      script.src = "https://utteranc.es/client.js";
      script.setAttribute("repo", "gabrielcsapo/gabrielcsapo.com");
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "comment");
      script.setAttribute("theme", "preferred-color-scheme");
      script.crossOrigin = "anonymous";
      script.async = true;

      containerRef.current.appendChild(script);
    };

    createUtterancesEl();
  }, []);

  return isBlogPostPage ? (
    <article
      itemProp="blogPost"
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <header>
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
      </header>

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
          <div className={clsx("col", { "col--9": truncatedPost })}>
            <TagsListInline tags={tags} />
          </div>
        )}

        <div ref={containerRef} />
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

          <BlogPostAuthors authors={authors} assets={assets} />

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
