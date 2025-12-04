// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormValidation, ValidationRules } from '../hooks/useFormValidation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logo from '../assets/logo-ss.svg';
import './AuthPages.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { errors, validateForm, clearAllErrors, hasError } = useFormValidation();

  const validationRules: ValidationRules = {
    username: { type: 'username', minLength: 3 },
    email: { type: 'email' },
    password: { type: 'password', minLength: 6 },
    confirmPassword: { type: 'confirmPassword', matchField: 'password' },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      const result = await signUp(formData.username, formData.email, formData.password);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: 'Cadastro realizado com sucesso! Redirecionando...',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.message || 'Erro ao realizar cadastro',
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
          <h1>Cadastro</h1>
          <p>Crie sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {statusMessage && (
            <div className={`form-alert form-alert-${statusMessage.type}`}>
              {statusMessage.type === 'success' ? '✓' : '✕'} {statusMessage.text}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuário *</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Digite seu nome de usuário"
              disabled={carregando}
              autoFocus
              className={hasError('username') ? 'input-error' : ''}
            />
            {hasError('username') && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              disabled={carregando}
              className={hasError('email') ? 'input-error' : ''}
            />
            {hasError('email') && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha (mín. 6 caracteres)"
              disabled={carregando}
              className={hasError('password') ? 'input-error' : ''}
            />
            {hasError('password') && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha *</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              disabled={carregando}
              className={hasError('confirmPassword') ? 'input-error' : ''}
            />
            {hasError('confirmPassword') && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? <LoadingSpinner size="small" message="" /> : 'Cadastrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Já tem conta? <Link to="/login">Faça login aqui</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
