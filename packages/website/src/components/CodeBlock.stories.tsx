import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import CodeBlock from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  component: CodeBlock,
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => {
    return (
      <CodeBlock
        language="cpp"
        title="Testing"
        code={`
void setup() {
  Serial.begin(9600); // open serial port, set the baud rate to 9600 bps
}
      `}
      />
    );
  },
};
