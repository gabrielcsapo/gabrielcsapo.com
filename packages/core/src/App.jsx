import "./App.css";
import "./index.scss";

import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { routes } from "virtual:pages";

import Layout from "./Layout";

const generateRoutes = (routes) => {
  return routes.map((route, i) => {
    if (route.children) {
      if (route.element) {
        const CustomLayout = route?.element?.layout;
        const element = CustomLayout ? (
          <CustomLayout>
            {React.createElement(route.element.default, route.element)}
          </CustomLayout>
        ) : (
          <Layout>
            {React.createElement(route.element.default, route.element)}
          </Layout>
        );

        return (
          <Route key={i} path={route.path}>
            <Route index element={element} />
            {generateRoutes(route.children)}
          </Route>
        );
      }

      return (
        <Route key={i} path={route.path}>
          {generateRoutes(route.children)}
        </Route>
      );
    }

    const CustomLayout = route.element.layout;

    return (
      <Route
        key={i}
        path={route.path}
        element={
          CustomLayout ? (
            <CustomLayout>
              {React.createElement(route.element.default, route.element)}
            </CustomLayout>
          ) : (
            <Layout>
              {React.createElement(route.element.default, route.element)}
            </Layout>
          )
        }
      />
    );
  });
};

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BrowserRouter>
        <Routes>{generateRoutes(routes)}</Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
