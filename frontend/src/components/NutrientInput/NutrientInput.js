import React from "react";
import styles from "./NutrientInput.module.css";

function NutrientInput({ label, value, onChange }) {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>{label}</label>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default NutrientInput;
