import React from "react";
import styles from "./InfoCard.module.css";

function InfoCard({ title, description }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default InfoCard;
