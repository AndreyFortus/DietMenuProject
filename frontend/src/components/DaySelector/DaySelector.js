import React from "react";
import styles from "./DaySelector.module.css";

function DaySelector({ daysCount, activeDayIndex, onDaySelect }) {
  if (!daysCount || daysCount <= 1) return null;

  return (
    <div className={styles.daySelector}>
      {Array.from({ length: daysCount }).map((_, index) => (
        <button
          key={index}
          className={`${styles.dayButton} ${activeDayIndex === index ? styles.active : ""}`}
          onClick={() => onDaySelect(index)}
        >
          День {index + 1}
        </button>
      ))}
    </div>
  );
}

export default DaySelector;
