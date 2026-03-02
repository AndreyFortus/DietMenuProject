import React from "react";
import Fridge from "../../components/Fridge/Fridge";
import styles from "./FridgePage.module.css";

const FridgePage = () => {
  return (
    <div className={styles.pageContainer}>
      <Fridge />
    </div>
  );
};

export default FridgePage;
