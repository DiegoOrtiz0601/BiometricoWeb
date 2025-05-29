import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUserLine, RiSettings4Line, RiLogoutBoxLine } from 'react-icons/ri';
import axios from 'axios';
import Swal from 'sweetalert2';

const Navbar = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            localStorage.removeItem('token');
            window.location.reload();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cerrar sesión'
            });
        }
    };

    return (
        <div className="bg-white shadow-md fixed top-0 right-0 left-64 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end h-16">
                    <div className="flex items-center relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-vml-red text-white flex items-center justify-center">
                                <RiUserLine />
                            </div>
                            <span className="hidden md:block">Usuario</span>
                        </button>

                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                                >
                                    <button
                                        className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200"
                                        onClick={() => {/* Implementar configuración */}}
                                    >
                                        <RiSettings4Line className="text-gray-500" />
                                        <span>Configuración</span>
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200 text-red-600"
                                        onClick={handleLogout}
                                    >
                                        <RiLogoutBoxLine />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar; 