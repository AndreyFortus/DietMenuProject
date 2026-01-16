import React from "react";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

import { ReactComponent as LogoIcon } from "../../assets/logo-icon.svg";
import { ReactComponent as RationIcon } from "../../assets/ration-icon.svg";
import { ReactComponent as DishesIcon } from "../../assets/dishes-icon.svg";
import { ReactComponent as ThemeIcon } from "../../assets/theme-icon.svg";

function Sidebar({ isOpen, onToggle }) {
  const sidebarClass = isOpen
    ? styles.sidebar
    : `${styles.sidebar} ${styles.closed}`;

  return (
    <aside className={sidebarClass}>
      <div className={styles.topSection}>
        <div className={styles.upBar}>
          <a href="/" className={styles.logo}>
            <LogoIcon />
            <span>NutriPlan</span>
          </a>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/calculator"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <RationIcon />
            <span>Раціон</span>
          </NavLink>

          <NavLink
            to="/dishes"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <DishesIcon />
            <span>Страви</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <button onClick={onToggle} className={styles.toggleButton}>
          <ThemeIcon />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
