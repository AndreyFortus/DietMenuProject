import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../api";
import styles from "./Fridge.module.css";

const Fridge = () => {
  const { user } = useOutletContext() || {};
  const [myItems, setMyItems] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState("");
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
      console.error("Помилка завантаження даних:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setMyItems([]);
      setAllIngredients([]);
    }
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedIngredient) return alert("Будь ласка, оберіть продукт!");

    try {
      const newItem = {
        ingredient: selectedIngredient,
        weight_g: parseInt(weight, 10),
      };

      await api.post("fridge/", newItem);

      fetchData();

      setSelectedIngredient("");
      setWeight(100);
    } catch (error) {
      console.error("Не вдалося додати продукт:", error);
      alert("Помилка при додаванні. Перевірте з'єднання.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Видалити цей продукт з холодильника?")) return;

    try {
      await api.delete(`fridge/${id}/`);
      setMyItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Не вдалося видалити продукт.");
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyStateContainer}>
          <h2 className={styles.emptyStateIcon}>🔒 Доступ обмежено</h2>
          <p>
            Будь ласка, увійдіть у свій Google-акаунт (у меню зліва або зверху),
            щоб керувати холодильником.
          </p>
        </div>
      </div>
    );
  }

  if (loading && myItems.length === 0 && allIngredients.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Завантаження вмісту холодильника...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        ❄️ Мій Холодильник{" "}
        <span className={styles.userNameText}>({user.name})</span>
      </h2>

      <div className={styles.addForm}>
        <h3 className={styles.iconPlus}>➕</h3>
        <form onSubmit={handleAdd} className={styles.formRow}>
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">-- Оберіть продукт --</option>
            {allIngredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Грами"
            className={styles.input}
            min="1"
          />

          <button type="submit" className={styles.addButton}>
            Додати
          </button>
        </form>
      </div>

      <div>
        {myItems.length === 0 ? (
          <p className={styles.emptyState}>
            Холодильник порожній 🕸️ Додайте сюди продукти, які у вас є.
          </p>
        ) : (
          <ul className={styles.list}>
            {myItems.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.itemText}>
                  <strong>
                    {item.ingredient_name || item.ingredient_title || "Продукт"}
                  </strong>{" "}
                  — {item.weight_g} г
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className={styles.deleteBtn}
                  title="Видалити"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Fridge;
