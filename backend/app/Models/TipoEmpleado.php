<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoEmpleado extends Model
{
    protected $table = 'SegundaDataBaseRegistros_Test.dbo.tipos_empleado';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nombre',
        'estado'
    ];

    // Relación con Empleados
    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'IdTipoEmpleado', 'id');
    }
} 