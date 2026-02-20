import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./SidebarLayout.module.css";

function SidebarLayout({ user, onLogin, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={styles.page}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <main className={styles.mainContent}>
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default SidebarLayout;
