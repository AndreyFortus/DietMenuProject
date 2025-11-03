import React from "react";
import styles from "./Mission.module.css";

function Mission() {
  return (
    <section className={styles.missionSection}>
      <div className={styles.missionContent}>
        <h2>Наша місія</h2>
        <p>
          NutriPlan створений для людей, які прагнуть харчуватися раціонально й
          економно. Ми поєднуємо дані про харчову цінність і ціну продуктів, щоб
          допомогти вам складати збалансовані меню без зайвих витрат. Система
          дозволяє зберігати, порівнювати й аналізувати ваші добові раціони.
        </p>
      </div>
    </section>
  );
}

export default Mission;
