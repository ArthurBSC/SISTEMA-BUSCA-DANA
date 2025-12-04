import { Request, Response } from 'express';
import { BuscaSequencialService } from '../services/BuscaSequencialService';
import { BuscaIndexadaService } from '../services/BuscaIndexadaService';
import { BuscaHashMapService } from '../services/BuscaHashMapService';
import { z } from 'zod';

const buscaSchema = z.object({
  tipo_busca: z.array(z.enum(['sequencial', 'indexada', 'hashmap'])).min(1),
  campo_busca: z.enum(['nome', 'cpf', 'cidade', 'email']),
  termo_busca: z.string().min(2),
});

// Funções auxiliares (fora da classe para evitar problemas com 'this')
async function executarBuscaSequencial(campo: string, termo: string) {
  switch (campo) {
    case 'nome':
      return await BuscaSequencialService.buscarPorNome(termo);
    case 'cpf':
      return await BuscaSequencialService.buscarPorCpf(termo);
    case 'cidade':
      return await BuscaSequencialService.buscarPorCidade(termo);
    case 'email':
      return await BuscaSequencialService.buscarPorEmail(termo);
    default:
      return await BuscaSequencialService.buscarPorNome(termo);
  }
}

async function executarBuscaIndexada(campo: string, termo: string) {
  switch (campo) {
    case 'nome':
      return await BuscaIndexadaService.buscarPorNome(termo);
    case 'cpf':
      return await BuscaIndexadaService.buscarPorCpf(termo);
    case 'cidade':
      return await BuscaIndexadaService.buscarPorCidade(termo);
    case 'email':
      return await BuscaIndexadaService.buscarPorEmail(termo);
    default:
      return await BuscaIndexadaService.buscarPorNome(termo);
  }
}

async function executarBuscaHashMap(campo: string, termo: string) {
  switch (campo) {
    case 'nome':
      return await BuscaHashMapService.buscarPorNome(termo);
    case 'cpf':
      return await BuscaHashMapService.buscarPorCpf(termo);
    case 'cidade':
      return await BuscaHashMapService.buscarPorCidade(termo);
    case 'email':
      return await BuscaHashMapService.buscarPorEmail(termo);
    default:
      return await BuscaHashMapService.buscarPorNome(termo);
  }
}

function compararPerformance(resultados: Record<string, any>) {
  if (Object.keys(resultados).length === 0) {
    return {};
  }

  const tempos: Record<string, number> = {};
  let maisRapido: string | null = null;
  let maisLento: string | null = null;

  // Coleta os tempos
  for (const [tipo, resultado] of Object.entries(resultados)) {
    // Ignora resultados com erro
    if (resultado.error || !resultado.tempo_execucao) {
      continue;
    }
    
    const tempo = resultado.tempo_execucao;
    tempos[tipo] = tempo;

    if (maisRapido === null || tempo < tempos[maisRapido]) {
      maisRapido = tipo;
    }

    if (maisLento === null || tempo > tempos[maisLento]) {
      maisLento = tipo;
    }
  }

  if (Object.keys(tempos).length === 0) {
    return {};
  }

  // Calcula diferenças percentuais
  const diferencas: Record<string, number> = {};
  const tempoBase = tempos[maisRapido!];

  for (const [tipo, tempo] of Object.entries(tempos)) {
    if (tipo === maisRapido) {
      diferencas[tipo] = 0;
    } else {
      const diferenca = ((tempo - tempoBase) / tempoBase) * 100;
      diferencas[tipo] = parseFloat(diferenca.toFixed(2));
    }
  }

  return {
    tempos,
    mais_rapido: maisRapido,
    mais_lento: maisLento,
    diferencas,
    tempo_economizado: tempos[maisLento!] - tempos[maisRapido!],
  };
}

export class BuscaController {
  static async buscar(req: Request, res: Response): Promise<void> {
    try {
      console.log('📥 Request body:', req.body);
      const validated = buscaSchema.parse(req.body);
      const { tipo_busca, campo_busca, termo_busca } = validated;

      console.log(`🔍 Executando busca: ${tipo_busca.join(', ')} por ${campo_busca}: "${termo_busca}"`);

      const resultados: Record<string, any> = {};

      // Executa cada tipo de busca selecionado
      for (const tipo of tipo_busca) {
        try {
          switch (tipo) {
            case 'sequencial':
              resultados.sequencial = await executarBuscaSequencial(campo_busca, termo_busca);
              break;
            case 'indexada':
              resultados.indexada = await executarBuscaIndexada(campo_busca, termo_busca);
              break;
            case 'hashmap':
              resultados.hashmap = await executarBuscaHashMap(campo_busca, termo_busca);
              break;
          }
          console.log(`✅ Busca ${tipo} concluída`);
        } catch (buscaError: any) {
          console.error(`❌ Erro na busca ${tipo}:`, buscaError);
          resultados[tipo] = {
            error: buscaError.message,
            resultados: [],
            total_encontrado: 0,
            tempo_execucao: 0
          };
        }
      }

      // Calcula comparação de performance
      const comparacao = compararPerformance(resultados);

      res.json({
        resultados,
        comparacao,
        campo: campo_busca,
        termo: termo_busca,
        tipos_busca: tipo_busca,
      });
    } catch (error: any) {
      console.error('❌ Erro no controller:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
        return;
      }
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  static async limparCache(_req: Request, res: Response) {
    try {
      BuscaHashMapService.limparCache();
      res.json({ message: 'Cache dos HashMaps limpo com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao limpar cache' });
    }
  }
}
