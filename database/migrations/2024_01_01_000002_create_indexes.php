<?php

/**
 * Migration: Criação de índices para otimização de buscas
 * 
 * Esta migration adiciona índices nas colunas mais utilizadas nas buscas.
 * Os índices melhoram drasticamente a performance das consultas.
 * 
 * Tipos de índices:
 * - INDEX: Para buscas comuns (WHERE, ORDER BY)
 * - UNIQUE: Garante unicidade e melhora busca
 * - FULLTEXT: Para buscas textuais (MATCH AGAINST)
 * 
 * Localização: database/migrations/2024_01_01_000002_create_indexes.php
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Executa a migration - cria os índices
     */
    public function up(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            // Índice composto para busca por nome e email
            // Útil para buscas que filtram por ambos
            $table->index(['nome', 'email'], 'idx_nome_email');
            
            // Índice para busca por cidade e estado
            $table->index(['cidade', 'estado'], 'idx_localizacao');
            
            // Índice para busca por status
            $table->index('status', 'idx_status');
            
            // Índice para busca por data de nascimento
            $table->index('data_nascimento', 'idx_data_nascimento');
            
            // Índice para busca por telefone
            $table->index('telefone', 'idx_telefone');
        });
        
        // Criar índice FULLTEXT para busca textual em nome
        // Permite buscas mais flexíveis (ex: buscar parte do nome)
        DB::statement('CREATE FULLTEXT INDEX idx_fulltext_nome ON registros(nome)');
    }

    /**
     * Reverte a migration - remove os índices
     */
    public function down(): void
    {
        Schema::table('registros', function (Blueprint $table) {
            // Remove índices compostos
            $table->dropIndex('idx_nome_email');
            $table->dropIndex('idx_localizacao');
            $table->dropIndex('idx_status');
            $table->dropIndex('idx_data_nascimento');
            $table->dropIndex('idx_telefone');
        });
        
        // Remove índice FULLTEXT
        DB::statement('DROP INDEX idx_fulltext_nome ON registros');
    }
};