import React, { useState, useEffect } from "react";
import styles from "./DishesPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MealCard from "../../components/MealCard/MealCard";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";

const MOCK_DATA = [
  {
    id: 1,
    image: "/images/oatmeal.jpg",
    title: "Вівсянка з фруктами",
    description: "Вівсянка, Молоко...",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 2,
    image: "/images/carbonara.jpg",
    title: 'Паста "Карбонара"',
    description: "Спагеті, Бекон...",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 3,
    image: "/images/cheese.jpg",
    title: "Сир коров'ячий",
    description: "Сир коров'ячий...",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 4,
    image: "/images/tea.jpg",
    title: "Чорний чай",
    description: "Чорний чай без цукру",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
  {
    id: 5,
    image: "/images/apple.jpg",
    title: "Яблуко зелене",
    description: "Просто яблуко :)",
    price: "18.50",
    portion: "(~ 125 ₴ порція)",
    calories: "285",
    protein: "32",
    fat: "12",
    carbs: "8",
  },
];

function DishesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dishes, setDishes] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    // Тут буде fetch
    setDishes(MOCK_DATA);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainContentClass = isSidebarOpen
    ? styles.mainContent
    : `${styles.mainContent} ${styles.mainContentExpanded}`;

  return (
    <div className={styles.dishesPage}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <main className={mainContentClass}>
        <div className={styles.header}>
          <h1>База даних страв</h1>
          <p>Переглядайте колекцію страв та продуктів</p>
        </div>

        <div className={styles.searchBlock}>
          <div className={styles.filterHeader}>
            <h3>Фільтри</h3>
            <p>Знайдіть потрібні продукти</p>
          </div>
          <div className={styles.searchBar}>
            <SearchIcon />
            <input type="text" placeholder="Шукайте страви або продукти" />
          </div>

          <div className={styles.filterList}>
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
                activeFilter === "products"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("products")}
            >
              Продукти
            </button>
            <button
              className={
                activeFilter === "dishes"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("dishes")}
            >
              Страви
            </button>
            <button
              className={
                activeFilter === "drinks"
                  ? styles.filterActive
                  : styles.filterButton
              }
              onClick={() => setActiveFilter("drinks")}
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
          </div>
        </div>

        <span className={styles.count}>{dishes.length} dishes found</span>

        <div className={styles.dishesGrid}>
          {dishes.map((meal) => (
            <MealCard key={meal.id} data={meal} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default DishesPage;
