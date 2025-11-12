import React from "react";
import styles from "./NutrientInput.module.css";

function NutrientInput({ label, value, onChange, error }) {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>{label}</label>
      <input
        type="number"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export default NutrientInput;
