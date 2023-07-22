import styles from "./index.module.css";

import { posts } from "virtual:pages.jsx";

import FeaturedPostSlider from "../components/FeaturedPostSlider";
import BlogCard from "../components/BlogCard";

export default function Index() {
  const favoritedPosts = posts?.filter((post) => {
    return post?.favorited;
  });

  return (
    <>
      {/* <header className={styles.hero}>
        <h1>Welcome to My Blog</h1>
        <p>Explore exciting content on various topics.</p>
        <a href="/posts">Read Latest Posts</a>
      </header> */}

      <div className={styles.content}>
        {favoritedPosts && favoritedPosts.length > 0 && (
          <FeaturedPostSlider posts={favoritedPosts} />
        )}
        {posts
          ?.sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4)
          .map((post) => {
            return (
              <BlogCard
                className={styles.postCard}
                key={post.slug}
                post={post}
              />
            );
          })}
      </div>
    </>
  );
}
