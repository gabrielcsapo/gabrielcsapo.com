import React from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "@components/BlogCard";
import ArrowLeftIcon from "@components/Icons/ArrowLeftIcon";
import ArrowRightIcon from "@components/Icons/ArrowRightIcon";

import styles from "./index.module.css";

import { posts } from "virtual:pages.jsx";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const currentPosts = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.set("page", page);
      navigate("?" + searchParams.toString());
    }
  };

  return (
    <div className={styles.paginatedBlogList}>
      <div className={styles.content}>
        {currentPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          type="button"
          onClick={() => changePage(currentPage - 1)}
        >
          <ArrowLeftIcon />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          type="button"
          onClick={() => changePage(currentPage + 1)}
        >
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Index;
