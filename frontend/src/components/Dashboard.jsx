import React from 'react';
import { motion } from 'framer-motion';
import { RiTeamLine, RiBuilding2Line, RiMapPinLine } from 'react-icons/ri';

const DashboardCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white p-6 rounded-lg shadow-md"
    >
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
            <Icon className="text-2xl text-white" />
        </div>
        <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    icon={RiTeamLine}
                    title="Total Empleados"
                    value="1,234"
                    color="bg-vml-red"
                />
                <DashboardCard
                    icon={RiBuilding2Line}
                    title="Total Empresas"
                    value="45"
                    color="bg-blue-500"
                />
                <DashboardCard
                    icon={RiMapPinLine}
                    title="Ciudades"
                    value="12"
                    color="bg-green-500"
                />
            </div>

            {/* Aquí puedes agregar más secciones del dashboard como gráficas, tablas, etc. */}
        </div>
    );
};

export default Dashboard; 