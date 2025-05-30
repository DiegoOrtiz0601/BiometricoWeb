import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAsignacionHorarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/asignacion-horarios`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los horarios' };
    }
}; 