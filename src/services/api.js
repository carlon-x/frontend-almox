import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Endereço oficial do seu back-end Express
});

// Interceptor para injetar o token JWT automaticamente em rotas protegidas
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@Almox:token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default api;
