import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-brands-svg-icons";
import clsx from "clsx";

import styles from "./IconButton.module.css";

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
      <NavLink
        className={({ isActive }) =>
          clsx(
            circle ? styles.iconButtonCircle : styles.iconButton,
            className,
            isActive ? styles.active : styles.default,
          )
        }
        to={to}
        aria-label={ariaLabel}
      >
        <FontAwesomeIcon icon={icon} />
      </NavLink>
    );
  }

  return (
    <button
      className={clsx(
        circle ? styles.iconButtonCircle : styles.iconButton,
        className,
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
