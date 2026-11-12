import React from 'react';

// Um componente igual ao do print para proteger telas futuras contra usuários sem login
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('@Almox:token');

  if (!token) {
    // Caso não possua token, redireciona de volta para a tela inicial/login
    window.location.href = '/';
    return null;
  }

  return children;
}
