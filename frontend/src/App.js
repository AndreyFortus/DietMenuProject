import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Mission from "./components/Mission/Mission";
import Features from "./components/Features/Features";

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        <Hero />
        <Mission />
        <Features />
      </main>
    </div>
  );
}

export default App;
