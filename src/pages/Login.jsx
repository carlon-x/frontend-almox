import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTAÇÃO ADICIONADA NO TOPO
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate(); // 2. HOOK INSTANCIADO DENTRO DO COMPONENTE
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/login', { email, senha });
      const { token } = response.data;

      localStorage.setItem('@Almox:token', token);
      
      // 3. REDIRECIONAMENTO AUTOMÁTICO APÓS LOGIN BEM-SUCEDIDO
      navigate('/produtos'); 

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      if (error.response && error.response.data) {
        setErro(error.response.data.error || error.response.data.message || 'Erro ao autenticar.');
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-container">
      <div className="auth-card">
        <h2 className="form-title">Almoxarifado - Login</h2>
        
        {erro && <div className="alert-danger">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">E-mail:</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="exemplo@subestacao.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha:</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
