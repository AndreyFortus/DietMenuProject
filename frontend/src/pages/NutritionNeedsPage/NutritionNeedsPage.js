import React, { useMemo, useState } from 'react';

import PersonalDataForm from '../../components/NutritionNeeds/PersonalDataForm';
import ModelComparison from '../../components/NutritionNeeds/ModelComparison';
import CalculationResults from '../../components/NutritionNeeds/CalculationResults';
import MacroDistribution from '../../components/NutritionNeeds/MacroDistribution';

import {
  calculateEnergyModels,
  calculateMacros,
  getModelDifference,
} from '../../utils/nutrition/energyModels';

import styles from './NutritionNeedsPage.module.css';

function NutritionNeedsPage() {
  const [calculation, setCalculation] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState('mifflin');

  const [distribution, setDistribution] = useState({
    protein: '20',
    fat: '30',
    carbs: '50',
  });

  const handleCalculate = (profile) => {
    const result = calculateEnergyModels(profile);

    setCalculation(result);
    setSelectedModelId('mifflin');
  };

  const selectedModel = calculation?.models.find(
    (model) => model.id === selectedModelId
  );

  const difference = useMemo(() => {
    if (!calculation) return null;

    return getModelDifference(calculation.models);
  }, [calculation]);

  const macros = useMemo(() => {
    if (!selectedModel) return null;

    const total =
      Number(distribution.protein) +
      Number(distribution.fat) +
      Number(distribution.carbs);

    if (
      !Number.isFinite(total) ||
      Math.abs(total - 100) > 0.01
    ) {
      return null;
    }

    try {
      return calculateMacros(selectedModel.target, distribution);
    } catch {
      return null;
    }
  }, [selectedModel, distribution]);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Потреби організму</h1>
        <p>
          Оцініть індивідуальні енергетичні потреби та
          розрахуйте добову кількість макронутрієнтів.
        </p>
      </header>

      <PersonalDataForm onCalculate={handleCalculate} />

      {calculation && (
        <>
          <ModelComparison
            models={calculation.models}
            selectedModel={selectedModelId}
            onSelect={setSelectedModelId}
          />

          <CalculationResults
            model={selectedModel}
            difference={difference}
          />

          <MacroDistribution
            calories={selectedModel.target}
            distribution={distribution}
            onChange={setDistribution}
            macros={macros}
          />

          <div className={styles.disclaimer}>
            <strong>Зверніть увагу</strong>
            <p>
              Наведені значення є розрахунковими оцінками,
              отриманими за математичними моделями. Фактичні
              енерговитрати можуть відрізнятися залежно від
              індивідуальних особливостей та умов життя.
              Результати не є медичними рекомендаціями.
            </p>
          </div>
        </>
      )}

      {!calculation && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>↗</div>
          <h2>Розрахуйте свої добові потреби</h2>
          <p>
            Заповніть форму вище, щоб побачити результати
            трьох математичних моделей та порівняти їх.
          </p>
        </div>
      )}
    </div>
  );
}

export default NutritionNeedsPage;
