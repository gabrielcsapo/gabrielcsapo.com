import { Link } from "react-router-dom";
import { posts } from "virtual:posts";
import { useNoIndex } from "@utils/useNoIndex";
import { useTitle } from "@utils/useTitle";

const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// Posts arrive newest first; keep that order and gather them under their year.
const years = [];
for (const post of posts) {
  const year = post.date.slice(0, 4);
  if (years.at(-1)?.year !== year) years.push({ year, posts: [] });
  years.at(-1).posts.push(post);
}

export default function Posts() {
  useTitle("Posts — Gabriel J. Csapo", "Things I wrote down while building hardware projects.");
  useNoIndex();
  return (
    <section className="page wrap" aria-labelledby="posts-title">
      <p className="kicker">Posts</p>
      <h1 id="posts-title">
        Things I <em>wrote down.</em>
      </h1>
      {years.map(({ year, posts }) => (
        <section className="post-year" key={year} aria-label={year}>
          <h2>{year}</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={`/${post.slug}`}>{post.title}</Link>
                <time dateTime={post.date}>{day.format(new Date(post.date))}</time>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
