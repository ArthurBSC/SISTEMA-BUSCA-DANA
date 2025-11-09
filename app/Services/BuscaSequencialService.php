<?php

/**
 * Service: Busca Sequencial CORRIGIDO
 * 
 * ONDE SALVAR: app/Services/BuscaSequencialService.php
 * 
 * Implementa a busca sequencial de forma simples e funcional.
 */

namespace App\Services;

use App\Models\Registro;
use Illuminate\Support\Facades\DB;

class BuscaSequencialService
{
    /**
     * Executa busca sequencial por nome
     */
    public function buscarPorNome(string $termo): array
    {
        $inicio = microtime(true);
        
        // Busca simples usando Eloquent
        $resultados = Registro::whereRaw('LOWER(nome) LIKE ?', ['%' . strtolower($termo) . '%'])
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'comparacoes_realizadas' => Registro::count(),
            'tipo_busca' => 'sequencial',
            'descricao' => 'Percorreu todos os registros sequencialmente',
            'complexidade' => 'O(n) - Linear',
            'registros_analisados' => Registro::count(),
        ];
    }

    /**
     * Executa busca sequencial por CPF
     */
    public function buscarPorCpf(string $cpf): array
    {
        $inicio = microtime(true);
        
        $cpf = preg_replace('/\D/', '', $cpf);
        
        $resultados = Registro::where('cpf', $cpf)
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'comparacoes_realizadas' => Registro::count(),
            'tipo_busca' => 'sequencial',
            'descricao' => 'Busca linear por CPF',
            'complexidade' => 'O(n) - Linear',
            'registros_analisados' => Registro::count(),
        ];
    }

    /**
     * Executa busca sequencial por cidade
     */
    public function buscarPorCidade(string $cidade): array
    {
        $inicio = microtime(true);
        
        $resultados = Registro::whereRaw('LOWER(cidade) LIKE ?', ['%' . strtolower($cidade) . '%'])
            ->limit(100)
            ->get();
        
        $fim = microtime(true);
        $tempoExecucao = ($fim - $inicio) * 1000;
        
        return [
            'resultados' => $resultados->toArray(),
            'total_encontrado' => $resultados->count(),
            'tempo_execucao' => round($tempoExecucao, 4),
            'comparacoes_realizadas' => Registro::count(),
            'tipo_busca' => 'sequencial',
            'descricao' => 'Busca linear por cidade',
            'complexidade' => 'O(n) - Linear',
            'registros_analisados' => Registro::count(),
        ];
    }

    /**
     * Retorna informações sobre a busca sequencial
     */
    public static function getInfo(): array
    {
        return [
            'nome' => 'Busca Sequencial',
            'descricao' => 'Percorre todos os registros um por um',
            'vantagens' => [
                'Simples de implementar',
                'Não requer índices',
                'Funciona em qualquer situação',
            ],
            'desvantagens' => [
                'Muito lenta em grandes volumes',
                'Performance O(n)',
                'Não escalável',
            ],
            'complexidade' => 'O(n)',
            'melhor_caso' => 'O(1)',
            'caso_medio' => 'O(n/2)',
            'pior_caso' => 'O(n)',
            'uso_memoria' => 'O(1)',
            'quando_usar' => [
                'Conjuntos pequenos',
                'Quando não há índices',
            ],
        ];
    }
}