import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import { appIcons, appColors, sweetAlertConfig } from '../utils/theme';
import Swal from 'sweetalert2';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Ciudades = () => {
    const [ciudades, setCiudades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCiudades();
    }, []);

    const fetchCiudades = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ciudades`);
            if (response.data.success) {
                setCiudades(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener ciudades:', error);
            toast.error('Error al cargar las ciudades');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer",
                icon: 'warning',
                showCancelButton: true,
                ...sweetAlertConfig,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/ciudades/${id}`);
                if (response.data.success) {
                    toast.success('Ciudad eliminada exitosamente');
                    fetchCiudades();
                }
            }
        } catch (error) {
            console.error('Error al eliminar ciudad:', error);
            toast.error('Error al eliminar la ciudad');
        }
    };

    const handleEdit = async (ciudad) => {
        try {
            const { value: nombre } = await Swal.fire({
                title: 'Editar Ciudad',
                input: 'text',
                inputLabel: 'Nombre de la ciudad',
                inputValue: ciudad.nombre,
                showCancelButton: true,
                ...sweetAlertConfig,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debe ingresar un nombre';
                    }
                }
            });

            if (nombre) {
                const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/ciudades/${ciudad.id}`, {
                    nombre,
                    estado: ciudad.estado
                });

                if (response.data.success) {
                    toast.success('Ciudad actualizada exitosamente');
                    fetchCiudades();
                }
            }
        } catch (error) {
            console.error('Error al actualizar ciudad:', error);
            toast.error('Error al actualizar la ciudad');
        }
    };

    const handleAdd = async () => {
        try {
            const { value: nombre } = await Swal.fire({
                title: 'Nueva Ciudad',
                input: 'text',
                inputLabel: 'Nombre de la ciudad',
                showCancelButton: true,
                ...sweetAlertConfig,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debe ingresar un nombre';
                    }
                }
            });

            if (nombre) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ciudades`, {
                    nombre
                });

                if (response.data.success) {
                    toast.success('Ciudad creada exitosamente');
                    fetchCiudades();
                }
            }
        } catch (error) {
            console.error('Error al crear ciudad:', error);
            toast.error('Error al crear la ciudad');
        }
    };

    const filteredCiudades = ciudades.filter(ciudad =>
        ciudad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Ciudades</h2>
                <Button
                    variant="contained"
                    onClick={handleAdd}
                    style={{ backgroundColor: appColors.primary }}
                    startIcon={<appIcons.add />}
                >
                    Nueva Ciudad
                </Button>
            </div>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <appIcons.search />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper} className="shadow-md">
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
                        ) : filteredCiudades.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No se encontraron ciudades
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCiudades.map((ciudad) => (
                                <TableRow key={ciudad.id}>
                                    <TableCell>{ciudad.nombre}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${
                                                ciudad.estado === "1"
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {ciudad.estado === "1" ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={() => handleEdit(ciudad)}
                                            style={{ color: appColors.info }}
                                        >
                                            <appIcons.edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(ciudad.id)}
                                            style={{ color: appColors.error }}
                                        >
                                            <appIcons.delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Ciudades; 