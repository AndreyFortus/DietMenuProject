import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import Button from "../../components/Button/Button";

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>

      <h2 className={styles.title}>Упс! Сторінку не знайдено</h2>
      <p className={styles.description}>
        Здається, ви зайшли туди, де немає їжі. Можливо, сторінка була видалена
        або адреса введена неправильно.
      </p>

      <Link to="/" className={styles.link}>
        <Button variant="primary">Повернутися на головну</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
