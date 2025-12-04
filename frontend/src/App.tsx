import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';

import Sidebar from './components/common/Sidebar';

import Login from './pages/Login';
import Register from './pages/Register';
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

// Componente PrivateRoute
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { signed } = useAuth();
  
  if (!signed) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Lembrar de envolver rotas privadas com <PrivateRoute>
function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/ocorrencias"
        element={
          <PrivateRoute>
            <MainLayout>
              <Ocorrencias />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ambulancias"
        element={
          <PrivateRoute>
            <MainLayout>
              <Ambulancias />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profissionais"
        element={
          <PrivateRoute>
            <MainLayout>
              <Profissionais />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/bases"
        element={
          <PrivateRoute>
            <MainLayout>
              <Bases />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/despacho"
        element={
          <PrivateRoute>
            <MainLayout>
              <Despacho />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <MainLayout>
              <Relatorios />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
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
