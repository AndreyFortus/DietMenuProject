import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Mission from "./components/Mission/Mission";

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        <Hero />
        <Mission />
      </main>
    </div>
  );
}

export default App;
