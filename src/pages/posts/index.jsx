import React from "react";
import { useNavigate } from "react-router-dom";

import BlogCard from "@components/BlogCard";
import IconButton from "@components/IconButton";

import { posts } from "virtual:pages.jsx";
import { useTitle } from "@utils/useTitle";
import { faArrowLeftLong, faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const navigate = useNavigate();

  useTitle(`Post archive: page #${currentPage}`);

  const sortedPosts = posts?.sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);

  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.set("page", page);
      navigate("?" + searchParams.toString());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">All Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {currentPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <IconButton
          onClick={() => changePage(currentPage - 1)}
          icon={faArrowLeftLong}
          disabled={currentPage <= 1}
        />
        <span className="text-sm text-surface-600 dark:text-surface-400">
          Page {currentPage} of {totalPages}
        </span>
        <IconButton
          onClick={() => changePage(currentPage + 1)}
          icon={faArrowRightLong}
          disabled={currentPage >= totalPages}
        />
      </div>
    </div>
  );
};

export default Index;
