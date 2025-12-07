import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Siren,
  Ambulance,
  Users,
  BarChart3,

  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';

import logo from '../../assets/logo-p.svg';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmDialog } from '../../hooks/useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';
import './Sidebar.css';

interface SidebarProps {
  onToggle: (isOpen: boolean) => void;
}

/**
 * Barra lateral de navegação.
 * Menu principal e controle de tema.
 */
const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();

  const handleToggle = (): void => {
    const novoEstado = !isOpen;
    setIsOpen(novoEstado);
    onToggle(novoEstado);
  };

  const handleLogout = async (): Promise<void> => {
    const confirmed = await confirmDialog.confirm({
      title: 'Sair do Sistema',
      message: 'Tem certeza que deseja sair?',
      // type: 'warning',
      confirmText: 'Sair',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      signOut();
      navigate('/login');
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={confirmDialog.handleConfirm}
        onCancel={confirmDialog.handleCancel}
      />

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
            <Siren className="sidebar-icon icon-ocorrencias" />
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

          <NavLink to="/relatorios" className="sidebar-item">
            <BarChart3 className="sidebar-icon icon-relatorios" />
            <span className="sidebar-label">Relatórios</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-theme-toggle" onClick={toggleTheme} title={`Ativar tema ${theme === 'light' ? 'escuro' : 'claro'}`}>
            {theme === 'light' ? (
              <Moon size={20} className="theme-icon" />
            ) : (
              <Sun size={20} className="theme-icon" />
            )}
            <span className="sidebar-label">
              {theme === 'light' ? 'Escuro' : 'Claro'}
            </span>
          </button>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut className="sidebar-icon icon-logout" />
          <span className="sidebar-label">Sair</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
