import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

// Configuración global de axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const Login = () => {
  const [credentials, setCredentials] = useState({
    Correo: '',
    Contrasena: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Intentando obtener CSRF token...');
      await axios.get('/sanctum/csrf-cookie');
      
      console.log('Intentando hacer login...');
      const response = await axios.post('/api/login', credentials);
      console.log('Respuesta del servidor:', response.data);

      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión exitosamente'
        });
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      console.error('Estado de la respuesta:', error.response?.status);
      
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error.response?.data?.message || 
              `Error ${error.response?.status}: ${error.message}` ||
              'Error al iniciar sesión'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-vml-light relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-vml-gray/10 to-vml-red/10" />
      
      {/* Formas geométricas animadas */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md bg-vml-red/5 backdrop-blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: Math.random() * 100 + "vw",
            top: Math.random() * 100 + "vh",
          }}
        />
      ))}

      {/* Formulario de login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-96 relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/vml-logo.png" 
            alt="VML Holding" 
            className="h-12"
          />
        </div>

        <h2 className="text-2xl font-bold text-vml-dark text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-vml-gray text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="Correo"
              value={credentials.Correo}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-vml-gray/20 text-vml-dark placeholder-vml-gray/50 focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-vml-gray text-sm font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="Contrasena"
              value={credentials.Contrasena}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-vml-gray/20 text-vml-dark placeholder-vml-gray/50 focus:outline-none focus:ring-2 focus:ring-vml-red focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-vml-red text-white rounded-lg font-medium hover:bg-vml-red/90 transition-all duration-200 shadow-lg"
            type="submit"
          >
            Ingresar
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login; 