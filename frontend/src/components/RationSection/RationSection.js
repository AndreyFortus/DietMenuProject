import React, { useState } from "react";
import styles from "./RationSection.module.css";
import MealCard from "../MealCard/MealCard";

import { ReactComponent as BreakfastIcon } from "../../assets/breakfast-icon.svg";
import { ReactComponent as LunchIcon } from "../../assets/lunch-icon.svg";
import { ReactComponent as DinnerIcon } from "../../assets/dinner-icon.svg";

const MOCK_DATA = [
  {
    id: 1,
    image: "/images/oatmeal.jpg",
    title: "Вівсянка з фруктами",
    description: "Вівсянка, Молоко, Банани, Яблука",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 2,
    image: "/images/carbonara.jpg",
    title: 'Паста "Карбонара"',
    description: "Спагеті, Бекон (панчетта), яєчні жовтки...",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 3,
    image: "/images/cheese.jpg",
    title: "Сир коров'ячий",
    description: "Сир коров'ячий знежирений",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
];

function RationSection() {
  const [activeTab, setActiveTab] = useState("breakfast");

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
        {MOCK_DATA.map((meal) => (
          <MealCard key={meal.id} data={meal} />
        ))}
      </div>
    </div>
  );
}

export default RationSection;
