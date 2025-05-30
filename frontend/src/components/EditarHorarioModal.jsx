import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Checkbox,
    FormControlLabel,
    Paper
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';

// Definición correcta de los días de la semana (Domingo = 1)
const diasSemana = [
    { id: 1, nombre: 'Domingo' },
    { id: 2, nombre: 'Lunes' },
    { id: 3, nombre: 'Martes' },
    { id: 4, nombre: 'Miércoles' },
    { id: 5, nombre: 'Jueves' },
    { id: 6, nombre: 'Viernes' },
    { id: 7, nombre: 'Sábado' }
];

const EditarHorarioModal = ({ open, onClose, horario, onSave }) => {
    const [formData, setFormData] = useState({
        Id: '',
        IdEmpleado: '',
        Nombres: '',
        Apellidos: '',
        Documento: '',
        Empresa: '',
        Tipo: '',
        Estado: true,
        FechaInicio: null,
        FechaFin: null,
        TipoHorario: 1,
        diasSeleccionados: {
            1: false, // Domingo
            2: false, // Lunes
            3: false, // Martes
            4: false, // Miércoles
            5: false, // Jueves
            6: false, // Viernes
            7: false  // Sábado
        },
        horarios: {}
    });

    useEffect(() => {
        if (horario) {
            console.log('Horario recibido para edición:', horario);
            const diasSeleccionados = {
                1: false, // Domingo
                2: false, // Lunes
                3: false, // Martes
                4: false, // Miércoles
                5: false, // Jueves
                6: false, // Viernes
                7: false  // Sábado
            };
            const horariosNuevos = {};

            // Mapear los detalles existentes
            horario.detalles?.forEach(detalle => {
                // Asegurarnos de que el ID del día sea un número
                const diaId = parseInt(detalle.DiaSemana || detalle.id_dia_semana);
                console.log(`Procesando detalle - Día ID original: ${diaId}`);

                if (diaId >= 1 && diaId <= 7) {
                    diasSeleccionados[diaId] = true;
                    horariosNuevos[diaId] = {
                        entrada: detalle.HoraInicio || detalle.hora_inicio,
                        salida: detalle.HoraFin || detalle.hora_fin
                    };
                    console.log(`Día ${diasSemana.find(d => d.id === diaId)?.nombre} (ID: ${diaId}) configurado con horario:`, horariosNuevos[diaId]);
                } else {
                    console.warn(`ID de día inválido encontrado: ${diaId}`);
                }
            });

            // Determinar el tipo de horario basado en el tipo de empleado
            let tipoHorario;
            switch(horario.empleado?.tipo_empleado?.toUpperCase()) {
                case 'ENROLADO NO MARCA':
                    tipoHorario = 1;
                    break;
                case 'ENROLADO ROTATIVO':
                    tipoHorario = 2;
                    break;
                default:
                    tipoHorario = 1;
            }

            setFormData({
                Id: horario.id,
                IdEmpleado: horario.empleado?.id,
                Nombres: horario.empleado?.nombre_completo?.split(' ')[0] || '',
                Apellidos: horario.empleado?.nombre_completo?.split(' ').slice(1).join(' ') || '',
                Documento: horario.empleado?.documento,
                Empresa: horario.empleado?.empresa,
                Tipo: horario.empleado?.tipo_empleado,
                Estado: horario.estado === "1" || horario.estado === true,
                FechaInicio: new Date(horario.fecha_inicio),
                FechaFin: new Date(horario.fecha_fin),
                TipoHorario: tipoHorario,
                diasSeleccionados: diasSeleccionados,
                horarios: horariosNuevos
            });
        }
    }, [horario]);

    const handleDiaChange = (diaId) => {
        console.log(`Cambiando estado del día ${diasSemana.find(d => d.id === diaId)?.nombre} (ID: ${diaId})`);
        setFormData(prev => ({
            ...prev,
            diasSeleccionados: {
                ...prev.diasSeleccionados,
                [diaId]: !prev.diasSeleccionados[diaId]
            },
            horarios: {
                ...prev.horarios,
                [diaId]: prev.diasSeleccionados[diaId] ? prev.horarios[diaId] : {
                    entrada: '08:00',
                    salida: '17:00'
                }
            }
        }));
    };

    const handleHorarioChange = (diaId, tipo, valor) => {
        console.log(`Actualizando horario para ${diasSemana.find(d => d.id === diaId)?.nombre} (ID: ${diaId}): ${tipo} = ${valor}`);
        setFormData(prev => ({
            ...prev,
            horarios: {
                ...prev.horarios,
                [diaId]: {
                    ...prev.horarios[diaId],
                    [tipo]: valor
                }
            }
        }));
    };

    const handleSubmit = () => {
        // Validar que haya al menos un día seleccionado
        const hayDiasSeleccionados = Object.values(formData.diasSeleccionados).some(dia => dia);
        if (!hayDiasSeleccionados) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debe seleccionar al menos un día'
            });
            return;
        }

        // Validar que todos los días seleccionados tengan horarios válidos
        const horariosValidos = Object.entries(formData.diasSeleccionados)
            .filter(([_, seleccionado]) => seleccionado)
            .every(([diaId]) => {
                const horario = formData.horarios[diaId];
                return horario && horario.entrada && horario.salida;
            });

        if (!horariosValidos) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Todos los días seleccionados deben tener horarios de entrada y salida'
            });
            return;
        }

        // Crear array de detalles solo con los días seleccionados
        const detalles = Object.entries(formData.diasSeleccionados)
            .filter(([_, seleccionado]) => seleccionado)
            .map(([diaId]) => {
                const dia = parseInt(diaId);
                console.log(`Preparando detalle para ${diasSemana.find(d => d.id === dia)?.nombre} (ID: ${dia})`);
                return {
                    DiaSemana: dia,
                    HoraInicio: formData.horarios[dia].entrada,
                    HoraFin: formData.horarios[dia].salida
                };
            });

        console.log('Detalles finales a enviar:', detalles.map(d => ({
            ...d,
            nombreDia: diasSemana.find(dia => dia.id === d.DiaSemana)?.nombre
        })));

        const datosActualizados = {
            Id: formData.Id,
            IdEmpleado: formData.IdEmpleado,
            FechaInicio: formData.FechaInicio,
            FechaFin: formData.FechaFin,
            TipoHorario: parseInt(formData.TipoHorario),
            Estado: formData.Estado ? 1 : 0,
            Detalles: detalles
        };

        console.log('Datos completos a enviar:', datosActualizados);
        onSave(datosActualizados);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Editar Horario</DialogTitle>
            <DialogContent>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                            <div className="mb-2">
                                <Typography variant="body2">
                                    <strong>Nombre:</strong> {formData.Nombres} {formData.Apellidos}
                                </Typography>
                            </div>
                            <div className="mb-2">
                                <Typography variant="body2">
                                    <strong>Empresa:</strong> {formData.Empresa}
                                </Typography>
                            </div>
                            <div className="mb-2">
                                <Typography variant="body2">
                                    <strong>Estado:</strong> {formData.Estado ? 'Activo' : 'Inactivo'}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid xs={12} md={6}>
                            <div className="mb-2">
                                <Typography variant="body2">
                                    <strong>Documento:</strong> {formData.Documento}
                                </Typography>
                            </div>
                            <div className="mb-2">
                                <Typography variant="body2">
                                    <strong>Tipo:</strong> {formData.Tipo}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha Inicio"
                                value={formData.FechaInicio}
                                onChange={(newValue) => setFormData(prev => ({ ...prev, FechaInicio: newValue }))}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha Fin"
                                value={formData.FechaFin}
                                onChange={(newValue) => setFormData(prev => ({ ...prev, FechaFin: newValue }))}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Horario</InputLabel>
                            <Select
                                value={formData.TipoHorario}
                                onChange={(e) => setFormData(prev => ({ ...prev, TipoHorario: e.target.value }))}
                                label="Tipo de Horario"
                                disabled={true}
                            >
                                <MenuItem value={1}>ENROLADO NO MARCA</MenuItem>
                                <MenuItem value={2}>ENROLADO ROTATIVO</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="caption" color="textSecondary" className="mt-1">
                            El tipo de horario se determina automáticamente según el tipo de empleado
                        </Typography>
                    </Grid>
                </Grid>

                <div className="mt-4">
                    <Typography variant="subtitle1" gutterBottom>
                        Configuración de Horarios por Día
                    </Typography>
                    {diasSemana.map((dia) => (
                        <div key={dia.id} className="mb-2 p-2 border rounded">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.diasSeleccionados[dia.id]}
                                        onChange={() => handleDiaChange(dia.id)}
                                    />
                                }
                                label={`${dia.nombre} (ID: ${dia.id})`}
                            />
                            {formData.diasSeleccionados[dia.id] && (
                                <div className="ml-4 mt-2">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Entrada"
                                                type="time"
                                                value={formData.horarios[dia.id]?.entrada || ''}
                                                onChange={(e) => handleHorarioChange(dia.id, 'entrada', e.target.value)}
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Salida"
                                                type="time"
                                                value={formData.horarios[dia.id]?.salida || ''}
                                                onChange={(e) => handleHorarioChange(dia.id, 'salida', e.target.value)}
                                                fullWidth
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    Actualizar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditarHorarioModal; 