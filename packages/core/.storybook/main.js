/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "storybook-dark-mode",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling",
      options: {
        sass: {
          // Require your Sass preprocessor here
          implementation: require("sass"),
        },
      },
    },
    {
      name: "@storybook/addon-docs",
      options: {
        csfPluginOptions: null,
      },
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: ".storybook/vite.config.js",
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    config.plugins = config.plugins.filter((plugin) => {
      // we have our own plugin that will handle mdx, the storybook one conflicts with ours
      return plugin.name !== "storybook:mdx-plugin";
    });
    return config;
  },
};

export default config;
