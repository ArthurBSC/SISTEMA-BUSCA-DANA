import { Request, Response } from 'express';
import { Registro } from '../models/Registro';
import { BuscaSequencialService } from '../services/BuscaSequencialService';
import { BuscaIndexadaService } from '../services/BuscaIndexadaService';
import { BuscaHashMapService } from '../services/BuscaHashMapService';

export class ApiController {
  static async estatisticas(_req: Request, res: Response) {
    try {
      console.log('📊 Buscando estatísticas...');
      const stats = await Registro.getEstatisticas();
      res.json(stats);
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      console.error('Tipo do erro:', typeof error);
      console.error('Erro completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      // Extrair informações do erro de forma segura
      const errorMessage = error?.message || error?.toString() || 'Erro desconhecido ao buscar estatísticas';
      const errorCode = error?.code || 'UNKNOWN_ERROR';
      const isDatabaseError = error?.code === '42P01' || error?.code === '3D000' || error?.code === '28P01';
      
      // Mensagem mais amigável baseada no tipo de erro
      let userMessage = errorMessage;
      if (isDatabaseError) {
        if (error.code === '42P01') {
          userMessage = 'Tabela não encontrada. Execute as migrações do banco de dados.';
        } else if (error.code === '3D000') {
          userMessage = 'Banco de dados não encontrado. Verifique as configurações.';
        } else if (error.code === '28P01') {
          userMessage = 'Erro de autenticação. Verifique as credenciais do banco de dados.';
        }
      }
      
      res.status(500).json({ 
        error: 'Erro ao buscar estatísticas',
        message: userMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production' 
          ? { 
              originalMessage: errorMessage,
              stack: error?.stack 
            } 
          : undefined
      });
    }
  }

  static async infoBuscas(_req: Request, res: Response) {
    try {
      console.log('ℹ️ Buscando informações sobre buscas...');
      res.json({
        sequencial: BuscaSequencialService.getInfo(),
        indexada: BuscaIndexadaService.getInfo(),
        hashmap: BuscaHashMapService.getInfo(),
      });
    } catch (error: any) {
      console.error('❌ Erro ao buscar informações:', error);
      res.status(500).json({ 
        error: 'Erro ao buscar informações',
        message: error.message
      });
    }
  }
}

