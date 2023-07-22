import React from "react";
import { BrowserRouter } from "react-router-dom";

import BlogLayout from "./BlogLayout";

import ExamplePost from "./fixtures/test-post/test.mdx";
import ExampleImage from "./fixtures/test-post/images/IMG_3346.jpeg";

export default {
  title: "Components/BlogLayout",
  component: BlogLayout,
};

export const Example = {
  args: {
    tags: [],
    title: "Arduino - Capacitive Soil Moisture Sensor",
    image: ExampleImage,
    author: "Gabriel J. Csapo",
    date: new Date(),
    slug: "/foo",
  },
  render: (args) => {
    return (
      <BrowserRouter>
        <BlogLayout {...args}>
          <ExamplePost />
        </BlogLayout>
      </BrowserRouter>
    );
  },
};
