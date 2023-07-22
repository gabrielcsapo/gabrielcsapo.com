import "./App.css";
import "./index.scss";

import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { routes, getComponent } from "virtual:pages.jsx";

const routesStatements = routes.map((route, i) => {
  const Layout = getComponent(route.layout);
  const Component = getComponent(route.component);

  return (
    <Route
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
    <Suspense>
      <BrowserRouter>
        <Routes>{routesStatements}</Routes>
      </BrowserRouter>
    </Suspense>
  );
}
