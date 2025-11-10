import React from "react";
import styles from "./Features.module.css";

import FeatureCard from "../FeatureCard/FeatureCard";

import { ReactComponent as DbIcon } from "../../assets/db-icon.svg";
import { ReactComponent as ListIcon } from "../../assets/list-icon.svg";
import { ReactComponent as CalcIcon } from "../../assets/calc-icon.svg";

function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.header}>
        <h2>Можливості NutriPlan</h2>
        <p>
          Інструменти, які допоможуть вам контролювати харчування, аналізувати
          нутрієнти та знижувати витрати.
        </p>
      </div>

      <div className={styles.cardList}>
        <FeatureCard
          IconComponent={DbIcon}
          title="База продуктів"
          description="Переглядайте список продуктів з повними даними про білки, жири, вуглеводи, калорійність і вартість."
          to="/dishes"
        />
        <FeatureCard
          IconComponent={ListIcon}
          title="Каталог страв"
          description="Обирайте готові страви або створюйте власні комбінації продуктів для швидкого планування харчування."
          to="/dishes"
        />
        <FeatureCard
          IconComponent={CalcIcon}
          title="Оптимізація раціону"
          description="Автоматично розраховуйте найвигідніший набір продуктів, щоб задовільнити калорійні потреби з мінімальною ціною."
          to="/calculator"
        />
      </div>
    </section>
  );
}

export default Features;
