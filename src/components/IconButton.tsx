import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/free-brands-svg-icons";
import clsx from "clsx";

interface IconButtonProps {
  to?: string;
  icon: IconDefinition;
  onClick?: () => void;
  ariaLabel?: string;
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
  const baseClasses = clsx(
    "inline-flex items-center justify-center transition-colors cursor-pointer",
    circle ? "w-9 h-9 rounded-full" : "w-9 h-9 rounded-md",
    "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800",
    disabled && "opacity-40 cursor-not-allowed",
    className,
  );

  if (to) {
    return (
      <NavLink
        className={({ isActive }) =>
          clsx(
            baseClasses,
            isActive &&
              "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30",
          )
        }
        to={to}
        aria-label={ariaLabel}
      >
        <FontAwesomeIcon icon={icon} className="w-4 h-4" />
      </NavLink>
    );
  }

  return (
    <button
      className={baseClasses}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
    </button>
  );
}
