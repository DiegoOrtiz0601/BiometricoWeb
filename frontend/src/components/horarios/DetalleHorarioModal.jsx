import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axiosInstance from '../../utils/axiosConfig';

// Temporalmente usamos un objeto estático mientras se implementa el endpoint
const DIAS_SEMANA = {
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
};

const DetalleHorarioModal = ({ horario, onClose }) => {
    const [detalles, setDetalles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDetalles = async () => {
            try {
                setLoading(true);
                // Usamos la ruta que existe en el backend con el ID específico
                const response = await axiosInstance.get('/asignacion-horarios', {
                    params: {
                        horario_id: horario.id,
                        perPage: 1 // Solo necesitamos un registro
                    }
                });
                
                if (response.data.success && response.data.data.length > 0) {
                    const horarioConDetalles = response.data.data[0];
                    if (horarioConDetalles.detalles && horarioConDetalles.detalles.length > 0) {
                        const detallesConDias = horarioConDetalles.detalles.map(detalle => ({
                            ...detalle,
                            nombreDia: DIAS_SEMANA[detalle.id_dia_semana]
                        }));
                        setDetalles(detallesConDias);
                        console.log('Detalles cargados:', detallesConDias);
                    } else {
                        console.log('El horario no tiene detalles configurados');
                        setDetalles([]);
                    }
                } else {
                    console.log('No se encontró el horario o la respuesta no fue exitosa');
                    setDetalles([]);
                }
            } catch (error) {
                console.error('Error al cargar detalles:', error);
                console.log('Datos del horario:', horario);
                setDetalles([]);
            } finally {
                setLoading(false);
            }
        };

        if (horario?.id) {
            cargarDetalles();
        } else {
            console.log('No hay ID de horario disponible');
        }
    }, [horario]);

    if (!horario) return null;

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative my-6">
                <div className="p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <RiCloseLine className="text-2xl" />
                    </button>

                    <h2 className="text-2xl font-bold mb-6">Detalles del Horario</h2>
                    
                    {/* Información del empleado */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-700 mb-3">Datos del Empleado</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-600">Nombre:</p>
                                <p className="text-gray-800">{horario.empleado.nombre_completo}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Documento:</p>
                                <p className="text-gray-800">{horario.empleado.documento}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Empresa:</p>
                                <p className="text-gray-800">{horario.empleado.empresa}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Tipo de Empleado:</p>
                                <p className="text-gray-800">{horario.empleado.tipo_empleado}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información del horario */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-700 mb-3">Datos del Horario</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-600">Fecha Inicio:</p>
                                <p className="text-gray-800">{new Date(horario.fecha_inicio).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Fecha Fin:</p>
                                <p className="text-gray-800">{new Date(horario.fecha_fin).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Estado:</p>
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                    horario.estado === "1" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {horario.estado === "1" ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600">Tipo de Horario:</p>
                                <p className="text-gray-800">{horario.tipo_horario || '1'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles del horario por día */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-3">Horarios por Día</h3>
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <FaSpinner className="animate-spin text-2xl text-vml-red" />
                            </div>
                        ) : detalles.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-2">No hay detalles de horario configurados</p>
                                <p className="text-sm text-gray-400">
                                    Los detalles del horario se mostrarán aquí una vez que sean configurados.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {detalles.map((detalle) => (
                                    <div 
                                        key={detalle.id_dia_semana || detalle.diaSemana} 
                                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <h4 className="font-medium text-gray-800 mb-2">
                                            {detalle.nombreDia || 'Día no especificado'}
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <span className="text-gray-600">Entrada:</span>{' '}
                                                <span className="font-medium">{formatTime(detalle.hora_inicio || detalle.horaInicio)}</span>
                                            </p>
                                            <p>
                                                <span className="text-gray-600">Salida:</span>{' '}
                                                <span className="font-medium">{formatTime(detalle.hora_fin || detalle.horaFin)}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DetalleHorarioModal; 