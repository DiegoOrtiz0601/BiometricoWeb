<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SedeController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    
    // Rutas de Ciudades
    Route::get('ciudades', [CiudadController::class, 'index']);
    Route::post('ciudades', [CiudadController::class, 'store']);
    Route::put('ciudades/{id}', [CiudadController::class, 'update']);
    Route::delete('ciudades/{id}', [CiudadController::class, 'destroy']);

    // Rutas de Empresas
    Route::get('empresas', [EmpresaController::class, 'index']);
    Route::post('empresas', [EmpresaController::class, 'store']);
    Route::put('empresas/{id}', [EmpresaController::class, 'update']);
    Route::delete('empresas/{id}', [EmpresaController::class, 'destroy']);

    // Rutas para Sedes
    Route::get('/sedes', [SedeController::class, 'index']);
    Route::post('/sedes', [SedeController::class, 'store']);
    Route::put('/sedes/{id}', [SedeController::class, 'update']);
    Route::delete('/sedes/{id}', [SedeController::class, 'destroy']);
    Route::get('/sedes/empresas', [SedeController::class, 'getEmpresas']);
    Route::get('/sedes/ciudades', [SedeController::class, 'getCiudades']);
}); 