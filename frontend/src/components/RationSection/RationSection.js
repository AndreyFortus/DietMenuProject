import React, { useState } from "react";
import styles from "./RationSection.module.css";
import MealCard from "../MealCard/MealCard";

import { ReactComponent as BreakfastIcon } from "../../assets/breakfast-icon.svg";
import { ReactComponent as LunchIcon } from "../../assets/lunch-icon.svg";
import { ReactComponent as DinnerIcon } from "../../assets/dinner-icon.svg";

function RationSection({ meals }) {
  const [activeTab, setActiveTab] = useState("breakfast");

  if (!meals) return null;

  return (
    <div className={styles.rationSection}>
      <nav className={styles.tabs}>
        <button
          className={activeTab === "breakfast" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("breakfast")}
        >
          <BreakfastIcon /> Сніданок
        </button>
        <button
          className={activeTab === "lunch" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("lunch")}
        >
          <LunchIcon /> Обід
        </button>
        <button
          className={activeTab === "dinner" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("dinner")}
        >
          <DinnerIcon /> Вечеря
        </button>
      </nav>

      <div className={styles.list}>
        {meals.map((meal) => (
          <MealCard key={meal.id} data={meal} />
        ))}
      </div>
    </div>
  );
}

export default RationSection;
