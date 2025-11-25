import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { useAuth } from './hooks/useAuth';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import LoadingSpinner from './components/common/LoadingSpinner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
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
  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ocorrencias"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Ocorrências</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/ambulancias"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Ambulâncias</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profissionais"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Profissionais</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/bases"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Bases</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/despacho"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Despacho</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <MainLayout>
              <div className="page-container">
                <h1>Relatórios</h1>
                <p>Página em desenvolvimento...</p>
              </div>
            </MainLayout>
          </PrivateRoute>
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
