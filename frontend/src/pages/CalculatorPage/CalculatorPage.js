import React, { useState } from "react";
import styles from "./CalculatorPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import RationSection from "../../components/RationSection/RationSection";
import StatisticSection from "../../components/StatisticSection/StatisticSection";

function CalculatorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const [apiData, setApiData] = useState(null);

  const handleGenerate = (data) => {
    setApiData(data);
    setShowResults(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainContent = isSidebarOpen
    ? styles.mainContent
    : `${styles.mainContent} ${styles.mainContentExpanded}`;

  return (
    <div className={styles.calculatorPage}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <main className={mainContent}>
        <div className={styles.header}>
          <h1>Формування раціону</h1>
          <p>Введіть ваші цілі по макронутрієнтам</p>
        </div>

        <CalculatorForm onGenerate={handleGenerate} />
        {showResults && (
          <>
            <RationSection meals={apiData.ration} />
            <StatisticSection stats={apiData.statistics} />
          </>
        )}
      </main>
    </div>
  );
}

export default CalculatorPage;
