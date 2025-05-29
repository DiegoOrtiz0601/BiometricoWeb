import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiSearchLine, RiEditLine, RiDeleteBin6Line, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import AreaForm from './AreaForm';
import axiosInstance from '../../utils/axiosConfig';

const Areas = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('Area.Nombre');
    const [sortDirection, setSortDirection] = useState('asc');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
    });

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/areas', {
                params: {
                    page: pagination.currentPage,
                    perPage: pagination.perPage,
                    search: searchTerm,
                    sortField,
                    sortDirection
                }
            });
            setAreas(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                perPage: response.data.per_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las áreas'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, [pagination.currentPage, searchTerm, sortField, sortDirection]);

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (editingArea) {
                await axiosInstance.put(`/areas/${editingArea.IdArea}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Área actualizada correctamente'
                });
            } else {
                await axiosInstance.post('/areas', formData);
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Área creada correctamente'
                });
            }
            setShowForm(false);
            setEditingArea(null);
            fetchAreas();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/areas/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El área ha sido eliminada'
                });
                fetchAreas();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el área'
                });
            }
        }
    };

    const SortIcon = ({ field }) => {
        if (field !== sortField) return <RiArrowUpSLine className="text-gray-400" />;
        return sortDirection === 'asc' ? 
            <RiArrowUpSLine className="text-vml-red" /> : 
            <RiArrowDownSLine className="text-vml-red" />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Áreas</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-vml-red text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    onClick={() => setShowForm(true)}
                >
                    <RiAddLine />
                    <span>Nueva Área</span>
                </motion.button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <RiSearchLine className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar área..."
                            className="w-full px-3 py-2 border-none focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('Area.Nombre')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Nombre</span>
                                        <SortIcon field="Area.Nombre" />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('Sede.Nombre')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Sede</span>
                                        <SortIcon field="Sede.Nombre" />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('Area.Estado')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Estado</span>
                                        <SortIcon field="Area.Estado" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : areas.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No se encontraron áreas
                                    </td>
                                </tr>
                            ) : (
                                areas.map((area) => (
                                    <tr key={area.IdArea}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {area.Nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {area.NombreSede}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-lg ${
                                                area.Estado 
                                                ? 'bg-green-200 text-green-900 border-2 border-green-400' 
                                                : 'bg-red-200 text-red-900 border-2 border-red-400'
                                            }`}>
                                                {area.Estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingArea(area);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                                            >
                                                <RiEditLine className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(area.IdArea)}
                                                className="p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                            >
                                                <RiDeleteBin6Line className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 flex items-center justify-between border-t">
                    <div className="text-sm text-gray-500">
                        Mostrando {((pagination.currentPage - 1) * pagination.perPage) + 1} a {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} de {pagination.total} resultados
                    </div>
                    <div className="flex space-x-1">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                            disabled={pagination.currentPage === 1}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                            }`}
                        >
                            «
                        </motion.button>

                        {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
                            .filter(pageNum => {
                                if (pageNum === 1 || pageNum === pagination.lastPage) return true;
                                if (Math.abs(pageNum - pagination.currentPage) <= 2) return true;
                                return false;
                            })
                            .map((pageNum, index, array) => {
                                if (index > 0 && pageNum - array[index - 1] > 1) {
                                    return (
                                        <span key={`ellipsis-${pageNum}`} className="px-3 py-1">
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <motion.button
                                        key={pageNum}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                                        className={`px-3 py-1 rounded ${
                                            pagination.currentPage === pageNum
                                                ? 'bg-vml-red text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                        }`}
                                    >
                                        {pageNum}
                                    </motion.button>
                                );
                            })}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.lastPage }))}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === pagination.lastPage
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                            }`}
                        >
                            »
                        </motion.button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <AreaForm
                            onSubmit={handleSubmit}
                            initialData={editingArea}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingArea(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Areas; 