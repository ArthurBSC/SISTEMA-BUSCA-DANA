<?php

/**
 * Migration: Criação da tabela de registros
 * 
 * Esta migration cria a tabela principal onde serão armazenados os dados
 * para as buscas. Inclui campos básicos e timestamps.
 * 
 * Localização: database/migrations/2024_01_01_000001_create_registros_table.php
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a migration - cria a tabela
     */
    public function up(): void
    {
        Schema::create('registros', function (Blueprint $table) {
            // ID primário auto-incremento
            $table->id();
            
            // Campos de dados
            $table->string('nome', 100);
            $table->string('email', 150)->unique();
            $table->string('cpf', 14)->unique();
            $table->string('telefone', 20)->nullable();
            $table->string('cidade', 100);
            $table->string('estado', 2);
            $table->date('data_nascimento');
            $table->enum('status', ['ativo', 'inativo'])->default('ativo');
            
            // Campos de controle
            $table->timestamps(); // created_at e updated_at
            $table->softDeletes(); // deleted_at (exclusão lógica)
            
            // Comentário da tabela
            $table->comment('Tabela principal de registros para demonstração de buscas');
        });
    }

    /**
     * Reverte a migration - remove a tabela
     */
    public function down(): void
    {
        Schema::dropIfExists('registros');
    }
};