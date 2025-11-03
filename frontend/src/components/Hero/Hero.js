import React from "react";
import styles from "./Hero.module.css";
import Button from "../Button/Button";

import heroImage from "../../assets/hero-image.png";
import { ReactComponent as ArrowIcon } from "../../assets/arrow-right.svg";
import { ReactComponent as ChevronIcon } from "../../assets/chevron-right.svg";

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Оптимізуйте свій раціон з NutriPlan</h1>
        <p>
          Веб-застосунок допоможе сформувати економний і збалансований добовий
          раціон, який відповідатиме вашим калорійним обмеженням і харчовим
          вподобанням.
        </p>

        <div className={styles.buttonRow}>
          <Button variant="primary" iconAfter={<ArrowIcon />}>
            Сформувати раціон
          </Button>
          <Button variant="secondary" iconAfter={<ChevronIcon />}>
            Дивитися Демо
          </Button>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <img src={heroImage} alt="Здорова їжа" />
      </div>
    </section>
  );
}

export default Hero;
