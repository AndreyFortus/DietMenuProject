import React from "react";
import styles from "./StatisticSection.module.css";
import StatisticCard from "../StatisticCard/StatisticCard";

function StatisticSection() {
  // 1. Дані-заглушки
  const stats = {
    totalCost: "165.50",
    totalCalories: "2270",
    macros: {
      protein: "170г",
      fat: "74г",
      carbs: "230г",
    },
  };

  return (
    <div className={styles.statisticSection}>
      <div className={styles.header}>
        <h2>Загальна статистика</h2>
        <p>Підсумок по всьому раціону</p>
      </div>

      <div className={styles.list}>
        <StatisticCard title="Загальна вартість">
          <div className={styles.cardContent}>
            <span className={styles.mainValue}>{stats.totalCost} ₴</span>
            <span className={styles.subValue}>Мінімальна вартість раціону</span>
          </div>
        </StatisticCard>

        <StatisticCard title="Калорії">
          <div className={styles.cardContent}>
            <span className={styles.mainValue}>{stats.totalCalories} ккал</span>
            <span className={styles.subValue}>Загальна кількість калорій</span>
          </div>
        </StatisticCard>

        <StatisticCard title="Макронутрієнти">
          <div className={styles.macroList}>
            <div className={styles.macroItem}>
              <span>Білки:</span>
              <span>{stats.macros.protein}</span>
            </div>
            <div className={styles.macroItem}>
              <span>Жири:</span>
              <span>{stats.macros.fat}</span>
            </div>
            <div className={styles.macroItem}>
              <span>Вуглеводи:</span>
              <span>{stats.macros.carbs}</span>
            </div>
          </div>
        </StatisticCard>
      </div>
    </div>
  );
}

export default StatisticSection;
