// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation, ValidationRules } from '../hooks/useFormValidation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logo from '../assets/logo-ss.svg';
import './AuthPages.css';

/**
 * Tela de login do sistema.
 * Realiza autenticação de usuários via JWT.
 * [RF08] Autenticação e Controle de Acesso.
 */
const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { errors, validateForm, clearAllErrors, hasError } = useFormValidation();

  const validationRules: ValidationRules = {
    username: { type: 'username', minLength: 3 },
    password: { type: 'password', minLength: 6 },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Processa o login do usuário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    clearAllErrors();
    setStatusMessage(null);

    // Valida todos os campos
    if (!validateForm(formData, validationRules)) {
      return;
    }

    setCarregando(true);

    try {
      const result = await signIn(formData.username, formData.password);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: 'Login realizado com sucesso! Redirecionando...',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message || 'Erro ao fazer login',
        });
      }
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao conectar com o servidor',
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="Vitalis Tech" />
        </div>

        <div className="login-header">
          <h1>Login</h1>
          <p>Para continuar, insira seus dados</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {statusMessage && (
            <div className={`form-alert form-alert-${statusMessage.type}`}>
              {statusMessage.type === 'success' ? '✓' : '✕'} {statusMessage.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="login">Usuário</label>
            <input
              id="login"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu usuário"
              disabled={carregando}
              autoFocus
              className={hasError('username') ? 'input-error' : ''}
            />
            {hasError('username') && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              disabled={carregando}
              className={hasError('password') ? 'input-error' : ''}
            />
            {hasError('password') && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? <LoadingSpinner size="small" message="" /> : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Ainda não tem conta? <Link to="/register">Faça o cadastro aqui</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
