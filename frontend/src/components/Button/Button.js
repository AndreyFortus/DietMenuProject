import React from "react";
import styles from "./Button.module.css";

function Button({ children, variant = "primary", iconBefore, iconAfter }) {
  const buttonClasses = `${styles.myButton} ${styles[variant]}`;

  return (
    <button className={buttonClasses}>
      {iconBefore}

      <span>{children}</span>

      {iconAfter}
    </button>
  );
}

export default Button;
