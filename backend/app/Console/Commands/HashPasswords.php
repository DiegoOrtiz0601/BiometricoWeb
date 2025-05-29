<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class HashPasswords extends Command
{
    protected $signature = 'passwords:hash';
    protected $description = 'Hashea las contraseñas existentes con bcrypt';

    public function handle()
    {
        $this->info('Iniciando proceso de hash de contraseñas...');

        $usuarios = DB::table('Usuario')->get();
        $count = 0;

        foreach ($usuarios as $usuario) {
            // Solo hashear si la contraseña no parece estar ya hasheada
            if (strlen($usuario->Contrasena) < 40) {
                DB::table('Usuario')
                    ->where('IdUsuario', $usuario->IdUsuario)
                    ->update(['Contrasena' => Hash::make($usuario->Contrasena)]);
                $count++;
            }
        }

        $this->info("Se hashearon {$count} contraseñas exitosamente.");
    }
} 