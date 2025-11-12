import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import MainLayout from "./components/MainLayout/MainLayout";

import HomePage from "./pages/HomePage/HomePage";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";
import DishesPage from "./pages/DishesPage/DishesPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/dishes" element={<DishesPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
