import React from "react";
import styles from "./Header.module.css";
import Button from "../Button/Button";
import { ReactComponent as LogoIcon } from "../../assets/logo-icon.svg";
import { ReactComponent as SparkleIcon } from "../../assets/sparkle-icon.svg";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <LogoIcon />
          <span>NutriPlan</span>
        </div>

        <nav>
          <Link to="/calculator" className={styles.navLink}>
            <Button variant="primary" iconBefore={<SparkleIcon />}>
              Сформувати раціон
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
