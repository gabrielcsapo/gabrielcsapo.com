import { useParams } from "react-router-dom";

import BlogCard from "@components/BlogCard";

import { posts } from "virtual:pages.jsx";
import { useTitle } from "@utils/useTitle";

export default function Tags() {
  const { name: tagName } = useParams();

  useTitle(`Tag: ${tagName}`);

  const postsForTag = posts.filter((post) => {
    return post.tags && post.tags.indexOf(tagName) > -1;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
        Posts tagged <span className="text-primary-600 dark:text-primary-400">{tagName}</span>
      </h1>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-8">
        {postsForTag.length} post{postsForTag.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {postsForTag.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
