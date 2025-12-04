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
      console.error('Stack:', error.stack);
      res.status(500).json({ 
        error: 'Erro ao buscar estatísticas',
        message: error.message || 'Erro desconhecido',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

