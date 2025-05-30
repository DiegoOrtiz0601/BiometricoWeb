<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleHorario extends Model
{
    protected $table = 'SegundaDataBaseRegistros_Test.dbo.DetalleHorarios';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'Id',
        'IdAsignacion',
        'DiaSemana',
        'HoraInicio',
        'HoraFin'
    ];

    public function asignacion(): BelongsTo
    {
        return $this->belongsTo(AsignacionHorario::class, 'IdAsignacion', 'Id');
    }
} 