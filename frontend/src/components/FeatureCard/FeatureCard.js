import React from "react";
import styles from "./FeatureCard.module.css";
import { Link } from "react-router-dom";

import { ReactComponent as LinkArrow } from "../../assets/link-arrow.svg";

function FeatureCard({ IconComponent, title, description, to }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <IconComponent />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>

      <Link to={to} className={styles.link}>
        <span>Переглянути</span>
        <LinkArrow />
      </Link>
    </div>
  );
}

export default FeatureCard;
