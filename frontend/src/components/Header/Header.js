import React from "react";
import styles from "./Header.module.css";
import Button from "../Button/Button";
import { ReactComponent as LogoIcon } from "../../assets/logo-icon.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus-icon.svg";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <LogoIcon />
          <span>NutriPlan</span>
        </div>

        <nav>
          <Button variant="primary" iconBefore={<PlusIcon />}>
            Сформувати раціон
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
