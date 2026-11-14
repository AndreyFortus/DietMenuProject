import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PLAN_TEMPLATES,
  buildEnergyPlan,
} from '../../utils/nutrition/energyModels';
import { exportPlanPdf } from '../../utils/nutrition/pdfExport';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';

function EnergyPlanBuilder({ baseCalories, selectedModel, profile }) {
  const [days, setDays] = useState('7');
  const [mode, setMode] = useState('stable');
  const [template, setTemplate] = useState('balanced');

  const [distribution, setDistribution] = useState({
    protein: '20',
    fat: '30',
    carbs: '50',
  });

  const [factors, setFactors] = useState({});
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('1');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const count = Number(days);

  const chosenTemplate = PLAN_TEMPLATES.find(
    (item) => item.id === template
  );

  const applyTemplate = (id) => {
    const item = PLAN_TEMPLATES.find(
      (entry) => entry.id === id
    );

    setTemplate(id);

    setDistribution({
      protein: String(item.protein),
      fat: String(item.fat),
      carbs: String(item.carbs),
    });

    setPlan(null);
  };

  const createPlan = (event) => {
    event.preventDefault();

    try {
      const activityFactors = Array.from(
        { length: count },
        (_, index) => Number(factors[index] || 1)
      );

      const result = buildEnergyPlan({
        baseCalories,
        days: count,
        mode,
        activityFactors,
        distribution,
      });

      setPlan({
        ...result,
        templateName: chosenTemplate.name,
        modelName: selectedModel.name,
        profile,
      });

      setSelectedDay('1');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const sendToCalculator = () => {
    const row = plan.rows.find(
      (item) => item.day === Number(selectedDay)
    );

    if (!row) return;

    localStorage.setItem(
      'nutriplan-calculator-targets',
      JSON.stringify({
        protein: row.macros.protein,
        fat: row.macros.fat,
        carbs: row.macros.carbs,
        calories: row.calories,
        days: Math.min(plan.days, 7),
      })
    );

    navigate('/calculator');
  };

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Планувальник енергетичних потреб</h2>
          <p>
            Сформуйте план калорійності та макронутрієнтів на обраний період.
          </p>
        </div>
      </div>

      <form onSubmit={createPlan}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="planDays">Тривалість плану</label>
            <select
              id="planDays"
              value={days}
              onChange={(event) => {
                setDays(event.target.value);
                setPlan(null);
              }}
            >
              <option value="7">7 днів</option>
              <option value="14">14 днів</option>
              <option value="30">30 днів</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="planMode">Розподіл калорійності</label>
            <select
              id="planMode"
              value={mode}
              onChange={(event) => {
                setMode(event.target.value);
                setPlan(null);
              }}
            >
              <option value="stable">Стабільна калорійність</option>
              <option value="variable">Змінна за активністю дня</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="planTemplate">Шаблон БЖВ</label>
            <select
              id="planTemplate"
              value={template}
              onChange={(event) => applyTemplate(event.target.value)}
            >
              {PLAN_TEMPLATES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className={styles.helperText}>
          {chosenTemplate.description} Шаблони є налаштуваннями розподілу енергії, а не медичними дієтичними рекомендаціями.
        </p>

        {mode === 'variable' && (
          <div className={styles.dayFactors}>
            <h3>Коефіцієнти активності за днями</h3>

            <p className={styles.helperText}>
              1.00 відповідає базовій добовій цілі обраної моделі.
              Змінюйте коефіцієнт для сценарного планування.
            </p>

            <div className={styles.formGrid}>
              {Array.from({ length: count }, (_, index) => (
                <div className={styles.field} key={index}>
                  <label htmlFor={`dayFactor${index}`}>
                    День {index + 1}
                  </label>

                  <input
                    id={`dayFactor${index}`}
                    type="number"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={factors[index] || '1'}
                    onChange={(event) =>
                      setFactors((previous) => ({
                        ...previous,
                        [index]: event.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className={styles.subHeading}>
          Розподіл макронутрієнтів
        </h3>

        <div className={styles.macroInputs}>
          {[
            ['protein', 'Білки'],
            ['fat', 'Жири'],
            ['carbs', 'Вуглеводи'],
          ].map(([key, label]) => (
            <div className={styles.field} key={key}>
              <label htmlFor={`plan-${key}`}>
                {label} (%)
              </label>

              <input
                id={`plan-${key}`}
                type="number"
                min="0"
                max="100"
                value={distribution[key]}
                onChange={(event) => {
                  setDistribution((previous) => ({
                    ...previous,
                    [key]: event.target.value,
                  }));
                  setPlan(null);
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.formActions}>
          <button
            className={styles.primaryButton}
            type="submit"
          >
            Сформувати план
          </button>
        </div>
      </form>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {plan && (
        <div className={styles.planResult}>
          <div className={styles.planSummary}>
            <div>
              <span>Середня калорійність</span>
              <strong>{plan.averageCalories} ккал</strong>
            </div>

            <div>
              <span>Загалом за період</span>
              <strong>
                {plan.totalCalories.toLocaleString('uk-UA')} ккал
              </strong>
            </div>

            <div>
              <span>Тривалість</span>
              <strong>{plan.days} днів</strong>
            </div>
          </div>

          <div className={styles.analysisTableWrap}>
            <table className={styles.analysisTable}>
              <thead>
                <tr>
                  <th>День</th>
                  <th>Ккал</th>
                  <th>Білки</th>
                  <th>Жири</th>
                  <th>Вуглеводи</th>
                </tr>
              </thead>

              <tbody>
                {plan.rows.map((row) => (
                  <tr key={row.day}>
                    <td>День {row.day}</td>
                    <td>{row.calories}</td>
                    <td>{row.macros.protein} г</td>
                    <td>{row.macros.fat} г</td>
                    <td>{row.macros.carbs} г</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.planActions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => exportPlanPdf(plan)}
            >
              Експортувати PDF
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => window.print()}
            >
              Друк сторінки
            </button>
          </div>

          <div className={styles.integrationBox}>
            <h3>Використати цілі у генераторі раціону</h3>

            <p className={styles.helperText}>
              Передається калорійність і БЖВ вибраного дня.
              Генератор раціону підтримує план до 7 днів.
            </p>

            <div className={styles.integrationRow}>
              <div className={styles.field}>
                <label htmlFor="integrationDay">
                  День плану
                </label>

                <select
                  id="integrationDay"
                  value={selectedDay}
                  onChange={(event) =>
                    setSelectedDay(event.target.value)
                  }
                >
                  {plan.rows.map((row) => (
                    <option key={row.day} value={row.day}>
                      День {row.day}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={styles.primaryButton}
                onClick={sendToCalculator}
              >
                Передати в генератор
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EnergyPlanBuilder;
