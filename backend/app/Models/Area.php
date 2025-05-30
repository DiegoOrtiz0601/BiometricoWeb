<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'areas';
    protected $fillable = ['nombre', 'id_sede', 'estado'];

    public function sede()
    {
        return $this->belongsTo(Sede::class, 'id_sede');
    }

    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'id_area');
    }
} 