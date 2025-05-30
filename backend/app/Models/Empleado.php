<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Empleado extends Model
{
    protected $table = 'SegundaDataBaseRegistros_Test.dbo.Empleados';
    protected $primaryKey = 'IdEmpleado';
    public $timestamps = false;

    protected $fillable = [
        'IdEmpleado',
        'Nombres',
        'Apellidos',
        'Documento',
        'IdEmpresa',
        'Huella',
        'Estado',
        'FechaIngreso',
        'IdSede',
        'IdArea',
        'IdUsuario',
        'IdTipoEmpleado'
    ];

    // Relación con AsignacionHorario
    public function horarios(): HasMany
    {
        return $this->hasMany(AsignacionHorario::class, 'IdEmpleado', 'IdEmpleado');
    }

    // Relación con Empresa
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(Empresa::class, 'IdEmpresa', 'IdEmpresa');
    }

    // Relación con TipoEmpleado
    public function tipoEmpleado(): BelongsTo
    {
        return $this->belongsTo(TipoEmpleado::class, 'IdTipoEmpleado', 'id');
    }

    // Accessor para obtener el nombre completo
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->Nombres} {$this->Apellidos}";
    }
} 