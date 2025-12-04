import { Registro, RegistroData } from '../models/Registro';

export interface BuscaResult {
  resultados: RegistroData[];
  total_encontrado: number;
  tempo_execucao: number;
  tipo_busca: string;
  indice_utilizado?: string;
  descricao: string;
  complexidade: string;
  tipo_indice?: string;
}

export class BuscaIndexadaService {
  static async buscarPorNome(termo: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let resultados: any[] = [];
    
    try {
      // Usa índice do banco (case-insensitive)
      resultados = await Registro.findByNome(termo);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorNome (indexada):', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      tipo_busca: 'indexada',
      indice_utilizado: 'idx_registros_nome',
      descricao: 'Usou índice do banco de dados',
      complexidade: 'O(log n) - Logarítmica',
      tipo_indice: 'GIN INDEX (Full-Text Search)',
    };
  }

  static async buscarPorCpf(cpf: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let resultados: any[] = [];
    
    try {
      const resultado = await Registro.findByCpf(cpf);
      resultados = resultado ? [resultado] : [];
    } catch (error: any) {
      console.error('❌ Erro em buscarPorCpf (indexada):', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      tipo_busca: 'indexada',
      indice_utilizado: 'cpf (UNIQUE)',
      descricao: 'Busca O(1) usando índice único',
      complexidade: 'O(1) - Constante',
      tipo_indice: 'UNIQUE INDEX',
    };
  }

  static async buscarPorCidade(cidade: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let resultados: any[] = [];
    
    try {
      resultados = await Registro.findByCidade(cidade);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorCidade (indexada):', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      tipo_busca: 'indexada',
      indice_utilizado: 'idx_registros_localizacao',
      descricao: 'Usou índice composto (cidade, estado)',
      complexidade: 'O(log n) - Logarítmica',
      tipo_indice: 'COMPOSITE INDEX',
    };
  }

  static async buscarPorEmail(email: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let resultados: any[] = [];
    
    try {
      resultados = await Registro.findByEmail(email);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorEmail (indexada):', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      tipo_busca: 'indexada',
      indice_utilizado: 'email (UNIQUE)',
      descricao: 'Busca usando índice único',
      complexidade: 'O(1) - Constante',
      tipo_indice: 'UNIQUE INDEX',
    };
  }

  static getInfo() {
    return {
      nome: 'Busca Indexada',
      descricao: 'Utiliza índices do banco de dados (B-Tree/GIN)',
      vantagens: [
        'Muito rápida',
        'Escalável',
        'Padrão da indústria',
      ],
      desvantagens: [
        'Requer espaço em disco',
        'Índices precisam ser mantidos',
      ],
      complexidade: 'O(log n) a O(1)',
      melhor_caso: 'O(1)',
      caso_medio: 'O(log n)',
      pior_caso: 'O(log n)',
      uso_memoria: 'Adicional para índices',
      quando_usar: [
        'Sempre em produção',
        'Grandes volumes',
      ],
    };
  }
}

