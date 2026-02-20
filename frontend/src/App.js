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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user_info");
      const token = localStorage.getItem("nutri_token");

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.clear();
    }
  }, []);

  const handleLogin = async (googleData) => {
    try {
      const googleUser = googleData.userProfile || googleData;
      const res = await api.post("auth/google/", {
        access_token: googleData.access_token,
      });

      const backendToken = res.data.access || res.data.key;
      localStorage.setItem("nutri_token", backendToken);

      const finalUser = {
        ...res.data.user,
        name: googleUser.name,
        picture: googleUser.picture,
        email: googleUser.email,
      };

      localStorage.setItem("user_info", JSON.stringify(finalUser));
      setUser(finalUser);
    } catch (error) {
      console.error("Помилка входу:", error);
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
