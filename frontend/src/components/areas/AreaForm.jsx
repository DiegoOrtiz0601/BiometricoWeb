import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';

const AreaForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        Nombre: initialData?.Nombre?.toUpperCase() || '',
        IdSede: initialData?.IdSede || '',
        Estado: initialData?.Estado ?? true
    });

    const [sedes, setSedes] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [filtroEmpresa, setFiltroEmpresa] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar empresas
    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axiosInstance.get('/empresas/activas');
                console.log('Respuesta de empresas:', response.data);
                if (response.data && response.data.status === 'success') {
                    setEmpresas(response.data.data || []);
                } else {
                    console.warn('No se encontraron empresas:', response.data?.message);
                    setEmpresas([]);
                }
            } catch (error) {
                console.error('Error al cargar empresas:', error);
                setEmpresas([]);
            }
        };
        fetchEmpresas();
    }, []);

    // Cargar sedes cuando cambie la empresa seleccionada
    useEffect(() => {
        const fetchSedes = async () => {
            try {
                let url = '/areas/sedes';
                if (filtroEmpresa) {
                    url = `/sedes/empresa/${filtroEmpresa}`;
                }
                
                const response = await axiosInstance.get(url);
                console.log('Respuesta de sedes:', response.data);
                
                if (response.data.status === 'success') {
                    setSedes(response.data.data);
                } else {
                    console.warn('No se encontraron sedes:', response.data?.message);
                    setSedes([]);
                }
            } catch (error) {
                console.error('Error al cargar sedes:', error);
                setSedes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSedes();
    }, [filtroEmpresa]);

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
        } else if (name === 'IdSede') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'Nombre' ? value.toUpperCase() : value
            }));
        }
    };

    const handleEmpresaChange = (e) => {
        const value = e.target.value;
        setFiltroEmpresa(value);
        // Resetear la sede seleccionada cuando cambie la empresa
        setFormData(prev => ({
            ...prev,
            IdSede: ''
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {initialData ? 'Editar Área' : 'Nueva Área'}
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

                {/* Filtro de Empresa */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filtrar por Empresa
                    </label>
                    <select
                        value={filtroEmpresa}
                        onChange={handleEmpresaChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                    >
                        <option value="">Todas las empresas</option>
                        {Array.isArray(empresas) && empresas.map(empresa => (
                            <option key={empresa.IdEmpresa} value={empresa.IdEmpresa}>
                                {empresa.Nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sede
                    </label>
                    <select
                        name="IdSede"
                        value={formData.IdSede}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                        required
                    >
                        <option value="">Seleccione una sede</option>
                        {sedes.map(sede => (
                            <option key={sede.IdSede} value={sede.IdSede}>
                                {sede.Nombre}
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

export default AreaForm; 