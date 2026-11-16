import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ModalProduto from '../components/ModalProduto';
import ModalLocal from '../components/ModalLocal';
import ModalUsuario from '../components/ModalUsuario';

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState('produtos');

  const [produtos, setProdutos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
  const [modoProduto, setModoProduto] = useState('criar');
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const [modalLocalAberto, setModalLocalAberto] = useState(false);
  const [modoLocal, setModoLocal] = useState('criar');
  const [localSelecionado, setLocalSelecionado] = useState(null);

  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [modoUsuario, setModoUsuario] = useState('criar');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);



  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [resProdutos, resLocais, resUsuarios] = await Promise.all([
        api.get('/produtos'),
        api.get('/locais').catch(() => ({ data: [] })),
        isAdmin
          ? api.get('/usuarios').catch(() => ({ data: [] }))
          : Promise.resolve({ data: [] }),
      ]);
      setProdutos(resProdutos.data);
      setLocais(resLocais.data);
      setUsuarios(resUsuarios.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setErro('Falha ao carregar os dados do sistema. Verifique sua autenticação.');
    } finally {
      setCarregando(false);
    }
  }


  function abrirModalProduto(modo, item = null) {
    setModoProduto(modo);
    setItemSelecionado(item);
    setModalProdutoAberto(true);
  }

  function abrirModalLocal(modo, local = null) {
    setModoLocal(modo);
    setLocalSelecionado(local);
    setModalLocalAberto(true);
  }

  function abrirModalUsuario(modo, usuario = null) {
    setModoUsuario(modo);
    setUsuarioSelecionado(usuario);
    setModalUsuarioAberto(true);
  }

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


  async function handleExcluirProduto(item) {
    if (!window.confirm(`Deseja realmente excluir "${item.nome}" do estoque?`)) return;
    try {
      await api.delete(`/produtos/${item.id_item}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir o item.');
    }
  }

    async function handleExcluirLocal(local) {
    const idReal = local.id_local ?? local.id;
    if (!window.confirm(`Deseja realmente excluir o local "${local.area} - ${local.estante}"?`)) return;
    try {
      await api.delete(`/locais/${idReal}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir local (verifique se há itens vinculados).');
    }
  }


  async function handleExcluirUsuario(usuario) {
    if (!window.confirm(`Deseja realmente excluir o usuário "${usuario.nome}"?`)) return;
    try {
      await api.delete(`/usuarios/${usuario.id_usuario}`);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir usuário.');
    }
  }

  const busca = termoBusca.toLowerCase();

  const produtosFiltrados = produtos.filter(
    (item) =>
      (item.nome && item.nome.toLowerCase().includes(busca)) ||
      (item.descricao && item.descricao.toLowerCase().includes(busca)) ||
      (item.tipo && item.tipo.toLowerCase().includes(busca))
  );

  const locaisFiltrados = locais.filter(
    (loc) =>
      (loc.area && loc.area.toLowerCase().includes(busca)) ||
      (loc.estante && loc.estante.toLowerCase().includes(busca)) ||
      (loc.prateleira && loc.prateleira.toLowerCase().includes(busca))
  );

  const usuariosFiltrados = usuarios.filter(
    (usr) =>
      (usr.nome && usr.nome.toLowerCase().includes(busca)) ||
      (usr.email && usr.email.toLowerCase().includes(busca)) ||
      (usr.perfil && usr.perfil.toLowerCase().includes(busca))
  );
  return (
    <div>
      <Navbar
        onNovoItem={() => abrirModalProduto('criar')}
        onNovoLocal={() => abrirModalLocal('criar')}
        onNovoUsuario={() => abrirModalUsuario('criar')}
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
      />

      <div className="produto-container">
        <div className="page-header">
          <h1 className="page-title">⚡ Gestão Almoxarifado - SPSL</h1>
        </div>

        <div className="tabs-bar">
          <button
            type="button"
            className={`tab-btn ${abaAtiva === 'produtos' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('produtos')}
          >
            📦 Produtos ({produtos.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${abaAtiva === 'locais' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('locais')}
          >
            📍 Locais ({locais.length})
          </button>

          {isAdmin && (
            <button
              type="button"
              className={`tab-btn ${abaAtiva === 'usuarios' ? 'active' : ''}`}
              onClick={() => setAbaAtiva('usuarios')}
            >
              👥 Usuários ({usuarios.length})
            </button>
          )}
        </div>


        {erro && <div className="alert-danger">{erro}</div>}

        <div className="table-card">
          {carregando ? (
            <p className="empty-state">Carregando dados do sistema...</p>
          ) : (
            <>
              {abaAtiva === 'produtos' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>Local</th>
                      <th>Qtd. Atual</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosFiltrados.map((item) => {
                      // Cruza o id_local do produto com a lista de locais carregados
                      const localObj = locais.find(
                        (loc) => (loc.id_local ?? loc.id) === item.id_local
                      );
                      const textoLocal = localObj
                        ? `${localObj.area} - Est. ${localObj.estante}`
                        : `Local #${item.id_local}`;

                      return (
                        <tr key={item.id_item}>
                          <td><strong>{item.nome}</strong></td>
                          <td>{item.descricao}</td>
                          <td><span className="badge-tipo">{item.tipo}</span></td>
                          <td>{textoLocal}</td>
                          <td><strong>{item.quantidade_atual}</strong></td>
                          <td>
                            <span className={item.status_alerta ? 'badge-danger' : 'badge-success'}>
                              {item.status_alerta ? '⚠️ Alerta' : '✅ Estável'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="btn-sm btn-info"
                                onClick={() => abrirModalProduto('detalhes', item)}
                              >
                                Detalhes
                              </button>
                              <button
                                type="button"
                                className="btn-sm btn-edit"
                                onClick={() => abrirModalProduto('editar', item)}
                              >
                                Movimentar
                              </button>
                              <button
                                type="button"
                                className="btn-sm btn-delete"
                                onClick={() => handleExcluirProduto(item)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {produtosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty-state">Nenhum produto encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {abaAtiva === 'locais' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Área / Setor</th>
                      <th>Estante</th>
                      <th>Prateleira</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locaisFiltrados.map((loc) => {
                      const idReal = loc.id_local ?? loc.id;
                      return (
                        <tr key={idReal}>
                          <td>#{idReal}</td>
                          <td><strong>{loc.area}</strong></td>
                          <td>{loc.estante}</td>
                          <td>{loc.nivel_prateleira || loc.prateleira || '-'}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                type="button"
                                className="btn-sm btn-info"
                                onClick={() => abrirModalLocal('detalhes', loc)}
                              >
                                Detalhes
                              </button>
                              <button
                                type="button"
                                className="btn-sm btn-edit"
                                onClick={() => abrirModalLocal('editar', loc)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn-sm btn-delete"
                                onClick={() => handleExcluirLocal(loc)}
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {locaisFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-state">Nenhum local cadastrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {abaAtiva === 'usuarios' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Perfil</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((usr) => (
                      <tr key={usr.id_usuario}>
                        <td>#{usr.id_usuario}</td>
                        <td><strong>{usr.nome}</strong></td>
                        <td>{usr.email}</td>
                        <td><span className="badge-tipo">{usr.perfil}</span></td>
                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="btn-sm btn-info"
                              onClick={() => abrirModalUsuario('detalhes', usr)}
                            >
                              Detalhes
                            </button>
                            <button
                              type="button"
                              className="btn-sm btn-edit"
                              onClick={() => abrirModalUsuario('editar', usr)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn-sm btn-delete"
                              onClick={() => handleExcluirUsuario(usr)}
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usuariosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="5" className="empty-state">Nenhum usuário encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      <ModalProduto
        isOpen={modalProdutoAberto}
        onClose={() => setModalProdutoAberto(false)}
        modo={modoProduto}
        item={itemSelecionado}
        locais={locais}
        onSucesso={carregarDados}
      />

      <ModalLocal
        isOpen={modalLocalAberto}
        onClose={() => setModalLocalAberto(false)}
        modo={modoLocal}
        localItem={localSelecionado}
        onSucesso={carregarDados}
      />

      <ModalUsuario
        isOpen={modalUsuarioAberto}
        onClose={() => setModalUsuarioAberto(false)}
        modo={modoUsuario}
        usuarioItem={usuarioSelecionado}
        onSucesso={carregarDados}
      />
    </div>
  );
}
