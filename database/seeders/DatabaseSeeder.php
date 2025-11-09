<?php

/**
 * Database Seeder Principal
 * 
 * Orquestra a execução de todos os seeders do sistema.
 * Este é o arquivo executado quando rodamos 'php artisan db:seed'
 * 
 * Localização: database/seeders/DatabaseSeeder.php
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n";
        echo "╔════════════════════════════════════════════╗\n";
        echo "║   SISTEMA DE BUSCA - DATABASE SEEDER      ║\n";
        echo "║   Populando banco de dados com dados      ║\n";
        echo "║   de teste para demonstração              ║\n";
        echo "╚════════════════════════════════════════════╝\n";
        echo "\n";

        // Chama o seeder de registros
        $this->call([
            RegistroSeeder::class,
        ]);

        echo "\n";
        echo "╔════════════════════════════════════════════╗\n";
        echo "║   ✅ DATABASE SEEDING CONCLUÍDO!          ║\n";
        echo "║                                            ║\n";
        echo "║   O banco de dados está pronto para uso!  ║\n";
        echo "║   Acesse: php artisan serve               ║\n";
        echo "╚════════════════════════════════════════════╝\n";
        echo "\n";
    }
}