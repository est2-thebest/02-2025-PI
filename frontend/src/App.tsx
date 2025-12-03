import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';

import Sidebar from './components/common/Sidebar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ocorrencias from './pages/Ocorrencias';
import Ambulancias from './pages/Ambulancias';
import Profissionais from './pages/Profissionais';
import Bases from './pages/Bases';
import Relatorios from './pages/Relatorios';
import Despacho from './pages/Despacho';

import './App.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

// Layout principal com Header e Sidebar
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div
      className={`app-container ${
        sidebarOpen ? 'sidebar-open' : 'sidebar-closed'
      }`}
    >
      <Sidebar onToggle={setSidebarOpen} />

      <main className="main-content">{children}</main>
    </div>
  );
};

// Lembrar de envolver rotas privadas com <PrivateRoute>
function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/ocorrencias"
        element={
          <MainLayout>
            <Ocorrencias />
          </MainLayout>
        }
      />

      <Route
        path="/ambulancias"
        element={
          <MainLayout>
            <Ambulancias />
          </MainLayout>
        }
      />

      <Route
        path="/profissionais"
        element={
          <MainLayout>
            <Profissionais />
          </MainLayout>
        }
      />

      <Route
        path="/bases"
        element={
          <MainLayout>
            <Bases />
          </MainLayout>
        }
      />

      <Route
        path="/despacho"
        element={
          <MainLayout>
            <Despacho />
          </MainLayout>
        }
      />

      <Route
        path="/relatorios"
        element={
          <MainLayout>
            <Relatorios />
          </MainLayout>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
