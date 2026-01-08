import React, { useState } from "react";
import styles from "./CalculatorPage.module.css";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import RationSection from "../../components/RationSection/RationSection";
import StatisticSection from "../../components/StatisticSection/StatisticSection";

function CalculatorPage() {
  const [showResults, setShowResults] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [resetTab, setResetTab] = useState(false);

  const handleGenerate = (data) => {
    setApiData(data);
    setShowResults(true);
    setResetTab(true);
  };

  return (
    <div className={styles.calculatorPage}>
      <div className={styles.header}>
        <h1>Формування раціону</h1>
        <p>Введіть ваші цілі по макронутрієнтам</p>
      </div>

      <CalculatorForm onGenerate={handleGenerate} />
      {showResults && (
        <>
          <RationSection
            meals={apiData.meals}
            resetTab={resetTab}
            onResetDone={() => setResetTab(false)}
          />
          <StatisticSection stats={apiData.statistics} />
        </>
      )}
    </div>
  );
}

export default CalculatorPage;
