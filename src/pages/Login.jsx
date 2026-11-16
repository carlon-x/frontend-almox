import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [modoCadastro, setModoCadastro] = useState(searchParams.get('cadastro') === 'true');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      if (modoCadastro) {
        // Envia perfil: 'user' fixo conforme a regra de cadastro público
        await api.post('/usuarios', {
          nome: nome.trim(),
          email: email.trim(),
          perfil: 'user',
          senha,
        });

        setSucesso('Usuário cadastrado com sucesso! Faça login para acessar.');
        setModoCadastro(false);
        setSenha('');
      } else {
        const response = await api.post('/login', { email, senha });
        const { token, perfil: perfilRetornado } = response.data;

        if (!token) {
          throw new Error('Token de autenticação não recebido.');
        }

        const tokenLimpo = token.replace(/^Bearer\s+/i, '');

        localStorage.setItem('@Almox:token', tokenLimpo);
        localStorage.setItem('@Almox:usuario', email);
        if (perfilRetornado) {
          localStorage.setItem('@Almox:perfil', perfilRetornado);
        }

        navigate('/produtos', { replace: true });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      if (error.response && error.response.data) {
        setErro(
          error.response.data.message ||
          error.response.data.error ||
          'Erro ao processar solicitação.'
        );
      } else {
        setErro(error.message || 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-container">
      <div className="auth-card">
        <h2 className="form-title">
          {modoCadastro ? 'Almoxarifado - Cadastro' : 'Almoxarifado - Login'}
        </h2>

        {erro && <div className="alert-danger">{erro}</div>}
        {sucesso && <div className="alert-success">{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          {modoCadastro && (
            <div className="form-group">
              <label className="form-label">Nome completo:</label>
              <input
                type="text"
                className="form-input"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail:</label>
            <input
              type="email"
              className="form-input"
              placeholder="exemplo@celesc.com.br"
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
            {carregando ? 'Processando...' : modoCadastro ? 'Cadastrar Usuário' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setModoCadastro(!modoCadastro);
              setErro('');
              setSucesso('');
            }}
          >
            {modoCadastro ? 'Já possui conta? Faça login' : 'Não tem conta? Cadastre-se aqui'}
          </button>
          <br />
          <Link to="/" style={{ fontSize: '0.9rem', display: 'inline-block', marginTop: '8px' }}>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
