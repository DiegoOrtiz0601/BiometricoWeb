# Proyecto Biométrico Web

Sistema web de gestión de personal y control de horarios biométricos, desarrollado con Laravel y React. Permite el registro, autenticación y administración de empleados, empresas, horarios y marcaciones, con un diseño moderno y funcional.

---

## 📋 Índice
- [📦 Instalación y Configuración](#-instalación-y-configuración)
- [🌐 Conexión Frontend ↔️ Backend](#-conexión-frontend--backend)
- [🔄 Migraciones y Seeders](#-migraciones-y-seeders)
- [🗂️ Diagrama Relacional (ER Simplificado)](#-diagrama-relacional-er-simplificado)
- [🏛️ Estructura de la Base de Datos](#-estructura-de-la-base-de-datos)
- [⚙️ Funcionalidades del Sistema](#-funcionalidades-del-sistema)

---

## 📦 Instalación y Configuración

### Requisitos
- PHP >= 8.1
- Node.js >= 18
- Composer
- SQL Server o MySQL
- Laravel 10+
- React + Vite

### Backend (Laravel)
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Conexión Frontend ↔️ Backend
- Laravel debe estar sirviendo desde `/api` o tener configurado CORS.
- Axios en el frontend debe apuntar a `http://localhost:8000/api` (configurable por `.env`).
- Autenticación mediante Laravel Sanctum o token JWT.

---

## 🔄 Migraciones y Seeders

Para ejecutar las migraciones y popular la base de datos con información de prueba:
```bash
php artisan migrate --seed
```
Puedes personalizar los seeders en: `database/seeders/`

---

## 🗂️ Diagrama Relacional (ER Simplificado)

```text
Usuario 1 ──── * Empleados
         │
         └──── * Sede

Empresa 1 ──── * Sede ──── * Areas
                        │
                        └─── * Empleados

Empleados 1 ──── * AsignacionHorarios ──── * DetalleHorarios
             │
             └──── * EmpleadosHorarios

TiposMarcacion ─┐
                └── * Marcaciones *──── Empleados

Ciudad ─── * Sede
TiposEmpleado ─── * Empleados
Horario ─── * AsignacionHorarios
```

---
La base de datos esta creada y los siguiente son lo datos de conexion

DB_CONNECTION=sqlsrv
DB_HOST=190.71.223.36
DB_PORT=1433
DB_DATABASE=SegundaDataBaseRegistros_Test
DB_USERNAME=DiegoOrtiz
DB_PASSWORD=1234567890

## 🏛️ Estructura de la Base de Datos

(Basado en el esquema SQL proporcionado. Ver sección anterior para tablas detalladas)

---

## ⚙️ Funcionalidades del Sistema

### 🔐 Inicio de Sesión
- Ingreso mediante correo electrónico y contraseña.
- Validación con Laravel y gestión de sesión por token.

### 🏙️ Gestión de Ciudades
- CRUD completo de ciudades.
- Activación/inactivación de registros.

### 🏢 Gestión de Empresas
- Registro y administración de empresas.
- Relación directa con sedes y empleados.

### 🏣 Gestión de Sedes
- Asociación a empresas y ciudades.
- Control de usuarios responsables por sede.

### 🏬 Gestión de Áreas
- Se agrupan dentro de cada sede.
- Asignables a los empleados.

### 👥 Gestión de Empleados
- Alta de empleados con datos personales, documento, fecha de ingreso y huella biométrica.
- Asociación a empresa, sede, área y usuario del sistema.
- Visualización por estado y filtros.

### ⏱️ Horarios y Asignaciones
- Administración de horarios generales (apertura y cierre).
- Asignación de horarios por empleado (inicio y fin, días específicos).
- Se registra cada asignación como una nueva entrada en `AsignacionHorarios`.
- Cada día asignado se registra en `DetalleHorarios`.
- Soporte para **carga masiva desde Excel** con múltiples empleados.

### 📆 Tipos de Horarios
- Plantillas de turnos: diurno, nocturno, flexible, etc.
- Vinculación a la asignación individual.

### 🛠️ Tipos de Marcación
- Entrada, salida, pausa, retorno, etc.
- Base para control de asistencia.

### 🛑 Registro de Marcaciones
- Captura automática por dispositivo o manual.
- Registro de fecha, hora, tipo, sede y si llegó tarde.

### 📋 Registro Diario
- Panel administrativo para ver ingresos por fecha.
- Incluye columna de validación de puntualidad (`llego_tarde`).

### 📈 Reportes del Sistema

#### 📌 Reporte Huellas
- Muestra la actividad registrada por huelleros en un rango de fechas.
- Filtros por empresa, sede y área.
- Permite exportar resultados a Excel.

#### 📌 Reporte por Empresa
- Consulta completa de marcaciones por empresa.
- Muestra: horas esperadas vs reales, minutos tarde, estados de entrada/salida, empresa y sede.
- Filtros por fechas y empresa.

#### 📌 Reporte por Colaborador
- Permite buscar por documento del colaborador.
- Filtros por empresa, sede y fechas.
- Resultado detallado por día con hora esperada, real, minutos tarde y estado.

### ⚙️ Configuración del Sistema
- Parámetros generales.
- Control de versiones (tabla `VersionSistema`).


