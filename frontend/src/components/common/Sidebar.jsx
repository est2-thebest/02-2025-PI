import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Ambulance,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import logo from '../../assets/logo.png'; // <- IMPORTAÇÃO DA LOGO
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  const handleLogout = () => {
    console.log('logout');
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* TOPO DA SIDEBAR */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logo} alt="Vitalis Logo" className="sidebar-logo-img" />
        </div>

        <button className="sidebar-toggle" onClick={handleToggle}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-item">
          <LayoutDashboard className="sidebar-icon" />
          <span className="sidebar-label">Dashboard</span>
        </NavLink>

        <NavLink to="/ocorrencias" className="sidebar-item">
          <FileWarning className="sidebar-icon" />
          <span className="sidebar-label">Ocorrências</span>
        </NavLink>

        <NavLink to="/ambulancias" className="sidebar-item">
          <Ambulance className="sidebar-icon" />
          <span className="sidebar-label">Ambulâncias</span>
        </NavLink>

        <NavLink to="/profissionais" className="sidebar-item">
          <Users className="sidebar-icon" />
          <span className="sidebar-label">Profissionais</span>
        </NavLink>
      </nav>

      {/* BOTÃO SAIR */}
      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut className="sidebar-icon" />
        <span className="sidebar-label">Sair</span>
      </button>
    </aside>
  );
};

export default Sidebar;
