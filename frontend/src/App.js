import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api";
import "./App.css";

import MainLayout from "./components/MainLayout/MainLayout";
import SidebarLayout from "./components/SidebarLayout/SidebarLayout";
import HomePage from "./pages/HomePage/HomePage";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";
import DishesPage from "./pages/DishesPage/DishesPage";
import FridgePage from "./pages/FridgePage/FridgePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("JWT error:", error);
    return true;
  }
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem("user_info");
        const token = localStorage.getItem("nutri_token");

        if (token && isTokenExpired(token)) {
          localStorage.clear();
          setUser(null);
          return;
        }

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        localStorage.clear();
      }
    };

    checkAuthStatus();

    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener("auth-expired", handleForceLogout);

    return () => {
      window.removeEventListener("auth-expired", handleForceLogout);
    };
  }, []);

  const handleLogin = async (googleData) => {
    try {
      const googleUser = googleData.userProfile || googleData;
      const res = await api.post("auth/google/", {
        access_token: googleData.access_token,
      });

      const backendToken = res.data.access || res.data.key;
      localStorage.setItem("nutri_token", backendToken);

      if (res.data.refresh) {
        localStorage.setItem("nutri_refresh_token", res.data.refresh);
      }

      const finalUser = {
        ...res.data.user,
        name: googleUser.name,
        picture: googleUser.picture,
        email: googleUser.email,
      };

      localStorage.setItem("user_info", JSON.stringify(finalUser));
      setUser(finalUser);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route
          element={
            <SidebarLayout
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/dishes" element={<DishesPage />} />
          <Route path="/fridge" element={<FridgePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
