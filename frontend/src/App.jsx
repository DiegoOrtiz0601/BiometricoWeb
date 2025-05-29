import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login';
import Ciudades from './components/ciudades/Ciudades';
import Empresas from './components/empresas/Empresas';
import Sedes from './components/sedes/Sedes';

function App() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/ciudades" replace />} />
                    <Route path="/ciudades" element={<Ciudades />} />
                    <Route path="/empresas" element={<Empresas />} />
                    <Route path="/sedes" element={<Sedes />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
