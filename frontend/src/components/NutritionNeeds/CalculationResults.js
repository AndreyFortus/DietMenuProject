import React from 'react';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function CalculationResults({ model, difference }) {
  if (!model) return null;

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Ваші добові енергетичні потреби</h2>
          <p>
            Результат за моделлю {model.name}.
          </p>
        </div>
      </div>

      <div className={styles.resultGrid}>
        <div className={styles.resultCard}>
          <span>Енерговитрати у стані спокою</span>
          <strong>{model.resting}</strong>
          <small>ккал/добу</small>
        </div>

        <div className={styles.resultCard}>
          <span>Підтримання поточної ваги</span>
          <strong>{model.maintenance}</strong>
          <small>ккал/добу</small>
        </div>

        <div className={`${styles.resultCard} ${styles.highlightResult}`}>
          <span>Цільова калорійність</span>
          <strong>{model.target}</strong>
          <small>ккал/добу</small>
        </div>
      </div>

      <div className={styles.comparisonNote}>
        <strong>Розбіжність між моделями</strong>
        <p>
          Діапазон оцінок становить {difference.min}–{difference.max}{' '}
          ккал/добу. Різниця між найменшим і найбільшим
          результатом — {difference.difference} ккал
          ({difference.differencePercent}% від середнього значення).
        </p>
      </div>
    </section>
  );
}

export default CalculationResults;
