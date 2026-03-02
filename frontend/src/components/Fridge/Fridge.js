import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Select from "react-select";
import api from "../../api";
import styles from "./Fridge.module.css";

const Fridge = () => {
  const { user } = useOutletContext() || {};
  const [myItems, setMyItems] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [weight, setWeight] = useState(100);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [fridgeRes, ingredientsRes] = await Promise.all([
        api.get("fridge/"),
        api.get("ingredients/"),
      ]);
      setMyItems(fridgeRes.data);
      setAllIngredients(ingredientsRes.data.results || ingredientsRes.data);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedIngredient) return;

    try {
      const newItem = {
        ingredient: selectedIngredient.value,
        weight_g: parseInt(weight, 10),
      };
      await api.post("fridge/", newItem);
      fetchData();

      setSelectedIngredient(null);
      setWeight(100);
    } catch (error) {
      console.error("Помилка додавання:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`fridge/${id}/`);
      setMyItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <h2>🔒 Доступ обмежено</h2>
            <p>
              Будь ласка, увійдіть в акаунт, щоб керувати запасами продуктів.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const ingredientOptions = allIngredients.map((ing) => ({
    value: ing.id,
    label: ing.name,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "47px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#4caf50" : "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#4caf50" : "#d1d5db",
      },
      fontFamily: '"Inter", sans-serif',
      fontSize: "16px",
      backgroundColor: "#ffffff",
      cursor: "pointer",
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: '"Inter", sans-serif',
      fontSize: "16px",
      backgroundColor: state.isSelected
        ? "#4caf50"
        : state.isFocused
          ? "rgba(76, 175, 80, 0.1)"
          : "white",
      color: state.isSelected ? "white" : "#1f2937",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#43a047",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#757575",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10,
    }),
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Мій холодильник</h1>
        <p className={styles.pageSubtitle}>
          Керуйте наявними продуктами для точного розрахунку раціону
        </p>
      </header>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Додати продукт</h3>
        <form onSubmit={handleAdd} className={styles.formRow}>
          <div className={styles.inputGroup} style={{ flex: 2 }}>
            <label>Назва продукту</label>
            <Select
              value={selectedIngredient}
              onChange={setSelectedIngredient}
              options={ingredientOptions}
              styles={customStyles}
              placeholder="Шукати зі списку..."
              noOptionsMessage={() => "Продукт не знайдено"}
              isClearable
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </div>

          <div className={styles.inputGroup} style={{ maxWidth: "150px" }}>
            <label>Вага (г)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={styles.input}
              min="1"
            />
          </div>

          <button type="submit" className={styles.addButton}>
            Додати
          </button>
        </form>
      </div>

      <div className={styles.inventorySection}>
        <h3 className={styles.sectionTitle}>
          Наявні інгредієнти ({myItems.length})
        </h3>
        {loading && myItems.length === 0 ? (
          <p>Оновлення...</p>
        ) : myItems.length === 0 ? (
          <div className={styles.card}>
            <p className={styles.emptyText}>
              У вашому холодильнику поки порожньо 🕸️
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {myItems.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>
                    {item.ingredient_name || "Продукт"}
                  </span>
                  <span className={styles.itemWeight}>{item.weight_g} г</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={styles.deleteBtn}
                  title="Видалити"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Fridge;
