import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';

const SedeForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        Nombre: initialData?.Nombre?.toUpperCase() || '',
        IdEmpresa: initialData?.IdEmpresa || '',
        IdCiudad: initialData?.IdCiudad || '',
        Estado: initialData?.Estado ?? true
    });

    const [empresas, setEmpresas] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empresasRes, ciudadesRes] = await Promise.all([
                    axiosInstance.get('/sedes/empresas'),
                    axiosInstance.get('/sedes/ciudades')
                ]);
                setEmpresas(empresasRes.data);
                setCiudades(ciudadesRes.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            Nombre: formData.Nombre.toUpperCase(),
            Estado: Boolean(formData.Estado)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Estado') {
            setFormData(prev => ({
                ...prev,
                [name]: value === "1"
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'Nombre' ? value.toUpperCase() : value
            }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {initialData ? 'Editar Sede' : 'Nueva Sede'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent uppercase"
                        required
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                    </label>
                    <select
                        name="IdEmpresa"
                        value={formData.IdEmpresa}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                        required
                    >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map(empresa => (
                            <option key={empresa.IdEmpresa} value={empresa.IdEmpresa}>
                                {empresa.Nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ciudad
                    </label>
                    <select
                        name="IdCiudad"
                        value={formData.IdCiudad}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                        required
                    >
                        <option value="">Seleccione una ciudad</option>
                        {ciudades.map(ciudad => (
                            <option key={ciudad.IdCiudad} value={ciudad.IdCiudad}>
                                {ciudad.Nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        name="Estado"
                        value={formData.Estado ? "1" : "0"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vml-red focus:ring-offset-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-vml-red text-white rounded-md hover:bg-vml-red/90 focus:outline-none focus:ring-2 focus:ring-vml-red focus:ring-offset-2"
                    >
                        {initialData ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default SedeForm; 