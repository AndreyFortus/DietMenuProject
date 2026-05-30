import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CalculatorForm.module.css";
import Button from "../Button/Button";
import NutrientInput from "../NutrientInput/NutrientInput";

import api from "../../api";

import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { ReactComponent as SparkleIcon } from "../../assets/sparkle-icon.svg";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up.svg";
import { ReactComponent as SaveIcon } from "../../assets/save-icon.svg";

const BASE_URL = process.env.REACT_APP_API_URL;

const PRODUCTS_API_URL = `${BASE_URL}/products/`;
const CALCULATE_API_URL = `${BASE_URL}/optimize-meal/`;

const MIN_VALUES = {
  protein: 50,
  fat: 50,
  carbs: 130,
};

function CalculatorForm({ onGenerate, currentMenuData }) {
  const navigate = useNavigate();

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const [daysCount, setDaysCount] = useState(1);

  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dayOptions = [
    { value: 1, label: "1 день" },
    { value: 2, label: "2 дні" },
    { value: 3, label: "3 дні" },
    { value: 4, label: "4 дні" },
    { value: 5, label: "5 днів" },
    { value: 6, label: "6 днів" },
    { value: 7, label: "1 тиждень" },
  ];

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
      days: Number(daysCount),
    };

    setIsLoading(true);

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

      setResult(data);

      const formatMealItems = (items) => {
        if (!items || !Array.isArray(items)) {
          return [];
        }

        return items.map((item, index) => ({
          id: item.id || `${Date.now()}-${index}`,
          title: item.title || item.name || "",
          description: item.description || "",
          image: item.image || "",
          price: item.cost ? item.cost.toFixed(2) : "0.00",
          portion: "",
          weight: item.grams ? item.grams.toFixed(0) : null,
          calories: item.calories ? item.calories.toFixed(0) : "0",
          protein: item.protein ? item.protein.toFixed(0) : "0",
          fat: item.fat ? item.fat.toFixed(0) : "0",
          carbs: item.carbs ? item.carbs.toFixed(0) : "0",
          grams: item.grams || item.weight || 0,
          ingredients: item.ingredients || [],
        }));
      };

      const formattedDays = data.days.map((day) => ({
        day_number: day.day_number,
        meals: {
          breakfast: formatMealItems(day.meals?.breakfast?.items),
          lunch: formatMealItems(day.meals?.lunch?.items),
          dinner: formatMealItems(day.meals?.dinner?.items),
        },
        statistics: day.statistics,
      }));

      const formattedData = {
        days: formattedDays,
      };

      if (onGenerate) onGenerate(formattedData);
    } catch (err) {
      console.error("Calculate error:", err);
      alert("Помилка сервера. Спробуйте пізніше.");
    } finally {
      setIsLoading(false);
    }
  }, [macros, allProducts, validate, onGenerate, daysCount]);

  const handleSavePlan = async () => {
    const actualData = currentMenuData || result;
    if (!actualData || !actualData.days) return;

    setIsSaving(true);
    try {
      await api.post("plans/", {
        plan_data: actualData,
      });
      navigate("/my-plan");
    } catch (error) {
      console.error("Помилка при збереженні плану:", error);
      alert("Не вдалося зберегти раціон. Спробуйте ще раз.");
    } finally {
      setIsSaving(false);
    }
  };

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

        <div className={styles.daysWrapper}>
          <span className={styles.daysLabel}>Тривалість раціону:</span>

          <div className={styles.customDropdown}>
            <div
              className={`${styles.dropdownHeader} ${isDropdownOpen ? styles.dropdownHeaderActive : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {dayOptions.find((opt) => opt.value === daysCount)?.label ||
                "1 день"}
              <span
                className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.dropdownArrowOpen : ""}`}
              ></span>
            </div>

            {isDropdownOpen && (
              <ul className={styles.dropdownList}>
                {dayOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`${styles.dropdownOption} ${daysCount === option.value ? styles.activeOption : ""}`}
                    onClick={() => {
                      setDaysCount(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
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

      <div className={styles.actionsContainer}>
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

        {(currentMenuData || result) && (
          <div onClick={handleSavePlan}>
            <Button
              variant="primary"
              disabled={isSaving}
              iconBefore={<SaveIcon className={styles.saveIcon} />}
            >
              {isSaving ? "Збереження..." : "Зберегти раціон"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalculatorForm;
