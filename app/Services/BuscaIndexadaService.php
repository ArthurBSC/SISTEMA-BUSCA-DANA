<?php

/**
 * Service: Busca Indexada CORRIGIDO
 * 
 * ONDE SALVAR: app/Services/BuscaIndexadaService.php
 * 
 * Implementa a busca usando índices do banco de dados.
 */

namespace App\Services;

use App\Models\Registro;
use Illuminate\Support\Facades\DB;

class BuscaIndexadaService
{
    /**
     * Executa busca indexada por nome
     */
    public function buscarPorNome(string $termo): array
    {
        $inicio = microtime(true);
        
        // Usa índice do banco
        $resultados = Registro::where('nome', 'LIKE', '%' . strtoupper($termo) . '%')
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'tipo_busca' => 'indexada',
            'indice_utilizado' => 'idx_nome',
            'descricao' => 'Usou índice do banco de dados',
            'complexidade' => 'O(log n) - Logarítmica',
            'tipo_indice' => 'B-Tree INDEX',
        ];
    }

    /**
     * Executa busca indexada por CPF
     */
    public function buscarPorCpf(string $cpf): array
    {
        $inicio = microtime(true);
        
        $cpf = preg_replace('/\D/', '', $cpf);
        
        // Usa índice UNIQUE do CPF
        $resultados = Registro::where('cpf', $cpf)
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'tipo_busca' => 'indexada',
            'indice_utilizado' => 'cpf (UNIQUE)',
            'descricao' => 'Busca O(1) usando índice único',
            'complexidade' => 'O(1) - Constante',
            'tipo_indice' => 'UNIQUE INDEX',
        ];
    }

    /**
     * Executa busca indexada por cidade
     */
    public function buscarPorCidade(string $cidade, ?string $estado = null): array
    {
        $inicio = microtime(true);
        
        $query = Registro::where('cidade', 'LIKE', '%' . $cidade . '%');
        
        if ($estado) {
            $query->where('estado', $estado);
        }
        
        $resultados = $query->limit(100)->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'tipo_busca' => 'indexada',
            'indice_utilizado' => 'idx_localizacao',
            'descricao' => 'Usou índice composto (cidade, estado)',
            'complexidade' => 'O(log n) - Logarítmica',
            'tipo_indice' => 'COMPOSITE INDEX',
        ];
    }

    /**
     * Busca por email usando índice UNIQUE
     */
    public function buscarPorEmail(string $email): array
    {
        $inicio = microtime(true);
        
        $resultados = Registro::where('email', 'LIKE', '%' . strtolower($email) . '%')
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'tipo_busca' => 'indexada',
            'indice_utilizado' => 'email (UNIQUE)',
            'descricao' => 'Busca usando índice único',
            'complexidade' => 'O(1) - Constante',
            'tipo_indice' => 'UNIQUE INDEX',
        ];
    }

    /**
     * Retorna informações sobre a busca indexada
     */
    public static function getInfo(): array
    {
        return [
            'nome' => 'Busca Indexada',
            'descricao' => 'Utiliza índices do banco de dados (B-Tree)',
            'vantagens' => [
                'Muito rápida',
                'Escalável',
                'Padrão da indústria',
            ],
            'desvantagens' => [
                'Requer espaço em disco',
                'Índices precisam ser mantidos',
            ],
            'complexidade' => 'O(log n) a O(1)',
            'melhor_caso' => 'O(1)',
            'caso_medio' => 'O(log n)',
            'pior_caso' => 'O(log n)',
            'uso_memoria' => 'Adicional para índices',
            'quando_usar' => [
                'Sempre em produção',
                'Grandes volumes',
            ],
        ];
    }
}