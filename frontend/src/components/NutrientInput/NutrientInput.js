import React from "react";
import styles from "./NutrientInput.module.css";

function NutrientInput({ label, value }) {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>{label}</label>
      <input type="number" className={styles.input} defaultValue={value} />
    </div>
  );
}

export default NutrientInput;
