<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'Usuario';
    protected $primaryKey = 'IdUsuario';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'NombreUsuario',
        'Nombre',
        'Contrasena',
        'FechaCreacion',
        'Correo',
        'estado',
        'App'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'Contrasena',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'FechaCreacion' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return null;
    }

    public function getEmailForPasswordReset()
    {
        return $this->Correo;
    }

    public function getAuthIdentifierName()
    {
        return 'Correo';
    }

    public function getAuthIdentifier()
    {
        return $this->Correo;
    }

    public function username()
    {
        return 'NombreUsuario';
    }
}
