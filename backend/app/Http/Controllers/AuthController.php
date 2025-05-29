<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'Correo' => 'required|email',
            'Contrasena' => 'required'
        ]);

        $user = User::where('Correo', $credentials['Correo'])
                    ->where('Contrasena', $credentials['Contrasena'])
                    ->first();

        if ($user) {
            Auth::login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            return Response::json([
                'status' => 'success',
                'token' => $token,
                'user' => $user
            ]);
        }

        return Response::json([
            'status' => 'error',
            'message' => 'Credenciales inválidas'
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::user()->tokens()->delete();
        
        return Response::json([
            'status' => 'success',
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }
} 