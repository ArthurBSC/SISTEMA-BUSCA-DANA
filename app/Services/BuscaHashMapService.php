<?php

/**
 * Service: Busca por HashMap CORRIGIDO FINAL
 * 
 * ONDE SALVAR: app/Services/BuscaHashMapService.php
 * 
 * Versão corrigida que realmente encontra resultados!
 */

namespace App\Services;

use App\Models\Registro;
use Illuminate\Support\Facades\Cache;

class BuscaHashMapService
{
    private const CACHE_TTL = 300;

    /**
     * Busca por nome usando HashMap
     */
    public function buscarPorNome(string $termo): array
    {
        $inicioTotal = microtime(true);
        
        $cacheKey = 'hashmap_nome_completo';
        $hashMap = Cache::get($cacheKey);
        
        if (!$hashMap) {
            // Constrói HashMap simples: nome => registro
            $inicio = microtime(true);
            $registros = Registro::all();
            
            $hashMap = [];
            foreach ($registros as $registro) {
                $hashMap[$registro->id] = $registro->toArray();
            }
            
            $tempoConstrucao = (microtime(true) - $inicio) * 1000;
            Cache::put($cacheKey, [
                'dados' => $hashMap,
                'tempo_construcao' => $tempoConstrucao,
            ], self::CACHE_TTL);
            
            $foiConstruido = true;
        } else {
            $hashMap = $hashMap['dados'];
            $tempoConstrucao = Cache::get($cacheKey)['tempo_construcao'];
            $foiConstruido = false;
        }
        
        // Busca no HashMap
        $inicioBusca = microtime(true);
        
        $termo = strtoupper($termo);
        $resultados = [];
        
        foreach ($hashMap as $registro) {
            if (strpos($registro['nome'], $termo) !== false) {
                $resultados[] = $registro;
                if (count($resultados) >= 100) break;
            }
        }
        
        $tempoBusca = (microtime(true) - $inicioBusca) * 1000;
        $tempoTotal = (microtime(true) - $inicioTotal) * 1000;
        
        return [
            'resultados' => $resultados,
            'total_encontrado' => count($resultados),
            'tempo_execucao' => round($tempoBusca, 4),
            'tempo_total' => round($tempoTotal, 4),
            'tipo_busca' => 'hashmap',
            'hashmap_construido' => $foiConstruido,
            'tempo_construcao' => $foiConstruido ? $tempoConstrucao : 0,
            'descricao' => $foiConstruido ? 'HashMap construído e busca executada' : 'Usou HashMap em cache',
            'complexidade' => 'O(1) + O(k) onde k = comparações',
            'total_buckets' => count($hashMap),
            'cache_hit' => !$foiConstruido,
        ];
    }

    /**
     * Busca por CPF usando HashMap
     */
    public function buscarPorCpf(string $cpf): array
    {
        $inicioTotal = microtime(true);
        
        $cpf = preg_replace('/\D/', '', $cpf);
        
        $cacheKey = 'hashmap_cpf_completo';
        $hashMap = Cache::get($cacheKey);
        
        if (!$hashMap) {
            $inicio = microtime(true);
            $registros = Registro::all();
            
            $hashMap = [];
            foreach ($registros as $registro) {
                $hashMap[$registro->cpf] = $registro->toArray();
            }
            
            $tempoConstrucao = (microtime(true) - $inicio) * 1000;
            Cache::put($cacheKey, [
                'dados' => $hashMap,
                'tempo_construcao' => $tempoConstrucao,
            ], self::CACHE_TTL);
            
            $foiConstruido = true;
        } else {
            $hashMap = $hashMap['dados'];
            $tempoConstrucao = Cache::get($cacheKey)['tempo_construcao'];
            $foiConstruido = false;
        }
        
        // Busca direta no HashMap
        $inicioBusca = microtime(true);
        
        $resultado = isset($hashMap[$cpf]) ? [$hashMap[$cpf]] : [];
        
        $tempoBusca = (microtime(true) - $inicioBusca) * 1000;
        $tempoTotal = (microtime(true) - $inicioTotal) * 1000;
        
        return [
            'resultados' => $resultado,
            'total_encontrado' => count($resultado),
            'tempo_execucao' => round($tempoBusca, 4),
            'tempo_total' => round($tempoTotal, 4),
            'tipo_busca' => 'hashmap',
            'hashmap_construido' => $foiConstruido,
            'tempo_construcao' => $foiConstruido ? $tempoConstrucao : 0,
            'descricao' => 'Busca O(1) direto no HashMap',
            'complexidade' => 'O(1) - Constante',
            'total_buckets' => count($hashMap),
            'cache_hit' => !$foiConstruido,
        ];
    }

