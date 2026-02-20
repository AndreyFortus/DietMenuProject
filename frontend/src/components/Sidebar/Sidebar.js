import React from "react";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./Sidebar.module.css";

import { ReactComponent as LogoIcon } from "../../assets/logo-icon.svg";
import { ReactComponent as RationIcon } from "../../assets/ration-icon.svg";
import { ReactComponent as DishesIcon } from "../../assets/dishes-icon.svg";
import { ReactComponent as ThemeIcon } from "../../assets/theme-icon.svg";
import { ReactComponent as FridgeIcon } from "../../assets/fridge-icon.svg";

function Sidebar({ isOpen, onToggle, user, onLogin, onLogout }) {
  const login = useGoogleLogin({
    scope: "email profile openid",
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        ).then((res) => res.json());

        const loginData = {
          access_token: tokenResponse.access_token,
          ...userInfo,
        };
        onLogin(loginData);
      } catch (error) {
        console.error("Login Error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const sidebarClass = isOpen
    ? styles.sidebar
    : `${styles.sidebar} ${styles.closed}`;

  const getInitial = () => {
    if (user?.name) return user.name[0].toUpperCase();
    return "U";
  };

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

          <NavLink
            to="/fridge"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <FridgeIcon />
            <span>Холодильник</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.userBlock}>
          {user ? (
            <div className={styles.loggedInState}>
              <div className={styles.avatarWrapper}>
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="Ava"
                    className={styles.avatar}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>{getInitial()}</div>
                )}
              </div>

              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>

              <button
                onClick={onLogout}
                className={styles.logoutBtn}
                title="Вийти"
              >
                x
              </button>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className={styles.loginBtn}
              title="Увійти через Google"
            >
              <span className={styles.googleIcon}>G</span>
              <span className={styles.loginText}>Увійти</span>
            </button>
          )}
        </div>

        <button onClick={onToggle} className={styles.toggleButton}>
          <ThemeIcon />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
