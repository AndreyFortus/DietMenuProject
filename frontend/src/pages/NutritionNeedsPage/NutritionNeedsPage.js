import React, { useMemo, useState } from 'react';

import PersonalDataForm from '../../components/NutritionNeeds/PersonalDataForm';
import ModelComparison from '../../components/NutritionNeeds/ModelComparison';
import CalculationResults from '../../components/NutritionNeeds/CalculationResults';
import MacroDistribution from '../../components/NutritionNeeds/MacroDistribution';
import StatisticalAnalysis from '../../components/NutritionNeeds/StatisticalAnalysis';
import SensitivityAnalysis from '../../components/NutritionNeeds/SensitivityAnalysis';
import EnergyPlanBuilder from '../../components/NutritionNeeds/EnergyPlanBuilder';

import {
  calculateEnergyModels,
  calculateMacros,
  getModelDifference,
} from '../../utils/nutrition/energyModels';

import styles from './NutritionNeedsPage.module.css';

function NutritionNeedsPage() {
  const [calculation, setCalculation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState('mifflin');

  const [distribution, setDistribution] = useState({
    protein: '20',
    fat: '30',
    carbs: '50',
  });

  const handleCalculate = (nextProfile) => {
    const result = calculateEnergyModels(nextProfile);

    setCalculation(result);
    setProfile(nextProfile);
    setSelectedModelId('mifflin');
  };

  const selectedModel = calculation?.models.find(
    (model) => model.id === selectedModelId
  );

  const statistics = useMemo(
    () => calculation
      ? getModelDifference(calculation.models)
      : null,
    [calculation]
  );

  const macros = useMemo(() => {
    if (!selectedModel) return null;

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
          Оцінювання індивідуальних енергетичних потреб,
          порівняння математичних моделей та планування
          макронутрієнтів.
        </p>
      </header>

      <PersonalDataForm onCalculate={handleCalculate} />

      {calculation && selectedModel && (
        <>
          <ModelComparison
            models={calculation.models}
            selectedModel={selectedModelId}
            onSelect={setSelectedModelId}
          />

          <CalculationResults
            model={selectedModel}
            difference={statistics}
          />

          <StatisticalAnalysis statistics={statistics} />

          <SensitivityAnalysis
            profile={profile}
            modelId={selectedModelId}
          />

          <MacroDistribution
            distribution={distribution}
            onChange={setDistribution}
            macros={macros}
          />

          <EnergyPlanBuilder
            baseCalories={selectedModel.target}
            selectedModel={selectedModel}
            profile={profile}
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
            Заповніть форму, щоб порівняти математичні моделі,
            дослідити вплив параметрів і сформувати персональний план.
          </p>
        </div>
      )}
    </div>
  );
}

export default NutritionNeedsPage;
