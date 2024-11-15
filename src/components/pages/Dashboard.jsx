import { Outlet } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import Navegacion from "../layouts/Navegacion";
import style from '../styles/dashboard.module.css';
import { useState } from "react";

const Dashboard = () => {
  const [abrirMenu, setAbrirMenu] = useState(false);

  const toggleSidebar = () => {
    setAbrirMenu(!abrirMenu);
  };

  return (
    <main>
      <Navegacion toggleSidebar={toggleSidebar} />
      <section className={style.panelControl}>
        <Sidebar isOpen={abrirMenu} />
        <section>
          <Outlet />
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
