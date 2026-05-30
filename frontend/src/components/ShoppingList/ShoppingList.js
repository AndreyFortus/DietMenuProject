import React from "react";
import styles from "./ShoppingList.module.css";

function ShoppingList({ list }) {
  if (!list) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Ваш список покупок:</h3>

      {list.length === 0 ? (
        <div className={styles.emptyState}>
          Чудово! У вас вдома є всі необхідні продукти для цього меню.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Продукт</th>
              <th>Потрібно</th>
              <th>Є вдома</th>
              <th className={styles.buyHeader}>Купити</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => {
              const isFulfilled = item.toBuy === 0;

              return (
                <tr
                  key={idx}
                  className={isFulfilled ? styles.fulfilledRow : ""}
                >
                  <td className={styles.productName}>{item.name}</td>
                  <td>{item.needed} г</td>
                  <td className={styles.haveAmount}>{item.have} г</td>
                  <td
                    className={
                      isFulfilled ? styles.buyAmountZero : styles.buyAmount
                    }
                  >
                    {item.toBuy} г
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ShoppingList;
