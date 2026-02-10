import React, { useState, useEffect } from "react";
import styles from "./DishesPage.module.css";
import MealCard from "../../components/MealCard/MealCard";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";

const API_URL = "https://nutriplan-api-zxid.onrender.com/api/products/";

function DishesPage() {
  const [allDishes, setAllDishes] = useState([]);
  const [dishes, setDishes] = useState([]);
  // const [activeFilter, setActiveFilter] = useState("all");
  const [activeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dishes");
        return res.json();
      })
      .then((data) => {
        console.log("Dishes loaded:", data);
        setAllDishes(data);
        setDishes(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (allDishes.length === 0) return;

    let filtered = allDishes;

    if (activeFilter !== "all") {
      filtered = filtered.filter((dish) => dish.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((dish) =>
        dish.title.toLowerCase().includes(query)
      );
    }

    setDishes(filtered);
  }, [activeFilter, searchQuery, allDishes]);

  return (
    <div className={styles.dishesPage}>
      <div className={styles.header}>
        <h1>База даних страв</h1>
        <p>Переглядайте колекцію страв та продуктів</p>
      </div>

      <div className={styles.searchBlock}>
        <div className={styles.filterHeader}>
          {/* <h3>Фільтри</h3> */}
          <h3>Пошук</h3>
          <p>Знайдіть потрібні продукти</p>
        </div>
        <div className={styles.searchBar}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Шукайте страви або продукти"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* <div className={styles.filterList}>
            <button
              className={
                activeFilter === "all"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("all")}
            >
              Всі
            </button>
            <button
              className={
                activeFilter === "product"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("product")}
            >
              Продукти
            </button>
            <button
              className={
                activeFilter === "dish"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("dish")}
            >
              Страви
            </button>
            <button
              className={
                activeFilter === "drink"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("drink")}
            >
              Напої
            </button>
            <button
              className={
                activeFilter === "other"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("other")}
            >
              Інше
            </button>
          </div> */}
      </div>

      <span className={styles.count}>{dishes.length} dishes found</span>

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <div className={styles.dishesGrid}>
          {dishes.map((meal) => (
            <MealCard key={meal.id} data={meal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DishesPage;
