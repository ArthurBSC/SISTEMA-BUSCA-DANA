import NodeCache from 'node-cache';
import { Registro, RegistroData } from '../models/Registro';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '300');

const cache = new NodeCache({ stdTTL: CACHE_TTL });

export interface BuscaResult {
  resultados: RegistroData[];
  total_encontrado: number;
  tempo_execucao: number;
  tempo_total?: number;
  tipo_busca: string;
  hashmap_construido?: boolean;
  tempo_construcao?: number;
  descricao: string;
  complexidade: string;
  total_buckets?: number;
  cache_hit?: boolean;
}

export class BuscaHashMapService {
  private static async construirHashMap(cacheKey: string): Promise<Map<string | number, RegistroData>> {
    const inicio = Date.now();
    const registros = await Registro.findAll(10000); // Limite alto para cache
    
    const hashMap = new Map<string | number, RegistroData>();
    registros.forEach(registro => {
      hashMap.set(registro.id!, registro);
    });
    
    const tempoConstrucao = Date.now() - inicio;
    
    cache.set(cacheKey, {
      dados: Array.from(hashMap.entries()),
      tempo_construcao: tempoConstrucao,
    });
    
    return hashMap;
  }

  private static async obterHashMap(cacheKey: string): Promise<{ hashMap: Map<string | number, RegistroData>, tempoConstrucao: number, foiConstruido: boolean }> {
    const cached = cache.get<{ dados: [string | number, RegistroData][], tempo_construcao: number }>(cacheKey);
    
    if (!cached) {
      const hashMap = await this.construirHashMap(cacheKey);
      const cachedAfter = cache.get<{ dados: [string | number, RegistroData][], tempo_construcao: number }>(cacheKey);
      const tempoConstrucao = cachedAfter?.tempo_construcao || 0;
      return { hashMap, tempoConstrucao, foiConstruido: true };
    }
    
    const hashMap = new Map(cached.dados);
    return { hashMap, tempoConstrucao: cached.tempo_construcao, foiConstruido: false };
  }

