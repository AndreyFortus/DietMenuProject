import React from "react";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./Sidebar.module.css";

import { ReactComponent as LogoIcon } from "../../assets/logo-icon.svg";
import { ReactComponent as RationIcon } from "../../assets/ration-icon.svg";
import { ReactComponent as DishesIcon } from "../../assets/dishes-icon.svg";
import { ReactComponent as ThemeIcon } from "../../assets/theme-icon.svg";
import { ReactComponent as FridgeIcon } from "../../assets/fridge-icon.svg";
import { ReactComponent as GoogleIcon } from "../../assets/google-logo.svg";

const NAV_ITEMS = [
  { to: "/calculator", icon: <RationIcon />, label: "Раціон" },
  { to: "/dishes", icon: <DishesIcon />, label: "Страви" },
  { to: "/fridge", icon: <FridgeIcon />, label: "Холодильник" },
];

function Sidebar({ isOpen, onToggle, user, onLogin, onLogout }) {
  const login = useGoogleLogin({
    scope: "email profile openid",
    onSuccess: async (token) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          },
        ).then((res) => res.json());

        onLogin({ access_token: token.access_token, ...userInfo });
      } catch (error) {
        console.error("Login Error:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const sidebarClass = `${styles.sidebar} ${!isOpen ? styles.closed : ""}`;

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
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? styles.activeLink : styles.navLink
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
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
                    alt="Profile Picture"
                    className={styles.avatar}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {user.name?.[0].toUpperCase() || "U"}
                  </div>
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
              className={styles.gsiMaterialButton}
              title="Увійти через Google"
            >
              <div className={styles.gsiMaterialButtonState} />
              <div className={styles.gsiMaterialButtonContentWrapper}>
                <div className={styles.gsiMaterialButtonIcon}>
                  <GoogleIcon />
                </div>
                <span className={styles.loginText}>Увійти</span>
              </div>
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
