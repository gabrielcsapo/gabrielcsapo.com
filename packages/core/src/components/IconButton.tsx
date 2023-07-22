import React from "react";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import clsx from "clsx";

import styles from "./IconButton.module.css";
import { type IconDefinition } from "@fortawesome/free-brands-svg-icons";

interface IconButtonProps {
  to?: string;
  icon: IconDefinition;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  circle?: boolean;
  disabled?: boolean;
}

export default function IconButton({
  to,
  icon,
  onClick,
  ariaLabel,
  className,
  circle = true,
  disabled = false,
}: IconButtonProps) {
  if (to) {
    return (
      <Link
        className={clsx(
          "button",
          circle ? styles.iconButtonCircle : styles.iconButton,
          className
        )}
        to={to}
        aria-label={ariaLabel}
      >
        <FontAwesomeIcon icon={icon} />
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        circle ? styles.iconButtonCircle : styles.iconButton,
        className
      )}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
