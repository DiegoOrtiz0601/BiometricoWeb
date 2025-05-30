<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    use HasFactory;

    protected $table = 'sedes';
    protected $fillable = ['nombre', 'id_empresa', 'estado'];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa');
    }

    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'id_sede');
    }
} 