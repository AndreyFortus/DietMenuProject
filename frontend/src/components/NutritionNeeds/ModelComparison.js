import React from 'react';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function ModelComparison({ models, selectedModel, onSelect }) {
  const maxValue = Math.max(
    ...models.map((model) => model.target)
  );

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Порівняння математичних моделей</h2>
          <p>
            Оберіть модель, результат якої буде використано
            для підсумкового розрахунку.
          </p>
        </div>
      </div>

      <div className={styles.modelList}>
        {models.map((model) => {
          const isSelected = selectedModel === model.id;
          const percentage = (model.target / maxValue) * 100;

          return (
            <button
              type="button"
              key={model.id}
              className={`${styles.modelItem} ${
                isSelected ? styles.selectedModel : ''
              }`}
              onClick={() => onSelect(model.id)}
            >
              <div className={styles.modelTop}>
                <div>
                  <strong>{model.name}</strong>
                  <span>Рік публікації: {model.year}</span>
                </div>

                <div className={styles.modelValue}>
                  {model.target}
                  <small>ккал/добу</small>
                </div>
              </div>

              <div className={styles.progressTrack}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className={styles.modelDetails}>
                <span>
                  У стані спокою: {model.resting} ккал
                </span>
                <span>
                  Підтримання ваги: {model.maintenance} ккал
                </span>
              </div>

              {isSelected && (
                <span className={styles.selectedLabel}>
                  Обрана модель
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ModelComparison;
