import React from "react";
import styles from "./FeatureCard.module.css";

import { ReactComponent as LinkArrow } from "../../assets/link-arrow.svg";

function FeatureCard({ IconComponent, title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <IconComponent />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <button
        onClick={() => console.log("Button clicked!")}
        className={styles.link}
      >
        <span>Переглянути</span>
        <LinkArrow />
      </button>
    </div>
  );
}

export default FeatureCard;
