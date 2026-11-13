import React, { useState } from 'react';
import styles from '../../pages/NutritionNeedsPage/NutritionNeedsPage.module.css';
import { ACTIVITY_LEVELS, GOALS } from '../../utils/nutrition/energyModels';

function PersonalDataForm({ onCalculate }) {
  const [form, setForm] = useState({
    sex: 'female',
    age: '25',
    height: '165',
    weight: '60',
    activity: '1.2',
    goal: 'maintain',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      onCalculate(form);
      setError('');
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>Ваші параметри</h2>
          <p>
            Вкажіть персональні дані для оцінювання
            добових енергетичних потреб.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="sex">Стать</label>
            <select
              id="sex"
              name="sex"
              value={form.sex}
              onChange={handleChange}
            >
              <option value="female">Жіноча</option>
              <option value="male">Чоловіча</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="age">Вік (років)</label>
            <input
              id="age"
              name="age"
              type="number"
              min="18"
              max="100"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="height">Зріст (см)</label>
            <input
              id="height"
              name="height"
              type="number"
              min="120"
              max="230"
              value={form.height}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="weight">Маса тіла (кг)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="30"
              max="300"
              step="0.1"
              value={form.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="activity">
              Фізична активність
            </label>
            <select
              id="activity"
              name="activity"
              value={form.activity}
              onChange={handleChange}
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option
                  key={level.value}
                  value={level.value}
                >
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="goal">Мета</label>
            <select
              id="goal"
              name="goal"
              value={form.goal}
              onChange={handleChange}
            >
              {GOALS.map((goal) => (
                <option
                  key={goal.value}
                  value={goal.value}
                >
                  {goal.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={styles.primaryButton}>
            Розрахувати потреби
          </button>
        </div>
      </form>
    </section>
  );
}

export default PersonalDataForm;
