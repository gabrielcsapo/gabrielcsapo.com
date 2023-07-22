import { visit } from "unist-util-visit";
import { h } from "hastscript";

export default function remarkAdmonitions() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (
          ["note", "tip", "info", "caution", "danger"].indexOf(node.name) === -1
        )
          return;

        const data = node.data || (node.data = {});
        const tagName = node.type === "textDirective" ? "span" : "div";

        data.hName = tagName;

        data.hProperties = h(
          `${tagName}.admonition.admonition-${node.name}.alert.alert--secondary`,
          node.attributes
        ).properties;
      }
    });
  };
}
