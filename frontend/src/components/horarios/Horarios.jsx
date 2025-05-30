import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEyeLine, RiSearchLine, RiArrowUpSLine, RiArrowDownSLine, RiAddLine } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import HorarioForm from './HorariosForm';
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

const Horarios = () => {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, perPage: 10, total: 0 });
    const [showForm, setShowForm] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    const fetchEmpleados = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/empleados-con-horarios', {
                params: {
                    page: pagination.currentPage,
                    perPage: pagination.perPage,
                    search: searchTerm
                }
            });
            setEmpleados(response.data.data);
            setPagination(prev => ({
                ...prev,
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total
            }));
        } catch (error) {
            console.error('Error al cargar empleados:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, [pagination.currentPage, pagination.perPage, searchTerm]);

    const handleVer = async (documento) => {
        try {
            setLoadingAction(true);
            const response = await axiosInstance.get(`/horarios-por-empleado/${documento}`);
            setHorarioSeleccionado(response.data);
            setShowForm(true);
        } catch (error) {
            console.error('Error al cargar horarios del empleado:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los horarios' });
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Horarios</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-vml-red hover:bg-vml-red/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    onClick={() => console.log('Cargar horarios')}
                >
                    <RiAddLine />
                    <span>Cargar Horarios</span>
                </motion.button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6 relative">
                {(loading || loadingAction) && <LoadingOverlay message={loadingAction ? 'Procesando...' : 'Cargando empleados...'} />}

                <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <RiSearchLine className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar empleado..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vml-red"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Horarios</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {empleados.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-2 py-8 text-center">
                                        <p className="text-gray-600">No se encontraron empleados</p>
                                    </td>
                                </tr>
                            )}
                            <AnimatePresence mode="popLayout">
                                {empleados.map((emp) => (
                                    <motion.tr
                                        key={emp.Documento}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{emp.Nombre}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{emp.Documento}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{emp.Empresa}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{emp.Tipo}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm">
                                            <button
                                                onClick={() => handleVer(emp.Documento)}
                                                className="p-1 hover:bg-gray-100 rounded-full"
                                                title="Ver horarios"
                                            >
                                                <RiEyeLine className="text-green-600 text-lg" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showForm && horarioSeleccionado && (
                    <HorarioForm
                        horarios={horarioSeleccionado}
                        onClose={() => {
                            setShowForm(false);
                            setHorarioSeleccionado(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Horarios;