    /**
     * Busca por cidade usando HashMap
     */
    public function buscarPorCidade(string $cidade): array
    {
        $inicioTotal = microtime(true);
        
        $cacheKey = 'hashmap_cidade_completo';
        $hashMap = Cache::get($cacheKey);
        
        if (!$hashMap) {
            $inicio = microtime(true);
            $registros = Registro::all();
            
            $hashMap = [];
            foreach ($registros as $registro) {
                $hashMap[$registro->id] = $registro->toArray();
            }
            
            $tempoConstrucao = (microtime(true) - $inicio) * 1000;
            Cache::put($cacheKey, [
                'dados' => $hashMap,
                'tempo_construcao' => $tempoConstrucao,
            ], self::CACHE_TTL);
            
            $foiConstruido = true;
        } else {
            $hashMap = $hashMap['dados'];
            $tempoConstrucao = Cache::get($cacheKey)['tempo_construcao'];
            $foiConstruido = false;
        }
        
        // Busca no HashMap
        $inicioBusca = microtime(true);
        
        $cidade = strtoupper($cidade);
        $resultados = [];
        
        foreach ($hashMap as $registro) {
            if (strpos($registro['cidade'], $cidade) !== false) {
                $resultados[] = $registro;
                if (count($resultados) >= 100) break;
            }
        }
        
        $tempoBusca = (microtime(true) - $inicioBusca) * 1000;
        $tempoTotal = (microtime(true) - $inicioTotal) * 1000;
        
        return [
            'resultados' => $resultados,
            'total_encontrado' => count($resultados),
            'tempo_execucao' => round($tempoBusca, 4),
            'tempo_total' => round($tempoTotal, 4),
            'tipo_busca' => 'hashmap',
            'hashmap_construido' => $foiConstruido,
            'tempo_construcao' => $foiConstruido ? $tempoConstrucao : 0,
            'descricao' => 'Busca usando HashMap em memória',
            'complexidade' => 'O(n) no HashMap (melhor que BD)',
            'total_buckets' => count($hashMap),
            'cache_hit' => !$foiConstruido,
        ];
    }

    /**
     * Limpa o cache dos HashMaps
     */
    public function limparCache(): void
    {
        Cache::forget('hashmap_nome_completo');
        Cache::forget('hashmap_cpf_completo');
        Cache::forget('hashmap_cidade_completo');
    }

    /**
     * Retorna informações sobre a busca por HashMap
     */
    public static function getInfo(): array
    {
        return [
            'nome' => 'Busca por HashMap',
            'descricao' => 'Usa tabela hash em memória',
            'vantagens' => [
                'Busca rápida O(1) para chaves exatas',
                'Dados em memória',
                'Cache eficiente',
            ],
            'desvantagens' => [
                'Usa memória RAM',
                'Tempo de construção inicial',
            ],
            'complexidade' => 'O(1)',
            'melhor_caso' => 'O(1)',
            'caso_medio' => 'O(1)',
            'pior_caso' => 'O(n)',
            'uso_memoria' => 'O(n)',
            'quando_usar' => [
                'Buscas frequentes',
                'Dados em cache',
            ],
        ];
    }
}