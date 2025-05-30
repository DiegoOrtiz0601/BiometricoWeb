import axios from 'axios';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // <-- ¡YA NO USES localhost!
    withCredentials: true, // <- para que funcionen cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Agregar interceptor para incluir el token en todas las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Interceptor de petición - Token:', token);
        console.log('Configuración de la petición:', {
            url: config.url,
            method: config.method,
            headers: config.headers
        });
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error en el interceptor de petición:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Respuesta exitosa:', {
            status: response.status,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Error en la respuesta:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data,
            error: error.message
        });
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 