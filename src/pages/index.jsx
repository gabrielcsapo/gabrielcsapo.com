import CareerPath from "@components/CareerPath";
import InterfaceIcon from "@components/InterfaceIcon";
import { useTitle } from "@utils/useTitle";

export default function Index() {
  useTitle(
    "Gabriel J. Csapo — Software Engineer",
    "Gabe Csapo is a software engineer who likes building useful tools and making complicated systems easier to work with.",
  );
  return (
    <section className="hero wrap" aria-labelledby="intro-title">
      <p className="kicker">Software engineer</p>
      <h1 id="intro-title">
        Hi, I’m <em>Gabe.</em>
      </h1>
      <p className="lede">
        I like building useful tools and making complicated systems easier to work with.
      </p>
      <div className="hero-links">
        <a className="button" href="mailto:gabrieljcsapo@gmail.com">
          Get in touch
        </a>
        <a className="text-link" href="/gabriel-csapo-resume.pdf">
          View résumé <InterfaceIcon name="arrow-up-right" size={16} />
        </a>
      </div>
      <CareerPath />
    </section>
  );
}
