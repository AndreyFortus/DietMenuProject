import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./CalculatorForm.module.css";
import Button from "../Button/Button";
import NutrientInput from "../NutrientInput/NutrientInput";

import { calculateShoppingList } from "../../utils/shoppingLogic";
import api from "../../api";

import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { ReactComponent as SparkleIcon } from "../../assets/sparkle-icon.svg";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up.svg";

const BASE_URL = process.env.REACT_APP_API_URL;

const PRODUCTS_API_URL = `${BASE_URL}/products/`;
const CALCULATE_API_URL = `${BASE_URL}/optimize-meal/`;

const MIN_VALUES = {
  protein: 50,
  fat: 50,
  carbs: 130,
};

function CalculatorForm({ onGenerate }) {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [isShoppingListLoading, setIsShoppingListLoading] = useState(false);

  const [macros, setMacros] = useState({
    protein: "",
    fat: "",
    carbs: "",
    calories: "",
  });

  const [userMacros, setUserMacros] = useState({
    protein: "",
    fat: "",
    carbs: "",
    calories: "",
  });

  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    let mounted = true;

    async function load() {
      try {
        console.log("Loading products from", PRODUCTS_API_URL);
        const res = await fetch(PRODUCTS_API_URL, { signal: ac.signal });
        if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        const productsWithState = data.map((p) => ({ ...p, checked: false }));
        setAllProducts(productsWithState);
        console.log("Products loaded:", productsWithState.length);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error loading products:", err);
        setLoadError("Не вдалося завантажити продукти");
      }
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) => (p.title || "").toLowerCase().includes(q));
  }, [allProducts, searchQuery]);

  const columns = useMemo(() => {
    const cols = [[], [], []];
    filteredProducts.forEach((product, index) => {
      cols[index % 3].push(product);
    });
    return cols;
  }, [filteredProducts]);

  const handleCheckboxChange = useCallback((id) => {
    setAllProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)),
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setAllProducts((prev) => prev.map((p) => ({ ...p, checked: false })));
  }, []);

  const handleMacroChange = useCallback(
    (field, value) => {
      setMacros((prev) => ({ ...prev, [field]: value }));
      setUserMacros((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  const validate = useCallback(() => {
    const newErrors = {};
    const { protein, fat, carbs, calories } = macros;
    let isValid = true;

    const p = Number(protein) || 0;
    const f = Number(fat) || 0;
    const c = Number(carbs) || 0;
    const cal = Number(calories) || 0;

    if (!macros.protein || Number(macros.protein) < MIN_VALUES.protein) {
      newErrors.protein = `Мін. ${MIN_VALUES.protein}г`;
      isValid = false;
    }
    if (!macros.fat || Number(macros.fat) < MIN_VALUES.fat) {
      newErrors.fat = `Мін. ${MIN_VALUES.fat}г`;
      isValid = false;
    }
    if (!macros.carbs || Number(macros.carbs) < MIN_VALUES.carbs) {
      newErrors.carbs = `Мін. ${MIN_VALUES.carbs}г`;
      isValid = false;
    }
    if (!macros.calories || Number(macros.calories) < MIN_VALUES.calories) {
      newErrors.calories = `Мін. ${MIN_VALUES.calories} ккал`;
      isValid = false;
    }

    const calculatedMinCaloriesRaw = p * 4 + f * 9 + c * 4;
    const bufferPercent = 0.02;
    const minBuffer = 10;
    const buffer = Math.max(
      minBuffer,
      Math.ceil(calculatedMinCaloriesRaw * bufferPercent),
    );
    const calculatedMinCalories =
      Math.ceil((calculatedMinCaloriesRaw + buffer) / 10) * 10;

    if (cal < calculatedMinCalories) {
      newErrors.calories = `Мінімально необхідні: ${calculatedMinCalories} ккал для ${p}Б/${f}Ж/${c}В`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid && Object.keys(newErrors).length === 0;
  }, [macros]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    const selectedProducts = allProducts.filter((p) => p.checked);

    const requestData = {
      target_macros: {
        protein: Number(macros.protein),
        fat: Number(macros.fat),
        carbs: Number(macros.carbs),
        calories: Number(macros.calories),
      },
      selected_products: selectedProducts,
    };

    console.log("Sending data to backend:", requestData);

    setIsLoading(true);
    setShoppingList(null);

    try {
      const res = await fetch(CALCULATE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Server error ${res.status}`);
      }
      const data = await res.json();
      console.log("Received response:", data);

      setResult(data);

      const formatMealItems = (items) => {
        if (!items || !Array.isArray(items)) {
          return [];
        }

        return items.map((item, index) => ({
          id: item.id || `${Date.now()}-${index}`,
          title: item.name,
          description: item.description || "",
          image: item.image || "",
          price: item.cost ? item.cost.toFixed(2) : "0.00",
          portion: `(~ ${item.cost ? item.cost.toFixed(0) : 0} ₴ порція)`,
          weight: item.grams ? item.grams.toFixed(0) : null,
          calories: item.calories ? item.calories.toFixed(0) : "0",
          protein: item.protein ? item.protein.toFixed(0) : "0",
          fat: item.fat ? item.fat.toFixed(0) : "0",
          carbs: item.carbs ? item.carbs.toFixed(0) : "0",
        }));
      };

      const formattedMeals = {
        breakfast: formatMealItems(data.breakfast?.items),
        lunch: formatMealItems(data.lunch?.items),
        dinner: formatMealItems(data.dinner?.items),
      };

      const getTotal = (mealData, field) => {
        return mealData?.totals?.[field] || 0;
      };

      const totalStats = {
        price:
          getTotal(data.breakfast, "price") +
          getTotal(data.lunch, "price") +
          getTotal(data.dinner, "price"),
        calories:
          getTotal(data.breakfast, "calories") +
          getTotal(data.lunch, "calories") +
          getTotal(data.dinner, "calories"),
        protein:
          getTotal(data.breakfast, "protein") +
          getTotal(data.lunch, "protein") +
          getTotal(data.dinner, "protein"),
        fat:
          getTotal(data.breakfast, "fat") +
          getTotal(data.lunch, "fat") +
          getTotal(data.dinner, "fat"),
        carbs:
          getTotal(data.breakfast, "carbs") +
          getTotal(data.lunch, "carbs") +
          getTotal(data.dinner, "carbs"),
      };

      const formattedData = {
        meals: formattedMeals,
        statistics: {
          totalCost: totalStats.price.toFixed(2),
          totalCalories: totalStats.calories.toFixed(0),
          macros: {
            protein: `${totalStats.protein.toFixed(0)}г`,
            fat: `${totalStats.fat.toFixed(0)}г`,
            carbs: `${totalStats.carbs.toFixed(0)}г`,
          },
        },
      };

      setIsProductsOpen(true);

      if (onGenerate) onGenerate(formattedData);
    } catch (err) {
      console.error("Calculate error:", err);
      alert("Помилка сервера. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  }, [macros, allProducts, validate, onGenerate]);

  const contentClassName = isProductsOpen
    ? styles.productsContent
    : `${styles.productsContent} ${styles.productsContentClosed}`;

  const selectedCount = useMemo(
    () => allProducts.filter((p) => p.checked).length,
    [allProducts],
  );

  const renderColumn = (col) => {
    if (!col.length) return <div className={styles.emptyColumn}>—</div>;
    return col.map((product) => (
      <label key={product.id} className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={!!product.checked}
          onChange={() => handleCheckboxChange(product.id)}
          aria-checked={!!product.checked}
        />
        <span className={styles.customCheckbox} aria-hidden="true"></span>
        <span className={styles.productTitle}>{product.title}</span>
      </label>
    ));
  };

  const handleShowShoppingList = async () => {
    if (!result) return;

    setIsShoppingListLoading(true);
    try {
      const fridgeRes = await api.get("fridge/");
      const list = calculateShoppingList(result, fridgeRes.data);
      setShoppingList(list);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Не вдалося завантажити холодильник. Можливо, ви не авторизовані.");
    } finally {
      setIsShoppingListLoading(false);
    }
  };

  return (
    <div className={styles.calculatorForm} aria-busy={isLoading}>
      <div className={styles.parameterSection}>
        <div className={styles.textBlock}>
          <h3>Ваші параметри</h3>
          <p>
            Введіть бажану мінімальну кількість білків, жирів, вуглеводів та
            бажану максимальну кількість калорій.
          </p>
        </div>

        <div className={styles.inputList}>
          <NutrientInput
            label="Білки (г)"
            value={userMacros.protein}
            onChange={(v) => handleMacroChange("protein", v)}
            error={errors.protein}
          />
          <NutrientInput
            label="Жири (г)"
            value={userMacros.fat}
            onChange={(v) => handleMacroChange("fat", v)}
            error={errors.fat}
          />
          <NutrientInput
            label="Вуглеводи (г)"
            value={userMacros.carbs}
            onChange={(v) => handleMacroChange("carbs", v)}
            error={errors.carbs}
          />
          <NutrientInput
            label="Калорії (ккал)"
            value={userMacros.calories}
            onChange={(v) => handleMacroChange("calories", v)}
            error={errors.calories}
          />
        </div>
      </div>

      <div className={styles.productSectionWrapper}>
        <div className={styles.productSection}>
          <div className={styles.productHeader}>
            <div className={styles.textBlock}>
              <h3>Вибір продуктів та страв</h3>
              <p>Оберіть продукти або страви для формування раціону</p>
            </div>
            <button
              className={styles.chevronUpButton}
              onClick={() => setIsProductsOpen((s) => !s)}
              aria-expanded={isProductsOpen}
              aria-label={isProductsOpen ? "Закрити список" : "Відкрити список"}
            >
              <ChevronUpIcon
                className={isProductsOpen ? "" : styles.iconRotated}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className={contentClassName}>
            <div className={styles.productsContentInner}>
              <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper}>
                  <SearchIcon aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Пошук страв та продуктів..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Пошук продуктів"
                  />
                </div>
              </div>

              <span className={styles.selectedCount}>
                Обрано: {selectedCount} страв
                {selectedCount === 0 &&
                  " — для генерації будуть використані всі доступні страви"}
              </span>

              {loadError && <div className={styles.errorText}>{loadError}</div>}

              <div className={styles.productList}>
                <div className={styles.productColumn}>
                  {renderColumn(columns[0])}
                </div>
                <div className={styles.productColumn}>
                  {renderColumn(columns[1])}
                </div>
                <div className={styles.productColumn}>
                  {renderColumn(columns[2])}
                </div>
              </div>

              <button
                className={styles.clearButton}
                onClick={handleClearAll}
                disabled={isLoading}
              >
                Скинути всі обрані страви
              </button>

              {filteredProducts.length === 0 && (
                <div className={styles.noResults}>
                  Нічого не знайдено за запитом.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <div
          onClick={() => {
            if (!isLoading) handleSubmit();
          }}
        >
          <Button
            variant="primary"
            iconBefore={<SparkleIcon />}
            disabled={isLoading}
          >
            {isLoading ? "Генерація..." : "Згенерувати раціон"}
          </Button>
        </div>
      </div>
      {result && (
        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #eaeaea",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div onClick={handleShowShoppingList}>
              <Button
                variant="secondary"
                disabled={isShoppingListLoading}
                iconBefore={<span>🛒</span>}
              >
                {isShoppingListLoading
                  ? "Аналізуємо холодильник..."
                  : "Сформувати список покупок"}
              </Button>
            </div>
          </div>

          {shoppingList && (
            <div
              style={{
                marginTop: "20px",
                overflowX: "auto",
                background: "#fff",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#2d3748" }}>
                Ваш список покупок:
              </h3>

              {shoppingList.length === 0 ? (
                <div
                  style={{
                    padding: "15px",
                    background: "#e6fffa",
                    color: "#2c7a7b",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  🎉 Чудово! У вас вдома є всі необхідні продукти.
                </div>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "15px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f7fafc",
                        textAlign: "left",
                        borderBottom: "2px solid #edf2f7",
                      }}
                    >
                      <th style={{ padding: "12px", color: "#4a5568" }}>
                        Продукт
                      </th>
                      <th style={{ padding: "12px", color: "#4a5568" }}>
                        Треба всього
                      </th>
                      <th style={{ padding: "12px", color: "#4a5568" }}>
                        Є вдома
                      </th>
                      <th style={{ padding: "12px", color: "#e53e3e" }}>
                        Купити
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoppingList.map((item, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #edf2f7" }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#2d3748",
                          }}
                        >
                          {item.name}
                        </td>
                        <td style={{ padding: "12px" }}>{item.needed} г</td>
                        <td style={{ padding: "12px", color: "#718096" }}>
                          {item.have} г
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "bold",
                            color: "#e53e3e",
                          }}
                        >
                          {item.toBuy} г
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button
                  onClick={() => setShoppingList(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#718096",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  Приховати список
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalculatorForm;
