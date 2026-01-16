import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./SidebarLayout.module.css";

function SidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const mainClass = isSidebarOpen
    ? styles.mainContent
    : `${styles.mainContent} ${styles.mainContentExpanded}`;

  return (
    <div className={styles.page}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className={mainClass}>
        <Outlet />
      </main>
    </div>
  );
}

export default SidebarLayout;
