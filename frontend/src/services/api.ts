import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BuscaRequest {
  tipo_busca: ('sequencial' | 'indexada' | 'hashmap')[];
  campo_busca: 'nome' | 'cpf' | 'cidade' | 'email';
  termo_busca: string;
}

export interface BuscaResult {
  resultados: Record<string, any>;
  comparacao: {
    tempos: Record<string, number>;
    mais_rapido: string;
    mais_lento: string;
    diferencas: Record<string, number>;
    tempo_economizado: number;
  };
  campo: string;
  termo: string;
  tipos_busca: string[];
}

export const buscaApi = {
  buscar: async (data: BuscaRequest): Promise<BuscaResult> => {
    const response = await api.post<BuscaResult>('/buscar', data);
    return response.data;
  },

  limparCache: async (): Promise<void> => {
    await api.post('/buscar/limpar-cache');
  },

  getEstatisticas: async () => {
    const response = await api.get('/api/estatisticas');
    return response.data;
  },

  getInfoBuscas: async () => {
    const response = await api.get('/api/info-buscas');
    return response.data;
  },
};

export default api;

