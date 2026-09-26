import { Link } from "react-router-dom";
import { useTitle } from "@utils/useTitle";
export default function NotFound() {
  useTitle(
    "Page not found — Gabriel Csapo",
    "This page is no longer available. Explore Gabriel Csapo’s platform engineering work.",
  );
  return (
    <section className="wrap contact">
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        This page is no
        <br />
        longer available.
      </h1>
      <p>Explore my current work in platform engineering.</p>
      <Link className="button" to="/">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
