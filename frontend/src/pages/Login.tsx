// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import logo from '../assets/logo-short.svg';
import './Login.css';

const Login: React.FC = () => {
  const [login, setLogin] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErro('');
    
    if (!login || !senha) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    setCarregando(true);

    try {
      const result = await signIn(login, senha);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErro(result.message || 'Erro ao fazer login');
      }
    } catch {
      setErro('Erro ao conectar com o servidor');
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
          <div className="form-group">
            <label htmlFor="login">Usuário</label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={carregando}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              disabled={carregando}
            />
          </div>

          {erro && (
            <div className="alert alert-error">
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={carregando}
          >
            {carregando ? <LoadingSpinner size="small" message="" /> : 'Entrar'}
            {/* {carregando ? 'Entrando...' : 'Entrar'} */}
          </button>
        </form>

        <div className="login-footer">
          <p>Vitalis Tech © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