  static async buscarPorNome(termo: string): Promise<BuscaResult> {
    const inicioTotal = Date.now();
    const cacheKey = 'hashmap_nome_completo';
    
    const { hashMap, tempoConstrucao, foiConstruido } = await this.obterHashMap(cacheKey);
    
    const inicioBusca = Date.now();
    const termoLower = termo.toLowerCase();
    const resultados: RegistroData[] = [];
    
    for (const registro of hashMap.values()) {
      if (registro.nome.toLowerCase().includes(termoLower)) {
        resultados.push(registro);
        if (resultados.length >= 100) break;
      }
    }
    
    const tempoBusca = Date.now() - inicioBusca;
    const tempoTotal = Date.now() - inicioTotal;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoBusca.toFixed(4)),
      tempo_total: parseFloat(tempoTotal.toFixed(4)),
      tipo_busca: 'hashmap',
      hashmap_construido: foiConstruido,
      tempo_construcao: foiConstruido ? tempoConstrucao : 0,
      descricao: foiConstruido ? 'HashMap construído e busca executada' : 'Usou HashMap em cache',
      complexidade: 'O(1) + O(k) onde k = comparações',
      total_buckets: hashMap.size,
      cache_hit: !foiConstruido,
    };
  }

  static async buscarPorCpf(cpf: string): Promise<BuscaResult> {
    const inicioTotal = Date.now();
    const cleanCpf = cpf.replace(/\D/g, '');
    const cacheKey = 'hashmap_cpf_completo';
    
    const { hashMap, tempoConstrucao, foiConstruido } = await this.obterHashMap(cacheKey);
    
    // Construir HashMap específico para CPF se necessário
    if (foiConstruido || !cache.get('hashmap_cpf_completo')) {
      const cpfHashMap = new Map<string, RegistroData>();
      for (const registro of hashMap.values()) {
        cpfHashMap.set(registro.cpf.replace(/\D/g, ''), registro);
      }
      cache.set('hashmap_cpf_completo', {
        dados: Array.from(cpfHashMap.entries()),
        tempo_construcao: tempoConstrucao,
      });
      hashMap.clear();
      for (const [key, value] of cpfHashMap.entries()) {
        hashMap.set(key, value);
      }
    }
    
    const inicioBusca = Date.now();
    const resultado = hashMap.get(cleanCpf);
    const resultados = resultado ? [resultado] : [];
    
    const tempoBusca = Date.now() - inicioBusca;
    const tempoTotal = Date.now() - inicioTotal;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoBusca.toFixed(4)),
      tempo_total: parseFloat(tempoTotal.toFixed(4)),
      tipo_busca: 'hashmap',
      hashmap_construido: foiConstruido,
      tempo_construcao: foiConstruido ? tempoConstrucao : 0,
      descricao: 'Busca O(1) direto no HashMap',
      complexidade: 'O(1) - Constante',
      total_buckets: hashMap.size,
      cache_hit: !foiConstruido,
    };
  }

  static async buscarPorCidade(cidade: string): Promise<BuscaResult> {
    const inicioTotal = Date.now();
    const cacheKey = 'hashmap_cidade_completo';
    
    const { hashMap, tempoConstrucao, foiConstruido } = await this.obterHashMap(cacheKey);
    
    const inicioBusca = Date.now();
    const cidadeLower = cidade.toLowerCase();
    const resultados: RegistroData[] = [];
    
    for (const registro of hashMap.values()) {
      if (registro.cidade.toLowerCase().includes(cidadeLower)) {
        resultados.push(registro);
        if (resultados.length >= 100) break;
      }
    }
    
    const tempoBusca = Date.now() - inicioBusca;
    const tempoTotal = Date.now() - inicioTotal;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoBusca.toFixed(4)),
      tempo_total: parseFloat(tempoTotal.toFixed(4)),
      tipo_busca: 'hashmap',
      hashmap_construido: foiConstruido,
      tempo_construcao: foiConstruido ? tempoConstrucao : 0,
      descricao: 'Busca usando HashMap em memória',
      complexidade: 'O(n) no HashMap (melhor que BD)',
      total_buckets: hashMap.size,
      cache_hit: !foiConstruido,
    };
  }

  static async buscarPorEmail(email: string): Promise<BuscaResult> {
    const inicioTotal = Date.now();
    const cacheKey = 'hashmap_email_completo';
    
    const { hashMap, tempoConstrucao, foiConstruido } = await this.obterHashMap(cacheKey);
    
    const inicioBusca = Date.now();
    const emailLower = email.toLowerCase();
    const resultados: RegistroData[] = [];
    
    for (const registro of hashMap.values()) {
      if (registro.email.toLowerCase().includes(emailLower)) {
        resultados.push(registro);
        if (resultados.length >= 100) break;
      }
    }
    
    const tempoBusca = Date.now() - inicioBusca;
    const tempoTotal = Date.now() - inicioTotal;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoBusca.toFixed(4)),
      tempo_total: parseFloat(tempoTotal.toFixed(4)),
      tipo_busca: 'hashmap',
      hashmap_construido: foiConstruido,
      tempo_construcao: foiConstruido ? tempoConstrucao : 0,
      descricao: 'Busca usando HashMap em memória',
      complexidade: 'O(n) no HashMap (melhor que BD)',
      total_buckets: hashMap.size,
      cache_hit: !foiConstruido,
    };
  }

  static limparCache(): void {
    cache.flushAll();
  }

  static getInfo() {
    return {
      nome: 'Busca por HashMap',
      descricao: 'Usa tabela hash em memória',
      vantagens: [
        'Busca rápida O(1) para chaves exatas',
        'Dados em memória',
        'Cache eficiente',
      ],
      desvantagens: [
        'Usa memória RAM',
        'Tempo de construção inicial',
      ],
      complexidade: 'O(1)',
      melhor_caso: 'O(1)',
      caso_medio: 'O(1)',
      pior_caso: 'O(n)',
      uso_memoria: 'O(n)',
      quando_usar: [
        'Buscas frequentes',
        'Dados em cache',
      ],
    };
  }
}

