import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiEdit2Line } from 'react-icons/ri';
import { LoadingOverlay, TableLoadingRow, EmptyRow, LoadingButton } from '../common/LoadingStates';

const HorarioForm = ({ horarios, onClose }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <LoadingOverlay message="Cargando horarios..." />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Horarios registrados</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Listado de horarios asignados al colaborador</p>

                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">Fecha de Inicio</th>
                                    <th className="border px-4 py-2">Fecha de Fin</th>
                                    <th className="border px-4 py-2">Fecha de creación</th>
                                    <th className="border px-4 py-2">Estado</th>
                                    <th className="border px-4 py-2">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horarios.length === 0 ? (
                                    <EmptyRow colSpan={5} message="Sin horarios registrados" />
                                ) : (
                                    horarios.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border px-4 py-2 text-center">{item.FechaInicio}</td>
                                            <td className="border px-4 py-2 text-center">{item.FechaFin}</td>
                                            <td className="border px-4 py-2 text-center">{item.FechaCreacion}</td>
                                            <td className="border px-4 py-2 text-center">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded ${item.Estado === 'Vigente' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                    {item.Estado}
                                                </span>
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                <LoadingButton
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                                                    loading={false}
                                                    title="Editar horario"
                                                >
                                                    <RiEdit2Line />
                                                </LoadingButton>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-end mt-4">
                            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
                                Cerrar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default HorarioForm;
