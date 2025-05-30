<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('Empleados')
            ->join('tipos_empleado', 'Empleados.IdTipoEmpleado', '=', 'tipos_empleado.id')
            ->join('Empresa', 'Empleados.IdEmpresa', '=', 'Empresa.IdEmpresa')
            ->join('Sede', 'Empleados.IdSede', '=', 'Sede.IdSede')
            ->join('Areas', 'Empleados.IdArea', '=', 'Areas.IdArea')
            ->select(
                'Empleados.IdEmpleado',
                'Empleados.Nombres',
                'Empleados.Apellidos',
                'Empleados.Documento',
                'Empleados.Estado',
                'Empleados.FechaIngreso',
                'Empleados.IdEmpresa',
                'Empleados.IdSede',
                'Empleados.IdArea',
                'Empleados.IdTipoEmpleado',
                'Empresa.Nombre as NombreEmpresa',
                'Sede.Nombre as NombreSede',
                'Areas.Nombre as NombreArea',
                'tipos_empleado.nombre as TipoEmpleado'
            );

        // Búsqueda
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('Empleados.Nombres', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Empleados.Apellidos', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('Empleados.Documento', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Ordenamiento
        $sortField = $request->input('sortField', 'Empleados.Nombres');
        $sortDirection = $request->input('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Paginación
        $perPage = $request->input('perPage', 10);
        $empleados = $query->paginate($perPage);

        return Response::json($empleados);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Nombres' => 'required|string|max:255',
            'Apellidos' => 'required|string|max:255',
            'Documento' => 'required|string|max:20',
            'IdEmpresa' => 'required|integer|exists:Empresa,IdEmpresa',
            'IdSede' => 'required|integer|exists:Sede,IdSede',
            'IdArea' => 'required|integer|exists:Areas,IdArea',
            'IdTipoEmpleado' => 'required|integer|exists:tipos_empleado,id',
            'Estado' => 'required|boolean',
            'FechaIngreso' => 'required|date'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $id = DB::table('Empleados')->insertGetId([
            'Nombres' => strtoupper($request->Nombres),
            'Apellidos' => strtoupper($request->Apellidos),
            'Documento' => $request->Documento,
            'IdEmpresa' => $request->IdEmpresa,
            'IdSede' => $request->IdSede,
            'IdArea' => $request->IdArea,
            'IdTipoEmpleado' => $request->IdTipoEmpleado,
            'Estado' => $estado,
            'FechaIngreso' => $request->FechaIngreso,
            'IdUsuario' => 1 // Temporal, deberá ser reemplazado por el usuario autenticado
        ]);

        return Response::json([
            'status' => 'success',
            'message' => 'Empleado creado exitosamente',
            'data' => ['IdEmpleado' => $id]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'Nombres' => 'required|string|max:255',
            'Apellidos' => 'required|string|max:255',
            'Documento' => 'required|string|max:20',
            'IdEmpresa' => 'required|integer|exists:Empresa,IdEmpresa',
            'IdSede' => 'required|integer|exists:Sede,IdSede',
            'IdArea' => 'required|integer|exists:Areas,IdArea',
            'IdTipoEmpleado' => 'required|integer|exists:tipos_empleado,id',
            'Estado' => 'required|boolean',
            'FechaIngreso' => 'required|date'
        ]);

        // Aseguramos que Estado sea booleano
        $estado = filter_var($request->Estado, FILTER_VALIDATE_BOOLEAN);

        $updated = DB::table('Empleados')
            ->where('IdEmpleado', $id)
            ->update([
                'Nombres' => strtoupper($request->Nombres),
                'Apellidos' => strtoupper($request->Apellidos),
                'Documento' => $request->Documento,
                'IdEmpresa' => $request->IdEmpresa,
                'IdSede' => $request->IdSede,
                'IdArea' => $request->IdArea,
                'IdTipoEmpleado' => $request->IdTipoEmpleado,
                'Estado' => $estado,
                'FechaIngreso' => $request->FechaIngreso,
                'IdUsuario' => 1 // Temporal, deberá ser reemplazado por el usuario autenticado
            ]);

        if (!$updated) {
            return Response::json([
                'status' => 'error',
                'message' => 'Empleado no encontrado'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Empleado actualizado exitosamente'
        ]);
    }

    public function destroy($id)
    {
        $deleted = DB::table('Empleados')
            ->where('IdEmpleado', $id)
            ->delete();

        if (!$deleted) {
            return Response::json([
                'status' => 'error',
                'message' => 'Empleado no encontrado'
            ], 404);
        }

        return Response::json([
            'status' => 'success',
            'message' => 'Empleado eliminado exitosamente'
        ]);
    }

    public function getTiposEmpleado()
    {
        $tipos = DB::table('tipos_empleado')
            ->where('estado', true)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Response::json([
            'status' => 'success',
            'data' => $tipos
        ]);
    }
} 