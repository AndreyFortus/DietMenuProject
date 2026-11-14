import React from 'react';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function StatisticalAnalysis({ statistics }) {
  if (!statistics) return null;

  const metrics = [
    ['Середнє значення', `${statistics.average} ккал`],
    ['Медіана', `${statistics.median} ккал`],
    ['Мінімум', `${statistics.min} ккал`],
    ['Максимум', `${statistics.max} ккал`],
    ['Розмах', `${statistics.difference} ккал`],
    ['Дисперсія', `${statistics.variance}`],
    ['Стандартне відхилення', `${statistics.standardDeviation} ккал`],
    ['Коефіцієнт варіації', `${statistics.coefficientOfVariation}%`],
    ['Середнє абсолютне відхилення', `${statistics.meanAbsoluteDeviation} ккал`],
  ];

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Статистичний аналіз результатів</h2>
          <p>
            Описові характеристики розбіжності між оцінками включених математичних моделей.
          </p>
        </div>
      </div>

      <div className={styles.resultGrid}>
        {metrics.map(([label, value]) => (
          <div className={styles.resultCard} key={label}>
            <span>{label}</span>
            <strong className={styles.metricValue}>{value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.analysisTableWrap}>
        <table className={styles.analysisTable}>
          <thead>
            <tr>
              <th>Модель</th>
              <th>Оцінка</th>
              <th>Абсолютне відхилення від середнього</th>
              <th>Відносне відхилення</th>
            </tr>
          </thead>

          <tbody>
            {statistics.modelDeviations.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.value} ккал</td>
                <td>{item.absoluteDeviation} ккал</td>
                <td>{item.relativeDeviation}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.helperText}>
        Дисперсія та стандартне відхилення описують розсіювання результатів між обраними моделями. Вони не є похибкою
        відносно фактичних енерговитрат і не визначають точність моделей.
      </p>
    </section>
  );
}

export default StatisticalAnalysis;
