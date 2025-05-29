<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class EmpresaController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('Empresa');
        
        // Búsqueda
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('Nombre', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Direccion', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Telefono', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Ordenamiento
        $sortField = $request->input('sortField', 'Nombre');
        $sortDirection = $request->input('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginación
        $perPage = $request->input('perPage', 10);
        $empresas = $query->paginate($perPage);

        // Convertir explícitamente el estado a booleano
        $empresas->through(function ($empresa) {
            $empresa->Estado = (bool) $empresa->Estado;
            return $empresa;
        });

        return Response::json($empresas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Direccion' => 'required|string|max:255',
            'Telefono' => 'required|string|max:20',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $id = DB::table('Empresa')->insertGetId([
            'Nombre' => $request->Nombre,
            'Direccion' => $request->Direccion,
            'Telefono' => $request->Telefono,
            'Estado' => $estado
        ]);

        return Response::json([
            'status' => 'success',
            'message' => 'Empresa creada exitosamente',
            'data' => ['IdEmpresa' => $id]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'Nombre' => 'required|string|max:255',
            'Direccion' => 'required|string|max:255',
            'Telefono' => 'required|string|max:20',
            'Estado' => 'required|boolean'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $updated = DB::table('Empresa')
            ->where('IdEmpresa', $id)
            ->update([
                'Nombre' => $request->Nombre,
                'Direccion' => $request->Direccion,
                'Telefono' => $request->Telefono,
                'Estado' => $estado
            ]);

        if (!$updated) {
            return Response::json([
                'status' => 'error',
                'message' => 'Empresa no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Empresa actualizada exitosamente'
        ]);
    }

    public function destroy($id)
    {
        $deleted = DB::table('Empresa')
            ->where('IdEmpresa', $id)
            ->delete();

        if (!$deleted) {
            return Response::json([
                'status' => 'error',
                'message' => 'Empresa no encontrada'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Empresa eliminada exitosamente'
        ]);
    }
} 