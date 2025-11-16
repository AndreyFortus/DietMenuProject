import React from "react";
import styles from "./MealCard.module.css";

function MealCard({ data }) {
  const {
    image,
    title,
    description,
    price,
    portion,
    calories,
    protein,
    fat,
    carbs,
  } = data;

  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.infoWrap}>
          <span className={styles.price}>{price}₴</span>
          <span className={styles.unit}>/ 100г</span>
          <span className={styles.portion}>{portion}</span>
        </div>

        <label className={styles.nutrientLabel}>
          Харчова цінність (на 100 г):
        </label>

        <div className={styles.nutrientBlock}>
          <div className={styles.nutrient}>
            <span>{calories}</span>
            <label>Калорії</label>
          </div>
          <div className={styles.nutrient}>
            <span>{protein}г</span>
            <label>Білок</label>
          </div>
          <div className={styles.nutrient}>
            <span>{fat}г</span>
            <label>Жири</label>
          </div>
          <div className={styles.nutrient}>
            <span>{carbs}г</span>
            <label>Вуглеводи</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
