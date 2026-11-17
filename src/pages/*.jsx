import { Link } from "react-router-dom";
import { useTitle } from "@utils/useTitle";
export default function NotFound() {
  useTitle("Page not found — Gabriel J. Csapo", "This page is no longer available.");
  return (
    <section className="hero wrap">
      <p className="kicker">404 · Page not found</p>
      <h1>
        This page
        <br />
        <em>moved on.</em>
      </h1>
      <p className="lede">It’s no longer available, but the homepage is.</p>
      <div className="hero-links">
        <Link className="button" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
