<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class SedeController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('Sede')
            ->join('Empresa', 'Sede.IdEmpresa', '=', 'Empresa.IdEmpresa')
            ->join('Ciudad', 'Sede.IdCiudad', '=', 'Ciudad.IdCiudad')
            ->select(
                'Sede.*',
                'Empresa.Nombre as NombreEmpresa',
                'Ciudad.Nombre as NombreCiudad'
            );
        
        // Búsqueda
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('Sede.Nombre', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Empresa.Nombre', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Ciudad.Nombre', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Ordenamiento
        $sortField = $request->input('sortField', 'Sede.Nombre');
        $sortDirection = $request->input('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginación
        $perPage = $request->input('perPage', 10);
        $sedes = $query->paginate($perPage);

        return Response::json($sedes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'IdEmpresa' => 'required|integer|exists:Empresa,IdEmpresa',
            'IdCiudad' => 'required|integer|exists:Ciudad,IdCiudad',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $id = DB::table('Sede')->insertGetId([
            'Nombre' => strtoupper($request->Nombre),
            'IdEmpresa' => $request->IdEmpresa,
            'IdCiudad' => $request->IdCiudad,
            'Estado' => $estado,
            'IdUsuario' => 1 // Temporal, deberá ser reemplazado por el usuario autenticado
        ]);

        return Response::json([
            'status' => 'success',
            'message' => 'Sede creada exitosamente',
            'data' => ['IdSede' => $id]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'IdEmpresa' => 'required|integer|exists:Empresa,IdEmpresa',
            'IdCiudad' => 'required|integer|exists:Ciudad,IdCiudad',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $updated = DB::table('Sede')
            ->where('IdSede', $id)
            ->update([
                'Nombre' => strtoupper($request->Nombre),
                'IdEmpresa' => $request->IdEmpresa,
                'IdCiudad' => $request->IdCiudad,
                'Estado' => $estado,
                'IdUsuario' => 1 // Temporal, deberá ser reemplazado por el usuario autenticado
            ]);

        if (!$updated) {
            return Response::json([
                'status' => 'error',
                'message' => 'Sede no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Sede actualizada exitosamente'
        ]);
    }

    public function destroy($id)
    {
        $deleted = DB::table('Sede')
            ->where('IdSede', $id)
            ->delete();

        if (!$deleted) {
            return Response::json([
                'status' => 'error',
                'message' => 'Sede no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Sede eliminada exitosamente'
        ]);
    }

    public function getEmpresas()
    {
        $empresas = DB::table('Empresa')
            ->where('Estado', true)
            ->select('IdEmpresa', 'Nombre')
            ->orderBy('Nombre')
            ->get();

        return Response::json($empresas);
    }

    public function getCiudades()
    {
        $ciudades = DB::table('Ciudad')
            ->where('Estado', true)
            ->select('IdCiudad', 'Nombre')
            ->orderBy('Nombre')
            ->get();

        return Response::json($ciudades);
    }
} 