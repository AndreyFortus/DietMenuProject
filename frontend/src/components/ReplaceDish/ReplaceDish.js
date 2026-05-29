import React, { useState } from "react";
import Button from "../Button/Button";
import styles from "./ReplaceDish.module.css";

const ReplaceDish = ({
  dishId,
  grams,
  mealType,
  onReplaceSuccess,
  otherDishIds = [],
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReplace = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.REACT_APP_API_URL;

      const response = await fetch(`${baseUrl}/replace-dish/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dish_id: dishId,
          grams: grams,
          meal_type: mealType,
          other_dish_ids: otherDishIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Помилка заміни");

      if (onReplaceSuccess) onReplaceSuccess(dishId, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Button variant="primary" onClick={handleReplace} disabled={isLoading}>
        {isLoading ? "Шукаю..." : "Замінити страву"}
      </Button>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default ReplaceDish;
