import React from "react";
import clsx from "clsx";

import { timeSince } from "@utils/index";
import ImageLoader from "./ImageLoader";

const BlogCard = ({ post, className }) => {
  const { tags, title, date, slug, defaultSlug, readingTime } = post;

  return (
    <a
      className={clsx(
        "group block rounded-xl overflow-hidden border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-800 transition-all hover:shadow-md",
        className,
      )}
      href={slug ?? defaultSlug}
    >
      <div className="aspect-[16/9] overflow-hidden bg-surface-100 dark:bg-surface-800">
        <ImageLoader
          slug={slug}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        {tags && tags[0] && (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-2">
            {tags[0]}
          </span>
        )}
        <h2 className="text-base font-semibold text-surface-900 dark:text-white line-clamp-2 mb-2">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <span>{timeSince(new Date(date))}</span>
          <span>&middot;</span>
          <span>{Math.ceil(readingTime.minutes)} min read</span>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;
