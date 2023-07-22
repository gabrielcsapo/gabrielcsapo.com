import "../src/index.scss";

import { themes } from "@storybook/theming";

import { useDarkMode } from "storybook-dark-mode";
import { useEffect } from "react";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@components/ThemeProvider";

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story) => {
      const isDarkMode = useDarkMode();

      useEffect(() => {
        document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
      }, [isDarkMode]);
      return (
        <BrowserRouter>
          <ThemeProvider theme={isDarkMode ? "dark" : "light"}>
            <Story />
          </ThemeProvider>
        </BrowserRouter>
      );
    },
  ],
  darkMode: {
    dark: { ...themes.dark, appBg: "black" },
    light: { ...themes.normal, appBg: "light" },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
