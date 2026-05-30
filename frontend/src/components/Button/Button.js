import React from "react";
import styles from "./Button.module.css";

function Button({
  children,
  variant = "primary",
  iconBefore,
  iconAfter,
  ...props
}) {
  const buttonClasses = `${styles.myButton} ${styles[variant]}`;

  return (
    <button className={buttonClasses} {...props}>
      {iconBefore}

      <span>{children}</span>

      {iconAfter}
    </button>
  );
}

export default Button;
