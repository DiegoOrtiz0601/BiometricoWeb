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

const Sedes = () => {
    const [sedes, setSedes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchSedes();
    }, []);

    const fetchSedes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sedes`);
            if (response.data.success) {
                setSedes(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener sedes:', error);
            toast.error('Error al cargar las sedes');
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/sedes/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Sede eliminada exitosamente'
                });
                fetchSedes();
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la sede'
                });
            } finally {
                setLoadingAction(false);
            }
        }
    };

    const handleEdit = (sede) => {
        // Implementar lógica de edición
    };

    const filteredSedes = sedes.filter(sede =>
        sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.empresa?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Sedes</h1>
                <Button
                    variant="contained"
                    style={{ backgroundColor: appColors.primary }}
                    className="flex items-center gap-2"
                    onClick={() => {/* Implementar lógica de nuevo */}}
                    startIcon={<appIcons.add className="text-xl" />}
                >
                    Nueva Sede
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6 relative">
                {loadingAction && <LoadingOverlay />}
                
                <div className="p-4 border-b">
                    <TextField
                        fullWidth
                        placeholder="Buscar sedes..."
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
                                <TableCell>EMPRESA</TableCell>
                                <TableCell>ESTADO</TableCell>
                                <TableCell align="right">ACCIONES</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Cargando...
                                    </TableCell>
                                </TableRow>
                            ) : filteredSedes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No se encontraron sedes
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence>
                                    {filteredSedes.map((sede) => (
                                        <motion.tr
                                            key={sede.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell>{sede.nombre}</TableCell>
                                            <TableCell>{sede.empresa?.nombre}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        sede.estado === "1"
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {sede.estado === "1" ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </TableCell>
                                            <TableCell align="right">
                                                <div className="flex justify-end space-x-2">
                                                    <LoadingButton
                                                        onClick={() => handleEdit(sede)}
                                                        className="p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                                                        loading={loadingAction}
                                                        title="Editar"
                                                    >
                                                        <appIcons.edit className="text-xl" />
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        onClick={() => handleDelete(sede.id)}
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

export default Sedes; 