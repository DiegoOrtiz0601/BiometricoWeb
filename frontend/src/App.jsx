import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Ciudades from './components/ciudades/Ciudades';
import Empresas from './components/empresas/Empresas';
import Sedes from './components/sedes/Sedes';
import Areas from './components/areas/Areas';
import Empleados from './components/empleados/Empleados';

function App() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ciudades" element={<Ciudades />} />
                    <Route path="/empresas" element={<Empresas />} />
                    <Route path="/sedes" element={<Sedes />} />
                    <Route path="/areas" element={<Areas />} />
                    <Route path="/empleados" element={<Empleados />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
