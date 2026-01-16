import React, { useState, useRef, useEffect } from "react";
import styles from "./RationSection.module.css";
import MealCard from "../MealCard/MealCard";

import { ReactComponent as BreakfastIcon } from "../../assets/breakfast-icon.svg";
import { ReactComponent as LunchIcon } from "../../assets/lunch-icon.svg";
import { ReactComponent as DinnerIcon } from "../../assets/dinner-icon.svg";
import { ReactComponent as SliderLeft } from "../../assets/slider-left.svg";
import { ReactComponent as SliderRight } from "../../assets/slider-right.svg";

function RationSection({ meals, resetTab, onResetDone }) {
  const [activeTab, setActiveTab] = useState("breakfast");
  const listRef = useRef(null);

  useEffect(() => {
    if (resetTab) {
      setActiveTab("breakfast");

      if (listRef.current) {
        listRef.current.scrollTo({ left: 0, behavior: "auto" });
      }
      if (onResetDone) onResetDone();
    }
  }, [resetTab, onResetDone]);

  if (!meals) return null;

  const currentList = meals[activeTab] || [];

  const scroll = (direction) => {
    if (listRef.current) {
      const { current } = listRef;
      const scrollAmount = 324;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

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

      <div className={styles.sliderWrapper}>
        {currentList.length > 3 && (
          <button
            className={`${styles.sliderBtn} ${styles.leftBtn}`}
            onClick={() => scroll("left")}
            disabled={currentList.length === 0}
          >
            <SliderLeft />
          </button>
        )}

        <div className={styles.list} ref={listRef}>
          {currentList.length > 0 ? (
            currentList.map((meal) => (
              <MealCard
                key={meal.id}
                data={meal}
                className={styles.sliderCard}
              />
            ))
          ) : (
            <div className={styles.emptyMessage}>
              Неможливо згенерувати страви для цієї категорії. Спробуйте змінити
              параметри або вибір страв.
            </div>
          )}
        </div>

        {currentList.length > 3 && (
          <button
            className={`${styles.sliderBtn} ${styles.rightBtn}`}
            onClick={() => scroll("right")}
          >
            <SliderRight />
          </button>
        )}
      </div>
    </div>
  );
}

export default RationSection;
