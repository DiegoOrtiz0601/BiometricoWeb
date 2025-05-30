import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
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
    CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import EditarHorarioModal from './EditarHorarioModal';

const CargaMasivaHorarios = () => {
    const [loading, setLoading] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/asignacion-horarios`);
            if (response.data.success) {
                console.log('Horarios actualizados:', response.data.data);
                setHorarios(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener horarios:', error);
            toast.error('Error al cargar los horarios');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            toast.error('Por favor seleccione un archivo CSV válido');
            event.target.value = null;
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Por favor seleccione un archivo CSV');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/asignacion-horarios/carga-masiva`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

            if (response.data.success) {
                toast.success('Archivo procesado exitosamente');
                setFile(null);
                fetchHorarios();
            } else {
                toast.error(response.data.message || 'Error al procesar el archivo');
            }
        } catch (error) {
            console.error('Error al cargar archivo:', error);
            if (error.response?.data?.errores) {
                error.response.data.errores.forEach(err => toast.error(err));
            } else {
                toast.error(error.response?.data?.message || 'Error al cargar el archivo');
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleEditClick = (horario) => {
        console.log('Horario original:', horario);
        const horarioFormateado = {
            id: horario.id,
            empleado: {
                id: horario.empleado.id,
                nombre_completo: horario.empleado.nombre_completo,
                documento: horario.empleado.documento,
                empresa: horario.empleado.empresa,
                tipo_empleado: horario.empleado.tipo_empleado,
                estado: horario.empleado.estado
            },
            fecha_inicio: horario.fecha_inicio,
            fecha_fin: horario.fecha_fin,
            tipo_horario: horario.tipo_horario,
            estado: horario.estado,
            detalles: horario.detalles.map(d => ({
                id_dia_semana: parseInt(d.id_dia_semana),
                hora_inicio: d.hora_inicio,
                hora_fin: d.hora_fin
            }))
        };
        console.log('Horario formateado:', horarioFormateado);
        setHorarioSeleccionado(horarioFormateado);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setHorarioSeleccionado(null);
    };

    const handleSaveEdit = async (formData) => {
        try {
            setLoading(true);
            console.log('Enviando datos al backend:', formData);
            
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/asignacion-horarios/${formData.Id}`,
                formData
            );
            
            if (response.data.success) {
                await fetchHorarios(); // Primero actualizamos los datos
                
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Horario actualizado exitosamente'
                });
                
                handleCloseModal();
            } else {
                throw new Error(response.data.message || 'Error al actualizar el horario');
            }
        } catch (error) {
            console.error('Error al actualizar horario:', error);
            let mensajeError = 'Error al actualizar el horario';
            
            if (error.response?.data?.errores) {
                mensajeError = error.response.data.errores.join('\n');
            } else if (error.response?.data?.message) {
                mensajeError = error.response.data.message;
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeError
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmDelete = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción desactivará el horario seleccionado",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, desactivar',
                cancelButtonText: 'Cancelar'
            });

            if (confirmDelete.isConfirmed) {
                setLoading(true);
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/asignacion-horarios/${id}`);
                
                if (response.data.success) {
                    toast.success('Horario desactivado exitosamente');
                    fetchHorarios();
                } else {
                    toast.error(response.data.message || 'Error al desactivar el horario');
                }
            }
        } catch (error) {
            console.error('Error al desactivar horario:', error);
            toast.error(error.response?.data?.message || 'Error al desactivar el horario');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = `${import.meta.env.VITE_API_URL}/api/asignacion-horarios/template`;
        link.download = 'plantilla_horarios.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Carga Masiva de Horarios</h2>
            
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        disabled={loading}
                    >
                        Descargar Plantilla
                    </Button>
                </div>

                <div className="flex gap-4 items-center">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<FileUploadIcon />}
                            disabled={loading}
                        >
                            Seleccionar Archivo
                        </Button>
                    </label>
                    {file && (
                        <span className="text-sm text-gray-600">
                            Archivo seleccionado: {file.name}
                        </span>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file || loading}
                    >
                        Cargar Archivo
                    </Button>
                </div>

                {uploadProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}
            </div>

            <TableContainer component={Paper} className="mt-6">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Empleado</TableCell>
                            <TableCell>Fecha Inicio</TableCell>
                            <TableCell>Fecha Fin</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Horarios</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : horarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay horarios registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            horarios.map((horario) => (
                                <TableRow key={horario.id}>
                                    <TableCell>{horario.empleado.nombre_completo}</TableCell>
                                    <TableCell>{new Date(horario.fecha_inicio).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(horario.fecha_fin).toLocaleDateString()}</TableCell>
                                    <TableCell>{horario.tipo_horario === 1 ? 'Normal' : 'Rotativo'}</TableCell>
                                    <TableCell>
                                        {horario.detalles.map((detalle, index) => {
                                            console.log('Detalle en tabla:', detalle);
                                            const diaId = parseInt(detalle.id_dia_semana);
                                            const dia = diasSemana.find(d => d.id === diaId);
                                            console.log('Día encontrado en tabla:', dia);
                                            return (
                                                <div key={index} className="text-sm">
                                                    {`${dia?.nombre || `Día ${diaId}`}: ${detalle.hora_inicio} - ${detalle.hora_fin}`}
                                                </div>
                                            );
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEditClick(horario)}
                                            disabled={loading}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(horario.id)}
                                            disabled={loading}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <EditarHorarioModal
                open={modalOpen}
                onClose={handleCloseModal}
                horario={horarioSeleccionado}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

const diasSemana = [
    { id: 1, nombre: 'Domingo' },
    { id: 2, nombre: 'Lunes' },
    { id: 3, nombre: 'Martes' },
    { id: 4, nombre: 'Miércoles' },
    { id: 5, nombre: 'Jueves' },
    { id: 6, nombre: 'Viernes' },
    { id: 7, nombre: 'Sábado' }
];

export default CargaMasivaHorarios; 