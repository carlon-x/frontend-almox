import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        // Dispara o GET real. O interceptor do api.js injeta o Bearer Token automaticamente!
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        alert('Falha ao carregar o estoque. Verifique sua autenticação.');
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="produto-container">
        <h1 className="page-title">📦 Controle de Estoque</h1>
        
        {carregando ? (
          <p>Carregando ferramentas...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Qtd. Atual</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((item) => (
                <tr key={item.id_item}>
                  <td><strong>{item.nome}</strong></td>
                  <td>{item.descricao}</td>
                  <td><span className="badge-tipo">{item.tipo}</span></td>
                  <td>{item.quantidade_atual}</td>
                  <td>
                    <span className={item.status_alerta ? "badge-danger" : "badge-success"}>
                      {item.status_alerta ? "⚠️ Alerta" : "✅ Estável"}
                    </span>
                  </td>
                </tr>
              ))}
              {produtos.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum item cadastrado no estoque.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
