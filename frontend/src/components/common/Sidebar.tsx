import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Ambulance,
  Users,
  MapPin,
  BarChart3,
  Radio,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import logo from '../../assets/logo.svg';
import './Sidebar.css';

interface SidebarProps {
  onToggle: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleToggle = (): void => {
    const novoEstado = !isOpen;
    setIsOpen(novoEstado);
    onToggle(novoEstado);
  };

  const handleLogout = (): void => {
    console.log('logout');
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logo} alt="Vitalis Logo" className="sidebar-logo-img" />
        </div>

        <button className="sidebar-toggle" onClick={handleToggle}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-item">
          <LayoutDashboard className="sidebar-icon icon-dashboard" />
          <span className="sidebar-label">Dashboard</span>
        </NavLink>

        <NavLink to="/ocorrencias" className="sidebar-item">
          <FileWarning className="sidebar-icon icon-ocorrencias" />
          <span className="sidebar-label">Ocorrências</span>
        </NavLink>

        <NavLink to="/ambulancias" className="sidebar-item">
          <Ambulance className="sidebar-icon icon-ambulancias" />
          <span className="sidebar-label">Ambulâncias</span>
        </NavLink>

        <NavLink to="/profissionais" className="sidebar-item">
          <Users className="sidebar-icon icon-profissionais" />
          <span className="sidebar-label">Profissionais</span>
        </NavLink>

        <NavLink to="/bases" className="sidebar-item">
          <MapPin className="sidebar-icon icon-bases" />
          <span className="sidebar-label">Bases</span>
        </NavLink>

        <NavLink to="/despacho" className="sidebar-item">
          <Radio className="sidebar-icon icon-despacho" />
          <span className="sidebar-label">Despacho</span>
        </NavLink>

        <NavLink to="/relatorios" className="sidebar-item">
          <BarChart3 className="sidebar-icon icon-relatorios" />
          <span className="sidebar-label">Relatórios</span>
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut className="sidebar-icon icon-logout" />
        <span className="sidebar-label">Sair</span>
      </button>
    </aside>
  );
};

export default Sidebar;
