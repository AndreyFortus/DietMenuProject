import React, { useMemo, useState } from 'react';
import { getSensitivityData } from '../../utils/nutrition/energyModels';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function SensitivityAnalysis({ profile, modelId }) {
  const [parameter, setParameter] = useState('weight');

  const options = {
    weight: ['Маса тіла', 'кг'],
    height: ['Зріст', 'см'],
    age: ['Вік', 'років'],
    activity: ['Фізична активність', 'коефіцієнт'],
  };

  const points = useMemo(
    () => getSensitivityData(profile, modelId, parameter),
    [profile, modelId, parameter]
  );

  if (!points.length) return null;

  const width = 660;
  const height = 250;
  const pad = 42;

  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));

  const x = (index) =>
    pad + index * (width - pad * 2) / Math.max(1, points.length - 1);

  const y = (value) =>
    height -
    pad -
    (value - minY) * (height - pad * 2) /
      Math.max(1, maxY - minY);

  const path = points
    .map(
      (point, index) =>
        `${index ? 'L' : 'M'} ${x(index)} ${y(point.y)}`
    )
    .join(' ');

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Аналіз чутливості параметрів</h2>
          <p>
            Зміна одного параметра за незмінності інших вхідних даних.
          </p>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="sensitivityParameter">
          Параметр для аналізу
        </label>

        <select
          id="sensitivityParameter"
          value={parameter}
          onChange={(event) => setParameter(event.target.value)}
        >
          {Object.entries(options).map(([key, item]) => (
            <option value={key} key={key}>
              {item[0]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.chartFrame}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Залежність цільової калорійності від параметра ${options[parameter][0]}`}
        >
          {[0, 1, 2, 3, 4].map((tick) => {
            const yy = pad + tick * (height - pad * 2) / 4;

            return (
              <g key={tick}>
                <line
                  x1={pad}
                  y1={yy}
                  x2={width - pad}
                  y2={yy}
                  stroke="#e2e8f0"
                />
                <text
                  x={pad - 8}
                  y={yy + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#64748b"
                >
                  {Math.round(maxY - tick * (maxY - minY) / 4)}
                </text>
              </g>
            );
          })}

          <path
            d={path}
            fill="none"
            stroke="#4caf50"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <circle
              key={`${point.x}-${index}`}
              cx={x(index)}
              cy={y(point.y)}
              r="3.5"
              fill="#4caf50"
            >
              <title>
                {point.x} {options[parameter][1]}: {point.y} ккал
              </title>
            </circle>
          ))}

          <text
            x={pad}
            y={height - 8}
            fontSize="10"
            fill="#64748b"
          >
            {points[0].x} {options[parameter][1]}
          </text>

          <text
            x={width - pad}
            y={height - 8}
            textAnchor="end"
            fontSize="10"
            fill="#64748b"
          >
            {points[points.length - 1].x} {options[parameter][1]}
          </text>
        </svg>
      </div>

      <p className={styles.helperText}>
        Графік показує зміну розрахункової цільової калорійності для обраної моделі. Діапазон навколо поточного значення використовується для демонстрації чутливості, а не як
        рекомендовані межі параметра.
      </p>
    </section>
  );
}

export default SensitivityAnalysis;
