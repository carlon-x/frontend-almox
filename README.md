# ⚡ Front-end - Controle de Almoxarifado SPSL (Celesc)

Interface web desenvolvida em **React** e **Vite** para gerenciamento visual de estoque, ferramentas, locais de armazenamento e controle de usuários da subestação. O sistema consome a API REST do almoxarifado com autenticação via **JWT** e controle de permissões por perfil (`admin` e `user`).

## 🌐 Aplicação em Produção (Deploy)

- **Acesse o Sistema Online:** https://almoxarifado-spsl.onrender.com
- **API Consumida:** https://api-almox-spsl.onrender.com

---

## 📋 Índice

- [⚡ Front-end - Controle de Almoxarifado SPSL (Celesc)](#-front-end---controle-de-almoxarifado-spsl-celesc)
  - [🌐 Aplicação em Produção (Deploy)](#-aplicação-em-produção-deploy)
  - [📋 Índice](#-índice)
  - [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
  - [🗂️ Arquitetura do Projeto](#️-arquitetura-do-projeto)
  - [✨ Funcionalidades e Fluxos](#-funcionalidades-e-fluxos)
  - [⚙️ Pré-requisitos e Instalação](#️-pré-requisitos-e-instalação)
  - [🔐 Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
  - [🌐 Configuração de Deploy (Render)](#-configuração-de-deploy-render)

---

## 🚀 Tecnologias Utilizadas

- **React 18** & **Vite** (Construção da interface e empacotamento)
- **React Router DOM** (Gerenciamento de rotas públicas e rotas privadas protegidas)
- **Axios** (Cliente HTTP centralizado com interceptors de requisição e resposta)
- **CSS3 Responsivo** (Identidade visual inspirada na Celesc, adaptável a desktop e mobile)

---

## 🗂️ Arquitetura do Projeto

```text
frontend-almox/
├── public/
│   └── CELESC_Logo.png           # Identidade visual exibida na Home e Navbar
├── src/
│   ├── components/
│   │   ├── ModalLocal.jsx        # Modal unificado de cadastro, edição e detalhes de locais
│   │   ├── ModalProduto.jsx      # Modal unificado de cadastro, movimentação e detalhes de itens
│   │   ├── ModalUsuario.jsx      # Modal restrito a admins para gestão de usuários
│   │   ├── Navbar.jsx            # Barra superior com busca global, ações rápidas e logout
│   │   └── PrivateRoute.jsx      # Proteção de rotas privadas verificando token no localStorage
│   ├── pages/
│   │   ├── Dashboard.jsx         # Painel principal com abas (Produtos, Locais e Usuários)
│   │   ├── Home.jsx              # Página inicial institucional com acesso ao sistema
│   │   └── Login.jsx             # Tela unificada de autenticação e autocadastro público
│   ├── services/
│   │   └── api.js                # Instância Axios com URL via .env e interceptors JWT
│   ├── App.css                   # Estilização global, tabelas, badges de alerta e modais
│   ├── App.jsx                   # Configuração das rotas da aplicação
│   └── main.jsx                  # Ponto de entrada do React
├── .env.example                  # Modelo das variáveis de ambiente
├── index.html
└── package.json
```

---

## ✨ Funcionalidades e Fluxos

- **Autenticação e Sessão Persistente:**
  - Cadastro público (`POST /usuarios` com perfil padrão `user`) e login (`POST /login`).
  - Persistência do token JWT, e-mail e perfil no `localStorage`, mantendo a sessão ativa mesmo ao recarregar a página (`F5`).
  - Logout seguro limpando todas as chaves de sessão e redirecionando para `/login`.
- **Interceptors HTTP Centralizados (`api.js`):**
  - Injeta automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as requisições autenticadas.
  - Intercepta respostas `401 Unauthorized` (token expirado/inválido) e falhas de rede, realizando o redirecionamento automático para a tela de login.
- **Controle de Acesso na Interface (RBAC):**
  - Usuários com perfil `user` visualizam e gerenciam **Produtos** e **Locais**.
  - Usuários com perfil `admin` têm acesso exclusivo ao botão **+ Usuário** na barra superior e à aba **👥 Usuários** no painel.
- **Gestão Visual de Estoque e Alertas:**
  - Filtro de busca instantânea por nome, descrição, tipo, área, estante ou usuário.
  - Indicador visual automático (**⚠️ Alerta** / **✅ Estável**) quando a quantidade atual fica abaixo da mínima.
  - Modais completos de detalhes, cadastro, edição/movimentação e exclusão com confirmação.

---

## ⚙️ Pré-requisitos e Instalação

1. **Pré-requisitos:**
   - [Node.js](https://nodejs.org) (v18 ou superior)
   - API Back-end (`backend-almox`) em execução

2. **Clone o repositório e instale as dependências:**

   ```bash
   git clone <URL_DO_SEU_REPOSITORIO_FRONTEND>
   cd frontend-almox
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie o arquivo `.env.example` para `.env` na raiz do projeto:

   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   A aplicação ficará disponível em `http://localhost:5173`.

---

## 🔐 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto contendo a URL base da API:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🌐 Configuração de Deploy (Render)

Ao publicar como **Static Site** no Render:

1. **Build Command:** `npm install && npm run build`
2. **Publish Directory:** `dist`
3. **Environment Variables:** Adicione `VITE_API_URL` apontando para a URL pública da API no Render.
4. **Redirects/Rewrites:** Adicione a regra abaixo para permitir o recarregamento (`F5`) em rotas privadas como `/produtos`:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
