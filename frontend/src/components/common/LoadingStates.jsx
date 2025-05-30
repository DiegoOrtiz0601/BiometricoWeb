import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export const LoadingSpinner = () => (
    <FaSpinner className="animate-spin text-4xl text-vml-red" />
);

export const LoadingOverlay = ({ message }) => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    </div>
);

export const TableLoadingRow = ({ colSpan, message = "Cargando datos..." }) => (
    <tr>
        <td colSpan={colSpan} className="px-2 py-8 text-center">
            <div className="flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="text-gray-600 mt-4">{message}</p>
            </div>
        </td>
    </tr>
);

export const EmptyRow = ({ colSpan, message = "No hay datos disponibles" }) => (
    <tr>
        <td colSpan={colSpan} className="px-2 py-8 text-center">
            <p className="text-gray-600">{message}</p>
        </td>
    </tr>
);

export const LoadingButton = ({ children, loading, ...props }) => (
    <button
        {...props}
        disabled={loading || props.disabled}
        className={`relative ${props.className || ''}`}
    >
        {loading && (
            <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
                <FaSpinner className="animate-spin text-current" />
            </span>
        )}
        <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
);

export const SelectWithLoading = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options, 
    isLoading, 
    disabled, 
    placeholder,
    required = true,
    className = ""
}) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
                disabled={disabled || isLoading}
                required={required}
            >
                <option value="">{isLoading ? "Cargando..." : placeholder}</option>
                {!isLoading && options?.map(option => (
                    <option 
                        key={option.id || option.IdEmpresa || option.IdSede || option.IdArea || option.IdCiudad} 
                        value={option.id || option.IdEmpresa || option.IdSede || option.IdArea || option.IdCiudad}
                    >
                        {option.nombre || option.Nombre}
                    </option>
                ))}
            </select>
            {isLoading && (
                <div className="absolute right-3 top-3">
                    <FaSpinner className="animate-spin text-gray-400" />
                </div>
            )}
        </div>
    </div>
); 