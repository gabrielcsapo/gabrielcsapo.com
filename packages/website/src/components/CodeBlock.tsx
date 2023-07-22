import React, { useState, useCallback, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import copy from "copy-text-to-clipboard";
import clsx from "clsx";

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { useTheme } from "@components/ThemeProvider";
import IconButton from "@components/IconButton";

import styles from "./CodeBlock.module.css";

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
      className={isCopied ? styles.copyButtonCopied : ""}
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

  const buttonClassName = clsx(styles.buttonGroup, {
    [styles.visible]: showButton,
  });

  return (
    <div
      className={styles.codeBlockContainer}
      onMouseEnter={() => setShowButton(true)}
      onMouseLeave={() => setShowButton(false)}
    >
      {title && <div className={styles.codeBlockTitle}>{title}</div>}
      <Highlight
        language={language.replace("language-", "")}
        theme={theme === "light" ? themes.github : themes.dracula}
        code={derivedCode}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={styles.codeBlockCode}>
            <div className={buttonClassName}>
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
