import { useState, useCallback, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import copy from "copy-text-to-clipboard";
import clsx from "clsx";

import styles from "./CodeBlock.module.css";

function IconCopy(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
      />
    </svg>
  );
}

function IconSuccess(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
      />
    </svg>
  );
}

function CopyButton({ code, className }) {
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
    <button
      className={clsx(
        className,
        styles.copyButton,
        isCopied && styles.copyButtonCopied
      )}
      onClick={handleCopyCode}
    >
      <span className={styles.copyButtonIcons} aria-hidden="true">
        <IconCopy className={styles.copyButtonIcon} />
        <IconSuccess className={styles.copyButtonSuccessIcon} />
      </span>
    </button>
  );
}

export default function CodeBlock({
  children,
  code,
  language,
  title,
  showLineNumbers = false,
}) {
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
        language={language}
        showLineNumbers={showLineNumbers}
        theme={themes.palenight}
        code={derivedCode}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={styles.codeBlockCode}>
            <div className={buttonClassName}>
              <CopyButton className={styles.codeButton} code={derivedCode} />
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
