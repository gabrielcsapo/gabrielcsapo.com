import React from "react";
import { BrowserRouter } from "react-router-dom";

import { BlogLayout } from "./BlogLayout";

import * as ExamplePost from "./fixtures/test-post/test.mdx";

export default {
  title: "Components/BlogLayout",
  component: BlogLayout,
  tags: ["autodocs"],
};

export const Example = {
  args: {
    primary: true,
  },
  render: (args) => {
    return (
      <BrowserRouter>
        <BlogLayout {...args}>
          {React.createElement(ExamplePost.default, ExamplePost)}
        </BlogLayout>
      </BrowserRouter>
    );
  },
};
