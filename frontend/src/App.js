import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Mission from "./components/Mission/Mission";
import Features from "./components/Features/Features";
import WhySection from "./components/WhySection/WhySection";
import ContactSection from "./components/ContactSection/ContactSection";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header />

      <main>
        <Hero />
        <Mission />
        <Features />
        <WhySection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
