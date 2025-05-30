<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empresa extends Model
{
    protected $table = 'SegundaDataBaseRegistros_Test.dbo.Empresa';
    protected $primaryKey = 'IdEmpresa';
    public $timestamps = false;

    protected $fillable = [
        'IdEmpresa',
        'Nombre',
        'Direccion',
        'Telefono',
        'Estado'
    ];

    // Relación con Empleados
    public function empleados(): HasMany
    {
        return $this->hasMany(Empleado::class, 'IdEmpresa', 'IdEmpresa');
    }
} 