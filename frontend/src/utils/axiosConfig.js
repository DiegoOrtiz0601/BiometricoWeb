import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: '/api', // Asegúrate de que esto coincida con tu configuración de proxy
});

// Agregar interceptor para incluir el token en todas las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Si recibimos un 401, limpiamos el token y redirigimos al login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 