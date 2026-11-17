import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { loaders, posts } from "virtual:posts";
import CodeBlock from "@components/CodeBlock";
import { useNoIndex } from "@utils/useNoIndex";
import { useTitle } from "@utils/useTitle";
import NotFound from "../*.jsx";

const fullDate = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

const bodies = {};
const bodyFor = (slug) => (bodies[slug] ??= lazy(loaders[slug]));

// Downloads live in /files, however the post happened to point at them.
function PostLink({ href = "", children }) {
  const files = href.indexOf("/files/");
  const isDownload = files > -1 && !/^[a-z]+:/i.test(href);
  return <a href={isDownload ? href.slice(files) : href}>{children}</a>;
}

// Photos inside a post arrive as a set of sizes; anything else is a plain address.
function PostImage({ src, alt = "" }) {
  // Captions were written as markdown; keep the words and drop the link syntax.
  const caption = alt
    .replace('"fullWidth"', "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .trim();
  const sized = typeof src === "object";
  return (
    <figure>
      {sized ? (
        <picture>
          <source
            srcSet={src.sources.webp}
            sizes="(max-width: 760px) 100vw, 720px"
            type="image/webp"
          />
          <img
            src={src.img.src}
            width={src.img.w}
            height={src.img.h}
            alt={caption}
            loading="lazy"
          />
        </picture>
      ) : (
        <img src={src} alt={caption} loading="lazy" />
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Fence({ children }) {
  const { className, children: code } = children?.props ?? {};
  if (!className) return <pre className="code-plain">{children}</pre>;
  return <CodeBlock language={className} code={code} />;
}

const components = {
  a: PostLink,
  img: PostImage,
  pre: Fence,
  table: (props) => (
    <div className="table-scroll">
      <table {...props} />
    </div>
  ),
};

function PostPage({ post }) {
  useTitle(`${post.title} — Gabriel J. Csapo`, post.excerpt);
  useNoIndex();
  const Body = bodyFor(post.slug);
  return (
    <article className="page post wrap">
      <Link className="kicker" to="/posts">
        ← Posts
      </Link>
      <h1>{post.title}</h1>
      <p className="post-meta">
        <time dateTime={post.date}>{fullDate.format(new Date(post.date))}</time> · {post.minutes}{" "}
        min read
      </p>
      <div className="prose">
        <Suspense>
          <Body components={components} />
        </Suspense>
      </div>
    </article>
  );
}

export default function Post() {
  const { slug } = useParams();
  const post = posts.find((candidate) => candidate.slug === slug);
  return post ? <PostPage key={slug} post={post} /> : <NotFound />;
}
