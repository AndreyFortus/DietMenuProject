import React from "react";
import { useOutletContext } from "react-router-dom";
import Fridge from "../../components/Fridge/Fridge";
import styles from "./FridgePage.module.css";

const FridgePage = () => {
  const { user } = useOutletContext();
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1>Мій холодильник</h1>
        <p className={styles.subtitle}>
          Додай продукти, які в тебе є, і ми складемо з них меню.
        </p>
      </header>
      <Fridge />
    </div>
  );
};

export default FridgePage;
