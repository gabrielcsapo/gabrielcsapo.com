import styles from "./index.module.css";

import { posts } from "virtual:pages.jsx";

import FeaturedPostSlider from "@components/FeaturedPostSlider";
import BlogCard from "@components/BlogCard";
import { useTitle } from "@utils/useTitle";

export default function Index() {
  useTitle("Gabriel J. Csapo");

  const featuredPost = posts?.filter((post) => {
    return post?.featured;
  });

  return (
    <>
      {/* <header className={styles.hero}>
        <h1>Welcome to My Blog</h1>
        <p>Explore exciting content on various topics.</p>
        <a href="/posts">Read Latest Posts</a>
      </header> */}

      <div className={styles.content}>
        {featuredPost && featuredPost.length > 0 && (
          <FeaturedPostSlider posts={featuredPost} />
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
