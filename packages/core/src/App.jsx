import "./App.css";
import "./index.scss";

import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { routes, getComponent } from "virtual:pages.jsx";

import { ThemeProvider } from "./ThemeProvider";

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
          <Routes>{routesStatements}</Routes>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  );
}
