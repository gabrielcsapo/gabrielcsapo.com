import React, { useRef, useEffect } from "react";
import { MDXProvider } from "@mdx-js/react";
import mediumZoom from "medium-zoom";
import { NavLink, Link, useLocation } from "react-router-dom";
import clsx from "clsx";

import Layout from "../Layout";
import CodeBlock from "./CodeBlock";
import ImageLoader from "./ImageLoader";
import { useTitle } from "@utils/useTitle";

const ResponsiveTable = ({ children }) => {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
};

const FullWidthImage = (props) => {
  let { alt, src } = props;
  const isFullWidth = alt && alt.indexOf('"fullWidth"') > -1;

  if (isFullWidth) {
    alt = alt.replace('"fullWidth"', "");
  }

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
    <div className={isFullWidth ? "relative w-screen left-1/2 -translate-x-1/2" : ""}>
      <div className={isFullWidth ? "max-w-5xl mx-auto" : ""}>
        <picture>
          <source srcSet={typeof src === "object" ? src.img.src : src} type="image/webp" />
          <img alt={alt} ref={attachZoom} className="rounded-lg cursor-zoom-in" />
        </picture>
        {alt && (
          <figcaption className="text-center text-sm text-surface-500 dark:text-surface-400 mt-2 italic">
            {alt}
          </figcaption>
        )}
      </div>
    </div>
  );
};

const HeadingWithAnchor = ({ level, children }) => {
  const location = useLocation();
  const Tag = `h${level}`;
  const slug =
    typeof children === "string"
      ? children.toLowerCase().replace(/\W+/g, "-")
      : children.props.children.toLowerCase().replace(/\W+/g, "-");

  return (
    <Tag id={slug}>
      <NavLink
        to={`#${slug}`}
        className={() =>
          clsx(
            "no-underline hover:underline transition-colors",
            location.hash === `#${slug}`
              ? "text-primary-600 dark:text-primary-400"
              : "text-surface-900 dark:text-white",
          )
        }
      >
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
      <code className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-sm font-mono">
        {children}
      </code>
    );
  },
};

export default function BlogLayout(props) {
  const initialized = useRef(false);
  const { tags, excerpt, title, author, date, slug, children, readingTime } = props;

  const containerRef = useRef(null);

  useTitle(`Post: ${title}`, excerpt);

  useEffect(() => {
    const createUtterancesEl = () => {
      if (typeof window !== undefined) {
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

    if (!initialized.current) {
      initialized.current = true;
      createUtterancesEl();
    }
  }, []);

  return (
    <Layout {...props}>
      <article className="max-w-3xl mx-auto px-6 py-10">
        <ImageLoader
          className="w-full aspect-[2/1] object-cover rounded-xl mb-8"
          slug={slug}
          alt={`${slug} image`}
        />

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-3">
            {title}
          </h1>
          <div className="text-sm text-surface-500 dark:text-surface-400 mb-4">
            by {author.name} &middot; {new Date(date).toDateString()} &middot;{" "}
            {Math.ceil(readingTime.minutes)} min read
          </div>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tagName) => (
              <li key={tagName}>
                <Link
                  to={`/tags/${tagName}`}
                  className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  {tagName}
                </Link>
              </li>
            ))}
          </ul>
        </header>

        <div className="prose">
          <MDXProvider components={components}>{children}</MDXProvider>
        </div>

        <div ref={containerRef} className="mt-12" />
      </article>
    </Layout>
  );
}
