import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    // Aquí deberías obtener la información del usuario del estado global o contexto
    const user = {
        Nombre: 'Administrador',
        tipo: 'Administrador'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Navbar user={user} />
            <main className="ml-64 pt-16 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout; 