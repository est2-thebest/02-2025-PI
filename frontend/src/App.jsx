import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/Auth';
import { useAuth } from './hooks/useAuth';

import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ocorrencias from './pages/Ocorrencias';
import Ambulancias from './pages/Ambulancias';
import Profissionais from './pages/Profissionais';
import Bases from './pages/Bases';
import Relatorios from './pages/Relatorios';
import Despacho from './pages/Despacho';

import './App.css';

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Verificando autenticação..." />
      </div>
    );
  }

  return signed ? children : <Navigate to="/login" />;
};

// Layout principal com Header e Sidebar
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
          <MainLayout>
            <Ocorrencias />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/ambulancias"
        element={
          <MainLayout>
            <Ambulancias />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/profissionais"
        element={
          <MainLayout>
            <Profissionais />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/bases"
        element={
          <MainLayout>
            <Bases />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/despacho"
        element={
          <MainLayout>
            <Despacho />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <MainLayout>
            <Relatorios />
          </MainLayout>
          // <PrivateRoute>
          // </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
