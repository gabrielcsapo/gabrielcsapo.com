import { Link } from "react-router-dom";

import { posts } from "virtual:pages.jsx";
import { useTitle } from "@utils/useTitle";

export default function Tags() {
  useTitle("Tags");

  const tags = posts
    .flatMap((post) => post.tags)
    .reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Tags</h1>
      <div className="flex flex-wrap gap-3">
        {Object.keys(tags).map((tagName) => {
          const tagCount = tags[tagName];
          return (
            <Link
              key={tagName}
              to={`/tags/${tagName}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {tagName}
              </span>
              <span className="text-xs text-surface-400 dark:text-surface-500">{tagCount}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
