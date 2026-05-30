import React, { useState } from "react";
import styles from "./CalculatorPage.module.css";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import RationSection from "../../components/RationSection/RationSection";
import StatisticSection from "../../components/StatisticSection/StatisticSection";
import DaySelector from "../../components/DaySelector/DaySelector";

function CalculatorPage() {
  const [showResults, setShowResults] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [resetTab, setResetTab] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const handleGenerate = (data) => {
    const formattedData = data.days ? data : { days: [data] };

    setApiData(formattedData);
    setActiveDayIndex(0);
    setShowResults(true);
    setResetTab(true);
  };

  const handleMealReplaced = (mealType, oldDishId, newDishData) => {
    setApiData((prevData) => {
      if (!prevData || !prevData.days) return prevData;

      const currentDayData = prevData.days[activeDayIndex];
      if (!currentDayData || !currentDayData.meals) return prevData;

      const updatedMealsList = currentDayData.meals[mealType].map((dish) =>
        dish.id === oldDishId ? newDishData : dish,
      );

      const newMeals = {
        ...currentDayData.meals,
        [mealType]: updatedMealsList,
      };

      let totalCost = 0;
      let totalCalories = 0;
      let totalProtein = 0;
      let totalFat = 0;
      let totalCarbs = 0;

      Object.values(newMeals).forEach((mealArray) => {
        mealArray.forEach((dish) => {
          totalCost += Number(dish.price) || 0;
          totalCalories += Number(dish.calories) || 0;
          totalProtein += Number(dish.protein) || 0;
          totalFat += Number(dish.fat) || 0;
          totalCarbs += Number(dish.carbs) || 0;
        });
      });

      const updatedDay = {
        ...currentDayData,
        meals: newMeals,
        statistics: {
          totalCost: totalCost.toFixed(2),
          totalCalories: totalCalories.toFixed(0),
          macros: {
            protein: `${totalProtein.toFixed(0)}г`,
            fat: `${totalFat.toFixed(0)}г`,
            carbs: `${totalCarbs.toFixed(0)}г`,
          },
        },
      };

      const newDaysArray = [...prevData.days];
      newDaysArray[activeDayIndex] = updatedDay;

      return {
        ...prevData,
        days: newDaysArray,
      };
    });
  };

  const activeDayData = apiData?.days?.[activeDayIndex];

  return (
    <div className={styles.calculatorPage}>
      <div className={styles.header}>
        <h1>Формування раціону</h1>
        <p>Введіть ваші цілі по макронутрієнтам</p>
      </div>

      <CalculatorForm onGenerate={handleGenerate} currentMenuData={apiData} />
      {showResults && activeDayData && (
        <>
          <DaySelector
            daysCount={apiData.days.length}
            activeDayIndex={activeDayIndex}
            onDaySelect={(index) => {
              setActiveDayIndex(index);
              setResetTab(true);
            }}
          />

          <RationSection
            meals={activeDayData.meals}
            resetTab={resetTab}
            onResetDone={() => setResetTab(false)}
            onMealReplaced={handleMealReplaced}
          />
          <StatisticSection stats={activeDayData.statistics} />
        </>
      )}
    </div>
  );
}

export default CalculatorPage;
