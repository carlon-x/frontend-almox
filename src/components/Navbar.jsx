import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    // Limpa o crachá/token do navegador e volta para o Login
    localStorage.removeItem('@Almox:token');
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">⚡ SPSL - Almoxarifado</div>
      <div className="navbar-menu">
        <button onClick={() => navigate('/produtos')} className="nav-link">Estoque</button>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </div>
    </nav>
  );
}
