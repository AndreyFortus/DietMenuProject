import React from 'react';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function MacroDistribution({
  distribution,
  onChange,
  macros,
}) {
  const total =
    Number(distribution.protein) +
    Number(distribution.fat) +
    Number(distribution.carbs);

  const isValid = Math.abs(total - 100) < 0.01;

  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Розподіл макронутрієнтів</h2>
          <p>
            Налаштуйте частку енергії, що надходить
            із білків, жирів і вуглеводів.
          </p>
        </div>
      </div>

      <div className={styles.macroInputs}>
        <div className={styles.field}>
          <label htmlFor="protein">Білки (%)</label>
          <input
            id="protein"
            name="protein"
            type="number"
            min="0"
            max="100"
            value={distribution.protein}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="fat">Жири (%)</label>
          <input
            id="fat"
            name="fat"
            type="number"
            min="0"
            max="100"
            value={distribution.fat}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="carbs">Вуглеводи (%)</label>
          <input
            id="carbs"
            name="carbs"
            type="number"
            min="0"
            max="100"
            value={distribution.carbs}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.distributionTotal}>
        <span>Загальна частка</span>
        <strong className={isValid ? styles.validTotal : styles.invalidTotal}>
          {total}%
        </strong>
      </div>

      {!isValid && (
        <div className={styles.errorMessage}>
          Сума часток повинна дорівнювати 100%.
        </div>
      )}

      {isValid && macros && (
        <div className={styles.macroResults}>
          <div className={styles.macroResult}>
            <span>Білки</span>
            <strong>{macros.protein} г</strong>
            <small>{distribution.protein}% енергії</small>
          </div>

          <div className={styles.macroResult}>
            <span>Жири</span>
            <strong>{macros.fat} г</strong>
            <small>{distribution.fat}% енергії</small>
          </div>

          <div className={styles.macroResult}>
            <span>Вуглеводи</span>
            <strong>{macros.carbs} г</strong>
            <small>{distribution.carbs}% енергії</small>
          </div>
        </div>
      )}

      <p className={styles.helperText}>
        Перерахунок виконується за енергетичними еквівалентами:
        4 ккал/г для білків, 9 ккал/г для жирів і 4 ккал/г
        для вуглеводів. Значення в грамах округлюються.
      </p>
    </section>
  );
}

export default MacroDistribution;
