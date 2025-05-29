<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\SedeController;
use App\Http\Controllers\AreaController;

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
    Route::get('empresas/activas', [EmpresaController::class, 'getActivas']);

    // Rutas para Sedes
    Route::get('/sedes', [SedeController::class, 'index']);
    Route::post('/sedes', [SedeController::class, 'store']);
    Route::put('/sedes/{id}', [SedeController::class, 'update']);
    Route::delete('/sedes/{id}', [SedeController::class, 'destroy']);
    Route::get('/sedes/empresas', [SedeController::class, 'getEmpresas']);
    Route::get('/sedes/ciudades', [SedeController::class, 'getCiudades']);
    Route::get('/sedes/empresa/{idEmpresa}', [SedeController::class, 'getSedesPorEmpresa']);

    // Rutas para Áreas
    Route::get('/areas', [AreaController::class, 'index']);
    Route::post('/areas', [AreaController::class, 'store']);
    Route::put('/areas/{id}', [AreaController::class, 'update']);
    Route::delete('/areas/{id}', [AreaController::class, 'destroy']);
    Route::get('/areas/sedes', [AreaController::class, 'getSedes']);
}); 