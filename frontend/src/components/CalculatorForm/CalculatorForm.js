import React, { useState } from "react";
import styles from "./CalculatorForm.module.css";
import Button from "../Button/Button";
import NutrientInput from "../NutrientInput/NutrientInput";

import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { ReactComponent as SparkleIcon } from "../../assets/sparkle-icon.svg";
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up.svg";

const MOCK_PRODUCTS = {
  column1: [
    { id: "p1", name: "Куряче філе", checked: true },
    { id: "p2", name: "Яловичина", checked: true },
    { id: "p3", name: "Свинина", checked: false },
    { id: "p4", name: "Рис", checked: true },
    { id: "p5", name: "Гречка", checked: false },
    { id: "p6", name: "Вівсянка", checked: false },
    { id: "p7", name: "Помідори", checked: false },
    { id: "p8", name: "Огірки", checked: false },
  ],
  column2: [
    { id: "p9", name: "Яблуко", checked: true },
    { id: "p10", name: "Чай", checked: true },
    { id: "p11", name: "Кава", checked: false },
    { id: "p12", name: "Сир коров'ячий", checked: true },
    { id: "p13", name: "Макарони", checked: false },
    { id: "p14", name: "Яйця", checked: false },
    { id: "p15", name: "Сало", checked: false },
    { id: "p16", name: "Майонез", checked: false },
  ],
  column3: [
    { id: "p17", name: "Борщ", checked: true },
    { id: "p18", name: "Картопля смажена", checked: true },
    { id: "p19", name: "Запечений лосось", checked: false },
    { id: "p20", name: "Курка з овочами", checked: true },
    { id: "p21", name: "Суп з фрикадельками", checked: false },
  ],
};

const MIN_VALUES = {
  protein: 40,
  fat: 35,
  carbs: 50,
};

function CalculatorForm({ onGenerate }) {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const [macros, setMacros] = useState({
    protein: "",
    fat: "",
    carbs: "",
  });

  const [errors, setErrors] = useState({});

  const handleClearAll = () => {
    const clearedProducts = {
      column1: products.column1.map((p) => ({ ...p, checked: false })),
      column2: products.column2.map((p) => ({ ...p, checked: false })),
      column3: products.column3.map((p) => ({ ...p, checked: false })),
    };
    setProducts(clearedProducts);
  };

  const handleCheckboxChange = (columnName, productId) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      [columnName]: prevProducts[columnName].map((product) =>
        product.id === productId
          ? { ...product, checked: !product.checked }
          : product
      ),
    }));
  };

  const handleMacroChange = (field, value) => {
    setMacros((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!macros.protein || Number(macros.protein) < MIN_VALUES.protein) {
      newErrors.protein = `Мін. ${MIN_VALUES.protein}г (безпечна норма)`;
    }
    if (!macros.fat || Number(macros.fat) < MIN_VALUES.fat) {
      newErrors.fat = `Мін. ${MIN_VALUES.fat}г (безпечна норма)`;
    }
    if (!macros.carbs || Number(macros.carbs) < MIN_VALUES.carbs) {
      newErrors.carbs = `Мін. ${MIN_VALUES.carbs}г (безпечна норма)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const selectedProducts = [
      ...products.column1,
      ...products.column2,
      ...products.column3,
    ]
      .filter((p) => p.checked)
      .map((p) => p.name);

    const requestData = {
      target_macros: {
        protein: Number(macros.protein),
        fat: Number(macros.fat),
        carbs: Number(macros.carbs),
      },
      selected_products: selectedProducts,
    };

    console.log("🚀 Sending data to backend:", requestData);

    // Test
    const API_URL =
      "https://a11181f3-741e-47c2-affd-e0db7eeb352c.mock.pstmn.io/api/calculate-ration";

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success from API:", data);

        if (onGenerate) {
          onGenerate(data);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const contentClassName = isProductsOpen
    ? styles.productsContent
    : `${styles.productsContent} ${styles.productsContentClosed}`;

  return (
    <div className={styles.calculatorForm}>
      {/* 1. СЕКЦІЯ "ВАШІ ПАРАМЕТРИ" */}
      <div className={styles.parameterSection}>
        <div className={styles.textBlock}>
          <h3>Ваші параметри</h3>
          <p>Введіть денну норму макронутрієнтів</p>
        </div>

        <div className={styles.inputList}>
          <NutrientInput
            label="Білки (г)"
            value={macros.protein}
            onChange={(val) => handleMacroChange("protein", val)}
            error={errors.protein}
          />
          <NutrientInput
            label="Жири (г)"
            value={macros.fat}
            onChange={(val) => handleMacroChange("fat", val)}
            error={errors.fat}
          />
          <NutrientInput
            label="Вуглеводи (г)"
            value={macros.carbs}
            onChange={(val) => handleMacroChange("carbs", val)}
            error={errors.carbs}
          />
        </div>
      </div>

      {/* 2. СЕКЦІЯ "ВИБІР ПРОДУКТІВ" */}
      <div className={styles.productSectionWrapper}>
        <div className={styles.productSection}>
          <div className={styles.productHeader}>
            <div className={styles.textBlock}>
              <h3>Вибір продуктів та страв</h3>
              <p>Оберіть продукти або страви для формування раціону</p>
            </div>

            <button
              className={styles.chevronUpButton}
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <ChevronUpIcon
                className={!isProductsOpen ? styles.chevronUpButtonRotated : ""}
              />
            </button>
          </div>

          <div className={contentClassName}>
            <div className={styles.productsContentInner}>
              {/* Панель пошуку */}
              <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper}>
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Пошук страв та продуктів..."
                  />
                </div>
              </div>

              {/* Лічильник обраного */}
              <span className={styles.selectedCount}>Обрано: N страв</span>

              {/* Список продуктів */}
              <div className={styles.productList}>
                <div className={styles.productColumn}>
                  {products.column1.map((product) => (
                    <label key={product.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={product.checked}
                        onChange={() =>
                          handleCheckboxChange("column1", product.id)
                        }
                      />
                      <span className={styles.customCheckbox}></span>
                      {product.name}
                    </label>
                  ))}
                </div>
                <div className={styles.productColumn}>
                  {products.column2.map((product) => (
                    <label key={product.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={product.checked}
                        onChange={() =>
                          handleCheckboxChange("column2", product.id)
                        }
                      />
                      <span className={styles.customCheckbox}></span>
                      {product.name}
                    </label>
                  ))}
                </div>
                <div className={styles.productColumn}>
                  {products.column3.map((product) => (
                    <label key={product.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={product.checked}
                        onChange={() =>
                          handleCheckboxChange("column3", product.id)
                        }
                      />
                      <span className={styles.customCheckbox}></span>
                      {product.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Кнопка "Скинути" */}
              <button className={styles.clearButton} onClick={handleClearAll}>
                Скинути всі обрані страви
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <div onClick={handleSubmit}>
          <Button variant="primary" iconBefore={<SparkleIcon />}>
            Згенерувати раціон
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CalculatorForm;
