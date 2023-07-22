import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import clsx from "clsx";

import styles from "./IconButton.module.css";

export default function IconButton({ to, icon, onClick }) {
  if (to) {
    return (
      <Link className={clsx("button", styles.iconButton)} to={to}>
        <FontAwesomeIcon icon={icon} />
      </Link>
    );
  }

  return (
    <button className={styles.iconButton} type="button" onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}
