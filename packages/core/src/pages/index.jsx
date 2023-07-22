import styles from "./index.module.css";

import { routes } from "virtual:pages";

import FeaturedPostSlider from "../components/FeaturedPostSlider";
import BlogCard from "../components/BlogCard";

export default function Index() {
  const posts = routes
    .find((route) => {
      return route.path === "posts";
    })
    ?.children.filter((page) => {
      return page;
    });
  const favoritedPosts = posts.filter((post) => {
    return post?.element?.favorited;
  });

  console.log(favoritedPosts);

  return (
    <>
      <header className={styles.hero}>
        <h1>Welcome to My Blog</h1>
        <p>Explore exciting content on various topics.</p>
        <a href="/posts">Read Latest Posts</a>
      </header>

      <div className={styles.content}>
        <FeaturedPostSlider posts={favoritedPosts} />
        {posts.slice(0, 4).map((post) => {
          return <BlogCard key={post.path} post={post} />;
        })}
      </div>
    </>
  );
}
