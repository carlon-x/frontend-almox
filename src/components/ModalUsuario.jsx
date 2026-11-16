import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ModalUsuario({ isOpen, onClose, modo, usuarioItem, onSucesso }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('user');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setErro('');

    if (usuarioItem && (modo === 'editar' || modo === 'detalhes')) {
      setNome(usuarioItem.nome || '');
      setEmail(usuarioItem.email || '');
      setPerfil(usuarioItem.perfil || 'user');
      setSenha(''); // Senha fica em branco na edição (preenche apenas se quiser trocar)
    } else {
      setNome('');
      setEmail('');
      setPerfil('user');
      setSenha('');
    }
  }, [isOpen, modo, usuarioItem]);

  if (!isOpen) return null;

  if (modo === 'detalhes' && usuarioItem) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Detalhes do Usuário #{usuarioItem.id_usuario}</h2>
            <button type="button" className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="detalhes-lista">
            <p><strong>ID:</strong> {usuarioItem.id_usuario}</p>
            <p><strong>Nome:</strong> {usuarioItem.nome}</p>
            <p><strong>E-mail:</strong> {usuarioItem.email}</p>
            <p><strong>Perfil:</strong> {usuarioItem.perfil}</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-primary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handleSalvar(event) {
    event.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      if (modo === 'editar' && usuarioItem) {
        const payload = {
          nome: nome.trim(),
          email: email.trim(),
          perfil,
        };
        if (senha.trim() !== '') {
          payload.senha = senha;
        }
        await api.put(`/usuarios/${usuarioItem.id_usuario}`, payload);
      } else {
        await api.post('/usuarios/admin', {
          nome: nome.trim(),
          email: email.trim(),
          perfil,
          senha,
        });
      }

      if (onSucesso) onSucesso();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar o usuário.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {modo === 'editar' ? `Editar Usuário #${usuarioItem?.id_usuario}` : 'Cadastrar Novo Usuário'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {erro && <div className="alert-danger">{erro}</div>}

        <form onSubmit={handleSalvar}>
          <div className="form-group">
            <label className="form-label">Nome Completo *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nome do colaborador"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Perfil de Acesso *</label>
            <select
              className="form-input"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              required
            >
              <option value="user">Usuário Padrão (user)</option>
              <option value="admin">Administrador (admin)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail *</label>
            <input
              type="email"
              className="form-input"
              placeholder="colaborador@celesc.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {modo === 'editar' ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Digite a senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required={modo === 'criar'}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
