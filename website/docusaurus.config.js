// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require("path");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Gabriel J. Csapo",
  tagline: "Stumbling through building stuff. Let's learn things together.",
  url: "https://gabrielcsapo.github.io",
  baseUrl: "/gabrielcsapo.com/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  organizationName: "gabrielcsapo",
  projectName: "gabrielcsapo.com",

  plugins: [
    require.resolve("docusaurus-plugin-image-zoom"),
    [
      require.resolve("docusaurus-plugin-search-local"),
      {
        hashed: true,
        blogRouteBasePath: "/",
      },
    ],
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        googleAnalytics: {
          trackingID: "UA-49443616-3",
        },
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          path: path.resolve(__dirname, "..", "posts"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Gabriel J. Csapo",
        logo: {
          alt: "Site Logo",
          src: "img/logo.png",
        },
        items: [
          { to: "/", label: "Blog", position: "left" },
          { to: "/archive", label: "All Posts", position: "left" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/gabrielcsapo",
              },
              {
                label: "GitHub",
                href: "https://github.com/gabrielcsapo",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Gabriel J. Csapo. Built with Docusaurus.`,
      },
      zoom: {
        selector: ".markdown :not(em) > img",
        background: {
          light: "rgb(255, 255, 255)",
          dark: "rgb(50, 50, 50)",
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
