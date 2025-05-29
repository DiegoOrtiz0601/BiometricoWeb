import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './components/Dashboard';

const App = () => {
  // Aquí deberías implementar la lógica para verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ciudades" element={<div>Ciudades</div>} />
          <Route path="empresas" element={<div>Empresas</div>} />
          <Route path="sedes" element={<div>Sedes</div>} />
          <Route path="areas" element={<div>Áreas</div>} />
          <Route path="empleados" element={<div>Empleados</div>} />
          <Route path="horarios" element={<div>Horarios</div>} />
          <Route path="reportes" element={<div>Reportes</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
