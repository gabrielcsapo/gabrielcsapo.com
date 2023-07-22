import React from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";

import styles from "./PaginatedBlogList.module.css";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";
import ArrowRightIcon from "./Icons/ArrowRightIcon";

const PaginatedBlogList = ({ posts, itemsPerPage = 5 }) => {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

export default PaginatedBlogList;
