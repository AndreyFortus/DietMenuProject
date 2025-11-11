import React, { useState, useEffect } from "react";
import styles from "./DishesPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MealCard from "../../components/MealCard/MealCard";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";

const MOCK_DATA = [
  {
    id: 1,
    type: "dish",
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
    type: "dish",
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
    type: "product",
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
    type: "drink",
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
    type: "product",
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = MOCK_DATA;

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
    // fetch(`/api/dishes?filter=${activeFilter}`)
    //   .then(res => res.json())
    //   .then(data => setDishes(data));
  }, [activeFilter, searchQuery]);

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
            <input
              type="text"
              placeholder="Шукайте страви або продукти"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
