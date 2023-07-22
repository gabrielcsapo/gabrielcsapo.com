import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import IconButton from "@components/IconButton";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const meta: Meta<typeof IconButton> = {
  component: IconButton,
};

export default meta;
type Story = StoryObj<typeof IconButton>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => {
    return (
      <IconButton
        icon={faThumbsUp}
        ariaLabel="a thumbs up button"
        onClick={action("clicked thumbs up button")}
      />
    );
  },
};
