<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Area', function (Blueprint $table) {
            $table->id('IdArea');
            $table->unsignedBigInteger('IdSede');
            $table->string('Nombre', 255);
            $table->boolean('Estado')->default(true);
            $table->unsignedBigInteger('IdUsuario');
            $table->timestamps();

            $table->foreign('IdSede')->references('IdSede')->on('Sede');
            $table->foreign('IdUsuario')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Area');
    }
}; 