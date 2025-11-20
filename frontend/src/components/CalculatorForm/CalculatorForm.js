import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "./CalculatorForm.module.css";
import Button from "../Button/Button";
import NutrientInput from "../NutrientInput/NutrientInput";

import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { ReactComponent as SparkleIcon } from "../../assets/sparkle-icon.svg";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up.svg";

const PRODUCTS_API_URL = "http://127.0.0.1:8000/api/products/";
const CALCULATE_API_URL =
  "https://a11181f3-741e-47c2-affd-e0db7eeb352c.mock.pstmn.io/api/calculate-ration";

const MIN_VALUES = {
  protein: 40,
  fat: 30,
  carbs: 50,
};

function CalculatorForm({ onGenerate }) {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [macros, setMacros] = useState({
    protein: "",
    fat: "",
    carbs: "",
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
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setAllProducts((prev) => prev.map((p) => ({ ...p, checked: false })));
  }, []);

  const handleMacroChange = useCallback(
    (field, value) => {
      setMacros((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = {};
    if (!macros.protein || Number(macros.protein) < MIN_VALUES.protein) {
      newErrors.protein = `Мін. ${MIN_VALUES.protein}г`;
    }
    if (!macros.fat || Number(macros.fat) < MIN_VALUES.fat) {
      newErrors.fat = `Мін. ${MIN_VALUES.fat}г`;
    }
    if (!macros.carbs || Number(macros.carbs) < MIN_VALUES.carbs) {
      newErrors.carbs = `Мін. ${MIN_VALUES.carbs}г`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [macros]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    const selectedProducts = allProducts.filter((p) => p.checked);

    const requestData = {
      target_macros: {
        protein: Number(macros.protein),
        fat: Number(macros.fat),
        carbs: Number(macros.carbs),
      },
      selected_products: selectedProducts,
    };

    console.log("Sending data to backend:", requestData);

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
      console.log("Received response:", data);
      if (onGenerate) onGenerate(data);
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
    [allProducts]
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
          <p>Введіть денну норму макронутрієнтів</p>
        </div>

        <div className={styles.inputList}>
          <NutrientInput
            label="Білки (г)"
            value={macros.protein}
            onChange={(v) => handleMacroChange("protein", v)}
            error={errors.protein}
          />
          <NutrientInput
            label="Жири (г)"
            value={macros.fat}
            onChange={(v) => handleMacroChange("fat", v)}
            error={errors.fat}
          />
          <NutrientInput
            label="Вуглеводи (г)"
            value={macros.carbs}
            onChange={(v) => handleMacroChange("carbs", v)}
            error={errors.carbs}
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
    </div>
  );
}

export default CalculatorForm;
