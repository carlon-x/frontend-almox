import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="app-container">
            <div className="home-card">
                <img
                    src="/CELESC_Logo.png"
                    alt="Logo Celesc - Centrais Elétricas de Santa Catarina"
                    className="home-logo"
                />

                <h1 className="home-title">Almoxarifado SPSL Lages</h1>

                <p className="home-description">
                    Sistema de controle e gerenciamento de materiais elétricos, equipamentos e insumos de
                    manutenção para subestações. <br></br>Acompanhe entradas, saídas e níveis de estoque de forma
                    segura.
                </p>

                <div className="home-actions">
                    <Link to="/login" className="btn-primary">
                        Entrar no Sistema
                    </Link>

                    <Link to="/login?cadastro=true" className="btn-secondary">
                        Cadastrar Usuário
                    </Link>
                </div>
            </div>
        </div>
    );
}
