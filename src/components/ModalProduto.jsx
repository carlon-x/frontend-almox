import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ModalProduto({ isOpen, onClose, modo, item, locais, onSucesso }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('ferramenta');
  const [quantidadeAtual, setQuantidadeAtual] = useState(0);
  const [quantidadeMinima, setQuantidadeMinima] = useState(5);
  const [idLocal, setIdLocal] = useState('');
  const [idUsuarioEvento, setIdUsuarioEvento] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);


  useEffect(() => {
    if (!isOpen) return;
    setErro('');

    if (item && (modo === 'editar' || modo === 'detalhes')) {
      setNome(item.nome || '');
      setDescricao(item.descricao || '');
      setTipo(item.tipo || 'ferramenta');
      setQuantidadeAtual(item.quantidade_atual ?? 0);
      setQuantidadeMinima(item.quantidade_minima ?? 5);
      setIdLocal(item.id_local ?? '');
      setIdUsuarioEvento(item.id_usuario_evento ?? '');
      setTipoEvento(item.tipo_evento || '');
    } else {
      setNome('');
      setDescricao('');
      setTipo('ferramenta');
      setQuantidadeAtual(0);
      setQuantidadeMinima(5);
      const primeiroLocalId = locais.length > 0 ? (locais[0].id_local ?? locais[0].id) : 1;
      setIdLocal(primeiroLocalId);
      setIdUsuarioEvento('');
      setTipoEvento('');
    }
  }, [isOpen, modo, item, locais]);

  if (!isOpen) return null;

    if (modo === 'detalhes' && item) {
    const localEncontrado = locais.find(
      (loc) => (loc.id_local ?? loc.id) === item.id_local
    );
    const prat = localEncontrado?.nivel_prateleira || localEncontrado?.prateleira;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Detalhes do Item #{item.id_item}</h2>
            <button type="button" className="modal-close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="detalhes-lista">
            <p><strong>Item:</strong> {item.nome}</p>
            <p><strong>Descrição:</strong> {item.descricao || 'Sem descrição'}</p>
            <p><strong>Tipo:</strong> {item.tipo}</p>
            <p><strong>Quantidade Atual:</strong> {item.quantidade_atual}</p>
            <p><strong>Quantidade Mínima:</strong> {item.quantidade_minima}</p>
            <p>
              <strong>Local:</strong>{' '}
              {localEncontrado
                ? `#${item.id_local} - ${localEncontrado.area} (Estante ${localEncontrado.estante}${
                    prat ? `, Prat. ${prat}` : ''
                  })`
                : `ID #${item.id_local}`}
            </p>
            <p><strong>Último Evento:</strong> {item.tipo_evento || 'Nenhum registrado'}</p>
            <p><strong>ID Usuário Evento:</strong> {item.id_usuario_evento || 'Não informado'}</p>
            <p>
              <strong>Status:</strong>{' '}
              {item.status_alerta ? '⚠️ Alerta de Estoque Baixo' : '✅ Estável'}
            </p>
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
    const localIdNumerico = parseInt(idLocal, 10);

if (isNaN(localIdNumerico)) {
  setErro('Selecione um local de armazenamento válido.');
  setSalvando(false);
  return;
}


    const usuarioEventoFormatado =
      idUsuarioEvento !== '' && idUsuarioEvento !== null ? Number(idUsuarioEvento) : null;
    const tipoEventoFormatado = tipoEvento !== '' ? tipoEvento : null;

    try {
      if (modo === 'editar' && item) {
        await api.put(`/produtos/${item.id_item}`, {
          quantidade_atual: Number(quantidadeAtual),
          id_usuario_evento: usuarioEventoFormatado,
          tipo_evento: tipoEventoFormatado,
        });
      } else {
        const payload = {
          nome: nome.trim(),
          descricao: descricao.trim() || null,
          tipo,
          quantidade_atual: Number(quantidadeAtual),
          quantidade_minima: Number(quantidadeMinima),
          id_local: Number(idLocal),
        };

        if (usuarioEventoFormatado !== null) {
          payload.id_usuario_evento = usuarioEventoFormatado;
        }
        if (tipoEventoFormatado !== null) {
          payload.tipo_evento = tipoEventoFormatado;
        }

        await api.post('/produtos', payload);
      }

      onSucesso();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setErro(error.response?.data?.message || 'Erro de validação ao salvar o item.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {modo === 'editar' ? `Movimentar: ${item?.nome}` : 'Cadastrar Novo Item'}
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {erro && <div className="alert-danger">{erro}</div>}

        <form onSubmit={handleSalvar}>
          {modo === 'criar' && (
            <>
              <div className="form-group">
                <label className="form-label">Nome do Item *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Chave Seccionadora"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Especificação técnica do material"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo *</label>
                <select
                  className="form-input"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                >
                  <option value="ferramenta">Ferramenta</option>
                  <option value="consumo">Consumo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantidade Mínima (Alerta) *</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={quantidadeMinima}
                  onChange={(e) => setQuantidadeMinima(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Local de Armazenamento *</label>
                {locais.length > 0 ? (
                                <div className="form-group">
                <label className="form-label">Local de Armazenamento *</label>
                {locais.length > 0 ? (
                  <select
                    className="form-input"
                    value={idLocal}
                    onChange={(e) => setIdLocal(e.target.value)}
                    required
                  >
                    {locais.map((loc) => {
  const idReal = loc.id_local ?? loc.id; // <-- ESTA LINHA FICA AQUI DENTRO DO .map
  const prat = loc.prateleira || loc.nivel_prateleira;
  return (
    <option key={idReal} value={idReal}>
      #{idReal} - Área: {loc.area} | Estante: {loc.estante}
      {prat ? ` | Prateleira: ${prat}` : ''}
    </option>
  );
})}

                  </select>
                ) : (
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="Cadastre um local primeiro no botão + Local"
                    value={idLocal}
                    onChange={(e) => setIdLocal(e.target.value)}
                    required
                  />
                )}
              </div>

                ) : (
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="Cadastre um local primeiro no botão + Local"
                    value={idLocal}
                    onChange={(e) => setIdLocal(e.target.value)}
                    required
                  />
                )}
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Quantidade Atual *</label>
            <input
              type="number"
              min="0"
              className="form-input"
              value={quantidadeAtual}
              onChange={(e) => setQuantidadeAtual(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Evento (Opcional)</label>
            <select
              className="form-input"
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
            >
              <option value="">Nenhum / Não informar</option>
              <option value="abastecimento">Abastecimento</option>
              <option value="cautela">Cautela</option>
              <option value="log_dano">Log de Dano</option>
              <option value="log_perda">Log de Perda</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">ID do Usuário Responsável (Opcional)</label>
            <input
              type="number"
              min="1"
              className="form-input"
              placeholder="Deixe em branco se não houver"
              value={idUsuarioEvento}
              onChange={(e) => setIdUsuarioEvento(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
