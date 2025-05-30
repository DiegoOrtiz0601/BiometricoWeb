import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import { appIcons, appColors, sweetAlertConfig } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LoadingOverlay, LoadingButton } from '../common/LoadingStates';

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/empresas`);
            if (response.data.success) {
                setEmpresas(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener empresas:', error);
            toast.error('Error al cargar las empresas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            ...sweetAlertConfig,
            showCancelButton: true
        });

        if (result.isConfirmed) {
            try {
                setLoadingAction(true);
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/empresas/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Empresa eliminada exitosamente'
                });
                fetchEmpresas();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la empresa'
                });
            } finally {
                setLoadingAction(false);
            }
        }
    };

    const handleEdit = (empresa) => {
        // Implementar lógica de edición
    };

    const filteredEmpresas = empresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Empresas</h1>
                <Button
                    variant="contained"
                    style={{ backgroundColor: appColors.primary }}
                    className="flex items-center gap-2"
                    onClick={() => {/* Implementar lógica de nuevo */}}
                    startIcon={<appIcons.add className="text-xl" />}
                >
                    Nueva Empresa
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6 relative">
                {loadingAction && <LoadingOverlay />}
                
                <div className="p-4 border-b">
                    <TextField
                        fullWidth
                        placeholder="Buscar empresas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <appIcons.search className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NOMBRE</TableCell>
                                <TableCell>ESTADO</TableCell>
                                <TableCell align="right">ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ) : filteredEmpresas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        No se encontraron empresas
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence>
                                    {filteredEmpresas.map((empresa) => (
                                        <motion.tr
                                            key={empresa.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell>{empresa.nombre}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        empresa.estado === "1"
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {empresa.estado === "1" ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </TableCell>
                                            <TableCell align="right">
                                                <div className="flex justify-end space-x-2">
                                                    <LoadingButton
                                                        onClick={() => handleEdit(empresa)}
                                                        className="p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                                                        loading={loadingAction}
                                                        title="Editar"
                                                    >
                                                        <appIcons.edit className="text-xl" />
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        onClick={() => handleDelete(empresa.id)}
                                                        className="p-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                                                        loading={loadingAction}
                                                        title="Eliminar"
                                                    >
                                                        <appIcons.delete className="text-xl" />
                                                    </LoadingButton>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Empresas; 