import LivingNetwork from "@components/LivingNetwork";
import { useTitle } from "@utils/useTitle";

export default function Index() {
  useTitle(
    "Gabriel Csapo — Software Engineer",
    "Gabe Csapo is a software engineer who likes building useful tools and making complicated systems easier to work with.",
  );
  return (
    <>
      <section className="hero wrap" aria-labelledby="intro-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> Gabriel Csapo
          </div>
          <h1 id="intro-title">
            Hi, I’m <em>Gabe.</em>
          </h1>
          <div className="hero-bottom">
            <p>
              I’m a software engineer who likes building useful tools and making complicated systems
              easier to work with.
            </p>
            <div className="hero-aside">
              Currently at <strong>Vanta</strong>
              <br />
              Previously at <strong>LinkedIn</strong>
              <br />
              <span>New York City area</span>
            </div>
          </div>
          <div className="hero-links">
            <a className="button" href="mailto:gabecsapo@gmail.com">
              Get in touch <span aria-hidden="true">↘</span>
            </a>
            <a className="text-link" href="/gabriel-csapo-resume.pdf">
              View résumé <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <LivingNetwork />
      </section>
    </>
  );
}
