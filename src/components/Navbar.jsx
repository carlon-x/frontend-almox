import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({
  onNovoItem,
  onNovoLocal,
  onNovoUsuario,
  termoBusca,
  setTermoBusca,
}) {
  const navigate = useNavigate();

  function verificarSeEhAdmin() {
    const perfilSalvo = localStorage.getItem('@Almox:perfil');
    if (perfilSalvo) return perfilSalvo === 'admin';

    const token = localStorage.getItem('@Almox:token');
    if (!token) return false;
    try {
      const tokenLimpo = token.replace(/^Bearer\s+/i, '');
      const payload = JSON.parse(atob(tokenLimpo.split('.')[1]));
      return payload.perfil === 'admin';
    } catch {
      return false;
    }
  }

  const isAdmin = verificarSeEhAdmin();


  // Recupera o usuário salvo no login ou tenta extrair do token JWT
  function obterUsuarioLogado() {
    const salvo = localStorage.getItem('@Almox:usuario');
    if (salvo) return salvo;

    const token = localStorage.getItem('@Almox:token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.nome || payload.email || 'Usuário';
      } catch {
        return 'Usuário';
      }
    }
    return '';
  }

  const usuarioLogado = obterUsuarioLogado();

  function handleLogout() {
    localStorage.removeItem('@Almox:token');
    localStorage.removeItem('@Almox:usuario');
    navigate('/login', { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src="/CELESC_Logo.png" alt="Logo Celesc" className="navbar-logo" />
        <span>SPSL - Almoxarifado</span>
      </div>

      {usuarioLogado && (
        <span className="navbar-user" title="Usuário autenticado">
          👤 {usuarioLogado}
        </span>
      )}


      <nav className="navbar-actions">
        {setTermoBusca && (
          <input
            type="text"
            className="navbar-search"
            placeholder="🔍 Pesquisar item, local ou usuário..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        )}

        {onNovoItem && (
          <button type="button" className="btn-nav-new" onClick={onNovoItem}>
            + Novo Item
          </button>
        )}

        {onNovoLocal && (
          <button type="button" className="btn-nav" onClick={onNovoLocal}>
            + Local
          </button>
        )}

        {isAdmin && onNovoUsuario && (
          <button type="button" className="btn-nav" onClick={onNovoUsuario}>
            + Usuário
          </button>
        )}


        <button type="button" className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
}
