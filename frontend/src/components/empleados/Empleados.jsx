import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiSearchLine, RiEditLine, RiDeleteBin6Line, RiArrowUpSLine, RiArrowDownSLine, RiQuestionLine } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EmpleadoForm from './EmpleadoForm';
import axiosInstance from '../../utils/axiosConfig';

const LoadingSpinner = () => (
    <FaSpinner className="animate-spin text-4xl text-vml-red" />
);

const LoadingOverlay = ({ message }) => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    </div>
);

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEmpleado, setEditingEmpleado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('Empleados.Nombres');
    const [sortDirection, setSortDirection] = useState('asc');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
    });

    const perPageOptions = [5, 10, 25, 50, 100];

    const [loadingAction, setLoadingAction] = useState(false);

    const fetchEmpleados = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/empleados', {
                params: {
                    page: pagination.currentPage,
                    perPage: pagination.perPage,
                    search: searchTerm,
                    sortField,
                    sortDirection
                }
            });

            // Asegurarse de que los datos incluyan todos los IDs necesarios
            const empleadosConIds = response.data.data.map(emp => ({
                ...emp,
                IdEmpresa: emp.IdEmpresa ? parseInt(emp.IdEmpresa) : '',
                IdSede: emp.IdSede ? parseInt(emp.IdSede) : '',
                IdArea: emp.IdArea ? parseInt(emp.IdArea) : '',
                IdTipoEmpleado: emp.IdTipoEmpleado ? parseInt(emp.IdTipoEmpleado) : '',
                Estado: emp.Estado === 1 || emp.Estado === '1' || emp.Estado === true
            }));

            console.log('Empleados cargados con IDs:', empleadosConIds);
            setEmpleados(empleadosConIds);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                perPage: response.data.per_page,
                total: response.data.total
            });
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los empleados'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, [pagination.currentPage, pagination.perPage, searchTerm, sortField, sortDirection]);

    const handleSort = (field) => {
        setSortDirection(currentDirection => {
            if (sortField === field) {
                return currentDirection === 'asc' ? 'desc' : 'asc';
            }
            return 'asc';
        });
        setSortField(field);
    };

    const handleSubmit = async (formData) => {
        try {
            setLoadingAction(true);
            if (editingEmpleado) {
                await axiosInstance.put(`/empleados/${editingEmpleado.IdEmpleado}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Empleado actualizado exitosamente'
                });
            } else {
                await axiosInstance.post('/empleados', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Empleado creado exitosamente'
                });
            }
            setShowForm(false);
            setEditingEmpleado(null);
            fetchEmpleados();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar la solicitud'
            });
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.delete(`/empleados/${id}`);
                Swal.fire(
                    'Eliminado',
                    'El empleado ha sido eliminado',
                    'success'
                );
                fetchEmpleados();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el empleado'
                });
            }
        }
    };

    const handleEditClick = (empleado) => {
        console.log('Datos del empleado antes de editar:', empleado);
        const empleadoToEdit = {
            ...empleado,
            IdEmpresa: empleado.IdEmpresa ? empleado.IdEmpresa.toString() : '',
            IdSede: empleado.IdSede ? empleado.IdSede.toString() : '',
            IdArea: empleado.IdArea ? empleado.IdArea.toString() : '',
            IdTipoEmpleado: empleado.IdTipoEmpleado ? empleado.IdTipoEmpleado.toString() : '',
            Estado: empleado.Estado === 1 || empleado.Estado === '1' || empleado.Estado === true
        };
        console.log('Empleado preparado para edición:', empleadoToEdit);
        setEditingEmpleado(empleadoToEdit);
        setShowForm(true);
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <RiArrowUpSLine /> : <RiArrowDownSLine />;
    };

    const getTipoAbreviatura = (tipo) => {
        const abreviaturas = {
            'ENROLADO MARCA - SIN SEGUIMIENTO': 'EM-SS',
            'ENROLADO MARCA - CON SEGUIMIENTO': 'EM-CS',
            'ENROLADO NO MARCA': 'ENM',
            'ENROLADO ROTATIVO': 'ER',
            'Enrolado Marca - Sin Seguimiento': 'EM-SS',
            'Enrolado Marca - Con Seguimiento': 'EM-CS',
            'Enrolado No Marca': 'ENM',
            'Enrolado Rotativo': 'ER',
            'ADMINISTRATIVO': 'AD',
            'Administrativo': 'AD'
        };
        return abreviaturas[tipo] || tipo;
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Empleados</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-vml-red hover:bg-vml-red/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    onClick={() => {
                        setEditingEmpleado(null);
                        setShowForm(true);
                    }}
                >
                    <RiAddLine />
                    <span>Nuevo Empleado</span>
                </motion.button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6 relative">
                {loadingAction && <LoadingOverlay message="Procesando..." />}
                
                <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <RiSearchLine className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar empleados..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vml-red"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative">
                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-24"
                                    onClick={() => handleSort('Empleados.Documento')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Documento</span>
                                        <SortIcon field="Empleados.Documento" />
                                    </div>
                                </th>
                                <th 
                                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32"
                                    onClick={() => handleSort('Empleados.Nombres')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Nombres</span>
                                        <SortIcon field="Empleados.Nombres" />
                                    </div>
                                </th>
                                <th 
                                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32"
                                    onClick={() => handleSort('Empleados.Apellidos')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Apellidos</span>
                                        <SortIcon field="Empleados.Apellidos" />
                                    </div>
                                </th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                    Empresa
                                </th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                    Sede
                                </th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                    Área
                                </th>
                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    <div className="flex items-center space-x-1">
                                        <span>Tipo</span>
                                        <div className="group relative">
                                            <RiQuestionLine className="text-gray-400 hover:text-gray-600" />
                                            <div className="hidden group-hover:block absolute left-0 bg-vml-red text-white text-xs rounded py-1 px-2 w-48 z-10">
                                                <p className="mb-1">EM-SS: Enrolado Marca - Sin Seguimiento</p>
                                                <p className="mb-1">EM-CS: Enrolado Marca - Con Seguimiento</p>
                                                <p className="mb-1">ENM: Enrolado No Marca</p>
                                                <p>ER: Enrolado Rotativo</p>
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th 
                                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-24"
                                    onClick={() => handleSort('Empleados.Estado')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Estado</span>
                                        <SortIcon field="Empleados.Estado" />
                                    </div>
                                </th>
                                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-2 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaSpinner className="animate-spin text-4xl text-vml-red mb-4" />
                                            <p className="text-gray-600">Cargando empleados...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : empleados.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-2 py-8 text-center">
                                        <p className="text-gray-600">No hay empleados registrados</p>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {empleados.map((empleado) => (
                                        <motion.tr
                                            key={empleado.IdEmpleado}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.Documento}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.Nombres}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.Apellidos}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.NombreEmpresa}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.NombreSede}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                {empleado.NombreArea}
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                <div className="group relative inline-block">
                                                    <span className="font-medium">{getTipoAbreviatura(empleado.TipoEmpleado)}</span>
                                                    <div className="hidden group-hover:block absolute left-0 bg-vml-red text-white text-xs rounded py-1 px-2 w-48 z-10">
                                                        {empleado.TipoEmpleado}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${
                                                    empleado.Estado 
                                                    ? 'bg-green-200 text-green-900 border border-green-400' 
                                                    : 'bg-red-200 text-red-900 border border-red-400'
                                                }`}>
                                                    {empleado.Estado ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-1">
                                                    <button
                                                        onClick={() => handleEditClick(empleado)}
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                        title="Editar"
                                                    >
                                                        <RiEditLine className="text-indigo-600 text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(empleado.IdEmpleado)}
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                        title="Eliminar"
                                                    >
                                                        <RiDeleteBin6Line className="text-red-600 text-lg" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">Mostrar</span>
                        <div className="relative">
                            <select
                                className="border border-gray-300 rounded-md text-sm px-3 py-1 focus:outline-none focus:ring-2 focus:ring-vml-red min-w-[80px]"
                                value={pagination.perPage}
                                onChange={(e) => {
                                    const newPerPage = Number(e.target.value);
                                    setPagination(prev => ({
                                        ...prev,
                                        perPage: newPerPage,
                                        currentPage: 1
                                    }));
                                }}
                                disabled={loading}
                            >
                                {perPageOptions.map(option => (
                                    <option key={option} value={option} className="py-1">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {loading && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <FaSpinner className="animate-spin text-gray-400 text-sm" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-gray-700">registros por página</span>
                    </div>
                    <div className="text-sm text-gray-700">
                        Mostrando {((pagination.currentPage - 1) * pagination.perPage) + 1} a {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} de {pagination.total} registros
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                            disabled={pagination.currentPage === 1}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                            disabled={pagination.currentPage === 1}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            ‹
                        </button>
                        {[...Array(pagination.lastPage)].map((_, index) => {
                            const page = index + 1;
                            // Mostrar siempre la primera página, la última, la actual y una página antes y después de la actual
                            if (
                                page === 1 ||
                                page === pagination.lastPage ||
                                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                                        className={`px-3 py-1 rounded ${
                                            pagination.currentPage === page
                                            ? 'bg-vml-red text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === pagination.currentPage - 2 ||
                                page === pagination.currentPage + 2
                            ) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        })}
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === pagination.lastPage
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            ›
                        </button>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.lastPage }))}
                            disabled={pagination.currentPage === pagination.lastPage}
                            className={`px-3 py-1 rounded ${
                                pagination.currentPage === pagination.lastPage
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            »
                        </button>
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
                        <EmpleadoForm
                            onSubmit={handleSubmit}
                            initialData={editingEmpleado}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingEmpleado(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Empleados; 