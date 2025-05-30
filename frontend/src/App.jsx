import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Ciudades from './components/ciudades/Ciudades';
import Empresas from './components/empresas/Empresas';
import Sedes from './components/sedes/Sedes';
import Areas from './components/areas/Areas';
import Empleados from './components/empleados/Empleados';
import Horarios from './components/horarios/Horarios';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Cargando...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ciudades" element={<Ciudades />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/sedes" element={<Sedes />} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/empleados" element={<Empleados />} />
                <Route path="/horarios" element={<Horarios />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
