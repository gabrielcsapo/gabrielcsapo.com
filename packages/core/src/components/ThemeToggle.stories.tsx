import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import ThemeToggle from "@components/ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => {
    return <ThemeToggle />;
  },
};
