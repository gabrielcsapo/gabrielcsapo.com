import React, { useState, useCallback, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import copy from "copy-text-to-clipboard";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@components/ThemeProvider";
import IconButton from "@components/IconButton";

function CopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef(undefined);
  const handleCopyCode = useCallback(() => {
    copy(code);
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <IconButton
      className={isCopied ? "text-green-500" : ""}
      icon={isCopied ? faCheck : faCopy}
      onClick={handleCopyCode}
      ariaLabel="Copy code text"
    />
  );
}

export default function CodeBlock(props) {
  const { children, code, language, title } = props;

  const { theme } = useTheme();
  const derivedCode = code ?? children;

  const [showButton, setShowButton] = useState(false);

  return (
    <div
      className="relative group rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 my-4"
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      {title && (
        <div className="px-4 py-2 text-xs font-medium text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
          {title}
        </div>
      )}
      <Highlight
        language={language.replace("language-", "")}
        theme={theme === "light" ? themes.github : themes.dracula}
        code={derivedCode}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono">
            <div
              className={`absolute top-2 right-2 transition-opacity ${showButton ? "opacity-100" : "opacity-0"}`}
            >
              <CopyButton code={derivedCode} />
            </div>
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
