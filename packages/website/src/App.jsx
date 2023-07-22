import "./App.css";
import "./index.scss";

import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { routes, getComponent } from "virtual:pages.jsx";

import { ThemeProvider } from "@components/ThemeProvider";

const ScrollToAnchor = () => {
  const { hash } = useLocation();

  useEffect(() => {
    // Check if there is a hash in the URL
    if (hash) {
      // Try to find the element using the hash
      const element = document.getElementById(hash.substr(1));

      if (element) {
        const headerOffset = 80; // Set this to the height of your fixed header
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        // Scroll the element into view
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // If no hash, scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [hash]); // Dependency array with hash, so it runs every time hash changes

  return null; // This component doesn't render anything
};

const routesStatements = routes.map((route, i) => {
  const Layout = getComponent(route.layout);
  const Component = getComponent(route.component);
  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Layout {...route?.props}>
          <Component />
        </Layout>
      }
    />
  );
});

export default function App() {
  return (
    <ThemeProvider>
      <Suspense>
        <BrowserRouter>
          <ScrollToAnchor />
          <Routes>{routesStatements}</Routes>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  );
}
