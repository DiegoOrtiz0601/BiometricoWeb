import React from 'react';
import { motion } from 'framer-motion';

const CiudadForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = React.useState({
        Nombre: initialData?.Nombre?.toUpperCase() || '',
        Estado: initialData?.Estado ?? true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            Nombre: formData.Nombre.toUpperCase(),
            Estado: Boolean(formData.Estado)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Estado') {
            setFormData(prev => ({
                ...prev,
                [name]: value === "1"
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value.toUpperCase()
            }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {initialData ? 'Editar Ciudad' : 'Nueva Ciudad'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent uppercase"
                        required
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        name="Estado"
                        value={formData.Estado ? "1" : "0"}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                    >
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-vml-red focus:ring-offset-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-vml-red text-white rounded-md hover:bg-vml-red/90 focus:outline-none focus:ring-2 focus:ring-vml-red focus:ring-offset-2"
                    >
                        {initialData ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default CiudadForm; 