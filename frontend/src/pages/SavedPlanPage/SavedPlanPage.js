import React, { useState, useEffect, useMemo } from "react";
import api from "../../api";
import MealCard from "../../components/MealCard/MealCard";
import ShoppingList from "../../components/ShoppingList/ShoppingList";
import { calculateShoppingList } from "../../utils/shoppingLogic";
import styles from "./SavedPlanPage.module.css";

import { ReactComponent as BreakfastIcon } from "../../assets/breakfast-icon.svg";
import { ReactComponent as LunchIcon } from "../../assets/lunch-icon.svg";
import { ReactComponent as DinnerIcon } from "../../assets/dinner-icon.svg";

function SavedPlanPage() {
  const isAuthenticated = !!localStorage.getItem("nutri_token");

  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFridge, setCurrentFridge] = useState([]);
  const [isDeducting, setIsDeducting] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const mealTypeConfig = {
    breakfast: { label: "Сніданок", icon: BreakfastIcon },
    lunch: { label: "Обід", icon: LunchIcon },
    dinner: { label: "Вечеря", icon: DinnerIcon },
  };

  const mealOrder = ["breakfast", "lunch", "dinner"];

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const [planRes, fridgeRes] = await Promise.all([
          api.get("plans/"),
          api.get("fridge/"),
        ]);

        if (planRes.data.length > 0) {
          const fetchedPlan = planRes.data[0].plan_data;
          setPlan(fetchedPlan);

          if (fetchedPlan.days && fetchedPlan.days.length > 0) {
            setSelectedDay(fetchedPlan.days[0].day_number);
          }
        }
        setCurrentFridge(fridgeRes.data);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  const shoppingList = useMemo(() => {
    if (!plan || !currentFridge) return null;
    return calculateShoppingList(plan, currentFridge);
  }, [plan, currentFridge]);

  const handleCookMeal = async () => {
    if (!plan || !window.confirm("Списати продукти з холодильника?")) return;

    setIsDeducting(true);
    try {
      await api.patch("fridge/...", {});
      alert("Смачного! Продукти списані.");
      const fridgeRes = await api.get("fridge/");
      setCurrentFridge(fridgeRes.data);
    } catch (e) {
      alert("Помилка списання");
    } finally {
      setIsDeducting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.noPlan}>
          <h2>Потрібна авторизація</h2>
          <p>
            Щоб зберігати та переглядати свій раціон, будь ласка, увійдіть в
            акаунт.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading)
    return <div className={styles.loader}>Завантаження вашого плану...</div>;
  if (!plan)
    return (
      <div className={styles.noPlan}>
        У вас ще немає збережених планів. Згенеруйте один у калькуляторі!
      </div>
    );

  const activeDayData = plan.days.find((d) => d.day_number === selectedDay);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Мій активний раціон</h1>
        <p className={styles.subtitle}>
          Ваш актуальний план харчування. Переглядайте меню на кожен день та
          зручно керуйте списком покупок.
        </p>
      </header>

      {/* Кнопки перемикання днів */}
      <div className={styles.dayTabs}>
        {plan.days.map((day) => (
          <button
            key={day.day_number}
            className={`${styles.tabButton} ${selectedDay === day.day_number ? styles.activeTab : ""}`}
            onClick={() => setSelectedDay(day.day_number)}
          >
            День {day.day_number}
          </button>
        ))}
      </div>

      <main className={styles.mainContent}>
        {activeDayData && (
          <div className={styles.whiteCardContainer}>
            {mealOrder.map((mealType) => {
              const items = activeDayData.meals[mealType];
              if (!items || items.length === 0) return null;

              const config = mealTypeConfig[mealType];
              const MealIcon = config.icon;

              return (
                <div key={mealType} className={styles.mealRow}>
                  <div className={styles.mealHeader}>
                    <span className={styles.mealIcon}>
                      <MealIcon />
                    </span>
                    <span className={styles.mealTitle}>{config.label}</span>
                  </div>

                  <div className={styles.cardsGrid}>
                    {items.map((dish) => (
                      <MealCard key={dish.id} data={dish} readonly={true} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <section className={styles.shoppingListSection}>
        <ShoppingList
          list={shoppingList}
          onCook={handleCookMeal}
          isDeducting={isDeducting}
        />
      </section>
    </div>
  );
}

export default SavedPlanPage;
