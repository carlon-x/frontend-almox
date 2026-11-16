import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor de Requisição (envia o Bearer Token)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@Almox:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de Resposta (trata token expirado e falha de rede)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se não houver resposta do servidor, é falha de rede / API offline
        if (!error.response) {
            error.message = 'Falha de conexão com o servidor. Verifique sua internet ou se a API está online.';
            return Promise.reject(error);
        }

        const status = error.response.status;
        const isRotaLogin = error.config?.url?.includes('/login');

        // Se receber 401 (não autorizado) ou 403 com mensagem de token inválido fora da tela de login
        if (status === 401 && !isRotaLogin) {
            localStorage.removeItem('@Almox:token');
            localStorage.removeItem('@Almox:usuario');
            localStorage.removeItem('@Almox:perfil');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
