import React from "react";
import styles from "./WhySection.module.css";
import InfoCard from "../InfoCard/InfoCard";

const cardData = [
  {
    title: "Інтелектуальні алгоритми",
    description:
      "NutriPlan використовує математичні моделі для точного підбору продуктів.",
  },
  {
    title: "Швидкість та зручність",
    description:
      "Розрахунок раціону займає менше хвилини — усе готово одним кліком.",
  },
  {
    title: "Турбота про здоров'я",
    description:
      "Ми прагнемо зробити здорове харчування простим, доступним і приємним для кожного.",
  },
];

function WhySection() {
  return (
    <section className={styles.whySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Чому варто обрати NutriPlan?</h2>
          <p>
            NutriPlan — це сучасний інструмент, який поєднує харчову науку,
            алгоритмічне мислення та зручний інтерфейс. Ми допомагаємо людям
            досягати своїх цілей без складних таблиць і ручних розрахунків.
            Система автоматично підбирає продукти, щоб забезпечити
            збалансованість раціону, мінімальну вартість без втрати якості.
          </p>
        </div>
        <div className={styles.cardList}>
          {cardData.map((card, index) => (
            <InfoCard
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySection;
