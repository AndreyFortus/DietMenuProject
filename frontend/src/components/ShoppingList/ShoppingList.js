import React from "react";
import styles from "./ShoppingList.module.css";

function ShoppingList({ list, onClose }) {
  if (!list) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Ваш список покупок:</h3>

      {list.length === 0 ? (
        <div className={styles.emptyState}>
          🎉 Чудово! У вас вдома є всі необхідні продукти.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Продукт</th>
              <th>Треба всього</th>
              <th>Є вдома</th>
              <th style={{ color: "#ef4444" }}>Купити</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr key={idx}>
                <td className={styles.productName}>{item.name}</td>
                <td>{item.needed} г</td>
                <td className={styles.haveAmount}>{item.have} г</td>
                <td className={styles.buyAmount}>{item.toBuy} г</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.closeButtonContainer}>
        <button onClick={onClose} className={styles.closeButton}>
          Приховати список
        </button>
      </div>
    </div>
  );
}

export default ShoppingList;
