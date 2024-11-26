import React from "react";
import { useNavigate } from "react-router-dom";

import BlogCard from "@components/BlogCard";
import IconButton from "@components/IconButton";

import styles from "./index.module.css";

import { posts } from "virtual:pages.jsx";
import { useTitle } from "@utils/useTitle";
import {
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const navigate = useNavigate();

  useTitle(`Post archive: page #${currentPage}`);

  const sortedPosts = posts?.sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

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
    <div className={styles.paginatedBlogList}>
      <div className={styles.content}>
        {currentPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className={styles.pagination}>
        <IconButton
          onClick={() => changePage(currentPage - 1)}
          icon={faArrowLeftLong}
        />
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <IconButton
          onClick={() => changePage(currentPage + 1)}
          icon={faArrowRightLong}
        />
      </div>
    </div>
  );
};

export default Index;
