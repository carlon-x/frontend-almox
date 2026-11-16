import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ModalLocal({ isOpen, onClose, modo, localItem, onSucesso }) {
  const [area, setArea] = useState('');
  const [estante, setEstante] = useState('');
  const [nivelPrateleira, setNivelPrateleira] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Extrai o ID corretamente (aceita tanto id_local quanto id)
  const idReal = localItem ? (localItem.id_local ?? localItem.id) : null;

  useEffect(() => {
    if (!isOpen) return;
    setErro('');

    if (localItem && (modo === 'editar' || modo === 'detalhes')) {
      setArea(localItem.area || '');
      setEstante(localItem.estante || '');
      setNivelPrateleira(localItem.nivel_prateleira || localItem.prateleira || '');
    } else {
      setArea('');
      setEstante('');
      setNivelPrateleira('');
    }
  }, [isOpen, modo, localItem]);

  if (!isOpen) return null;

  // 1. PONTO DE AJUSTE: Título e linha de ID no Modal de Detalhes
  if (modo === 'detalhes' && localItem) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Detalhes do Local #{idReal}</h2>
            <button type="button" className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="detalhes-lista">
            <p><strong>ID:</strong> {idReal}</p>
            <p><strong>Área / Setor:</strong> {localItem.area}</p>
            <p><strong>Estante:</strong> {localItem.estante}</p>
            <p><strong>Nível / Prateleira:</strong> {localItem.nivel_prateleira || localItem.prateleira || 'Não informado'}</p>
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

  // 2. PONTO DE AJUSTE: Envio do idReal na URL do PUT /locais/:id
  async function handleSalvar(event) {
    event.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      const payload = {
        area: area.trim(),
        estante: estante.trim(),
        nivel_prateleira: nivelPrateleira.trim(),
      };

      if (modo === 'editar' && idReal) {
        await api.put(`/locais/${idReal}`, payload);
      } else {
        await api.post('/locais', payload);
      }

      onSucesso();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar local:', error);
      setErro(error.response?.data?.message || 'Erro ao salvar o local.');
    } finally {
      setSalvando(false);
    }
  }

  // 3. PONTO DE AJUSTE: Título no Modal de Edição
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {modo === 'editar' ? `Editar Local #${idReal}` : 'Cadastrar Novo Local'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {erro && <div className="alert-danger">{erro}</div>}

        <form onSubmit={handleSalvar}>
          <div className="form-group">
            <label className="form-label">Área / Setor *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Baias, Sala de Comando"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estante *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: 15, Estante 01"
              value={estante}
              onChange={(e) => setEstante(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nível / Prateleira *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Superior, Nível 1"
              value={nivelPrateleira}
              onChange={(e) => setNivelPrateleira(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Local'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
