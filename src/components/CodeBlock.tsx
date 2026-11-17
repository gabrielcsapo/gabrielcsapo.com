import React, { useEffect, useRef, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import copy from "copy-text-to-clipboard";

import { useTheme } from "@components/ThemeProvider";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timeout.current), []);
  return (
    <button
      className="code-copy"
      onClick={() => {
        copy(code);
        setCopied(true);
        window.clearTimeout(timeout.current);
        timeout.current = window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function CodeBlock(props) {
  const { children, code, language = "", title } = props;
  const { theme } = useTheme();
  const source = [code ?? children].flat().join("").trim();

  return (
    <div className="code-block">
      {title && <div className="code-title">{title}</div>}
      <CopyButton code={source} />
      <Highlight
        language={language.replace("language-", "")}
        theme={theme === "dark" ? themes.oneDark : themes.oneLight}
        code={source}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
