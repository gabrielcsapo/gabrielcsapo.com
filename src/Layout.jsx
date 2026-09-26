import SocialIconLink from "@components/SocialIconLink";
import LinkedInLink from "@components/LinkedInLink";
import Navbar from "@components/Navbar";
export default function Layout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">{children}</main>
      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Gabriel Csapo</span>
        <div>
          <SocialIconLink icon="github" href="https://github.com/gabrielcsapo" label="GitHub" />
          <LinkedInLink />
          <SocialIconLink icon="email" href="mailto:gabecsapo@gmail.com" label="Email" />
        </div>
      </footer>
    </>
  );
}
