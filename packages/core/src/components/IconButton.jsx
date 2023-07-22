import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import clsx from "clsx";

import styles from "./IconButton.module.css";

export default function IconButton({
  to,
  icon,
  onClick,
  circle = true,
  disabled = false,
}) {
  if (to) {
    return (
      <Link className={clsx("button", styles.iconButton)} to={to}>
        <FontAwesomeIcon icon={icon} />
      </Link>
    );
  }

  return (
    <button
      className={circle ? styles.iconButtonCircle : styles.iconButton}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
