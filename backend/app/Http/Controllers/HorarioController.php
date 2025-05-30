<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class HorarioController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('AsignacionHorarios')
            ->join('Empleados', 'AsignacionHorarios.IdEmpleado', '=', 'Empleados.IdEmpleado')
            ->join('Empresa', 'Empleados.IdEmpresa', '=', 'Empresa.IdEmpresa')
            ->join('Sede', 'Empleados.IdSede', '=', 'Sede.IdSede')
            ->join('Areas', 'Empleados.IdArea', '=', 'Areas.IdArea')
            ->join('tipos_empleado', 'Empleados.IdTipoEmpleado', '=', 'tipos_empleado.id')
            ->select(
                'AsignacionHorarios.Id',
                'AsignacionHorarios.IdEmpleado',
                'AsignacionHorarios.FechaInicio',
                'AsignacionHorarios.FechaFin',
                'AsignacionHorarios.FechaCreacion',
                'AsignacionHorarios.TipoHorario',
                'AsignacionHorarios.Estado',
                'Empleados.Nombres as NombreEmpleado',
                'Empleados.Apellidos',
                'Empleados.Documento',
                'Empresa.Nombre as NombreEmpresa',
                'Sede.Nombre as NombreSede',
                'Areas.Nombre as NombreArea',
                'tipos_empleado.nombre as TipoEmpleado'
            )
            ->where('AsignacionHorarios.Estado', true);

        // Búsqueda por nombre, apellido o documento del empleado
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('Empleados.Nombres', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('Empleados.Apellidos', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('Empleados.Documento', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Ordenamiento
        $sortField = $request->input('sortField', 'AsignacionHorarios.FechaInicio');
        $sortDirection = $request->input('sortDirection', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginación
        $perPage = $request->input('perPage', 10);
        $horarios = $query->paginate($perPage);

        return response()->json($horarios);
    }
}
