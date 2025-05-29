<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class CiudadController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('Ciudad');
        
        // Búsqueda
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where('Nombre', 'LIKE', "%{$searchTerm}%");
        }

        // Ordenamiento
        $sortField = $request->input('sortField', 'Nombre');
        $sortDirection = $request->input('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginación
        $perPage = $request->input('perPage', 10);
        $ciudades = $query->paginate($perPage);

        // Convertir explícitamente el estado a booleano
        $ciudades->through(function ($ciudad) {
            $ciudad->Estado = (bool) $ciudad->Estado;
            return $ciudad;
        });

        return Response::json($ciudades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $id = DB::table('Ciudad')->insertGetId([
            'Nombre' => $request->Nombre,
            'Estado' => $estado
        ]);

        return Response::json([
            'status' => 'success',
            'message' => 'Ciudad creada exitosamente',
            'data' => ['IdCiudad' => $id]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $updated = DB::table('Ciudad')
            ->where('IdCiudad', $id)
            ->update([
                'Nombre' => $request->Nombre,
                'Estado' => $estado
            ]);

        if (!$updated) {
            return Response::json([
                'status' => 'error',
                'message' => 'Ciudad no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Ciudad actualizada exitosamente'
        ]);
    }

    public function destroy($id)
    {
        $deleted = DB::table('Ciudad')
            ->where('IdCiudad', $id)
            ->delete();

        if (!$deleted) {
            return Response::json([
                'status' => 'error',
                'message' => 'Ciudad no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Ciudad eliminada exitosamente'
        ]);
    }
} 