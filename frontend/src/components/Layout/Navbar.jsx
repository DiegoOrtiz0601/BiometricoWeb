import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiUserLine, RiLogoutBoxLine, RiSettings4Line } from 'react-icons/ri';

const Navbar = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        // Implementar lógica de logout
    };

    return (
        <div className="bg-white h-16 fixed top-0 right-0 left-64 shadow-sm z-10">
            <div className="h-full px-6 flex items-center justify-end">
                <div className="relative">
                    <motion.button
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setShowDropdown(!showDropdown)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-gray-700">{user?.Nombre || 'Usuario'}</span>
                        <div className="w-10 h-10 rounded-full bg-vml-red/10 flex items-center justify-center">
                            <RiUserLine className="text-xl text-vml-red" />
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {showDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
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
    );
};

export default Navbar; 