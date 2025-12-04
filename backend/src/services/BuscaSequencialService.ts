import { Registro, RegistroData } from '../models/Registro';

export interface BuscaResult {
  resultados: RegistroData[];
  total_encontrado: number;
  tempo_execucao: number;
  comparacoes_realizadas: number;
  tipo_busca: string;
  descricao: string;
  complexidade: string;
  registros_analisados: number;
}

export class BuscaSequencialService {
  static async buscarPorNome(termo: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let totalRegistros = 0;
    let resultados: any[] = [];
    
    try {
      totalRegistros = await Registro.count();
      resultados = await Registro.findByNome(termo);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorNome:', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      comparacoes_realizadas: totalRegistros,
      tipo_busca: 'sequencial',
      descricao: 'Percorreu todos os registros sequencialmente',
      complexidade: 'O(n) - Linear',
      registros_analisados: totalRegistros,
    };
  }

  static async buscarPorCpf(cpf: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let totalRegistros = 0;
    let resultados: any[] = [];
    
    try {
      totalRegistros = await Registro.count();
      const resultado = await Registro.findByCpf(cpf);
      resultados = resultado ? [resultado] : [];
    } catch (error: any) {
      console.error('❌ Erro em buscarPorCpf:', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      comparacoes_realizadas: totalRegistros,
      tipo_busca: 'sequencial',
      descricao: 'Busca linear por CPF',
      complexidade: 'O(n) - Linear',
      registros_analisados: totalRegistros,
    };
  }

  static async buscarPorCidade(cidade: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let totalRegistros = 0;
    let resultados: any[] = [];
    
    try {
      totalRegistros = await Registro.count();
      resultados = await Registro.findByCidade(cidade);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorCidade:', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      comparacoes_realizadas: totalRegistros,
      tipo_busca: 'sequencial',
      descricao: 'Busca linear por cidade',
      complexidade: 'O(n) - Linear',
      registros_analisados: totalRegistros,
    };
  }

  static async buscarPorEmail(email: string): Promise<BuscaResult> {
    const inicio = Date.now();
    let totalRegistros = 0;
    let resultados: any[] = [];
    
    try {
      totalRegistros = await Registro.count();
      resultados = await Registro.findByEmail(email);
    } catch (error: any) {
      console.error('❌ Erro em buscarPorEmail:', error);
      throw error;
    }
    
    const fim = Date.now();
    const tempoExecucao = fim - inicio;

    return {
      resultados,
      total_encontrado: resultados.length,
      tempo_execucao: parseFloat(tempoExecucao.toFixed(4)),
      comparacoes_realizadas: totalRegistros,
      tipo_busca: 'sequencial',
      descricao: 'Busca linear por email',
      complexidade: 'O(n) - Linear',
      registros_analisados: totalRegistros,
    };
  }

  static getInfo() {
    return {
      nome: 'Busca Sequencial',
      descricao: 'Percorre todos os registros um por um',
      vantagens: [
        'Simples de implementar',
        'Não requer índices',
        'Funciona em qualquer situação',
      ],
      desvantagens: [
        'Muito lenta em grandes volumes',
        'Performance O(n)',
        'Não escalável',
      ],
      complexidade: 'O(n)',
      melhor_caso: 'O(1)',
      caso_medio: 'O(n/2)',
      pior_caso: 'O(n)',
      uso_memoria: 'O(1)',
      quando_usar: [
        'Conjuntos pequenos',
        'Quando não há índices',
      ],
    };
  }
}

