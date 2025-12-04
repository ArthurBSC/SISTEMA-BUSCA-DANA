import { pool } from '../database/connection';

export interface RegistroData {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string | null;
  cidade: string;
  estado: string;
  data_nascimento: Date;
  status: 'ativo' | 'inativo';
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export class Registro {
  static async findAll(limit: number = 100): Promise<RegistroData[]> {
    const result = await pool.query(
      `SELECT * FROM registros WHERE deleted_at IS NULL LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<RegistroData | null> {
    const result = await pool.query(
      `SELECT * FROM registros WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByNome(termo: string, limit: number = 100): Promise<RegistroData[]> {
    const result = await pool.query(
      `SELECT * FROM registros 
       WHERE LOWER(nome) LIKE LOWER($1) 
       AND deleted_at IS NULL 
       LIMIT $2`,
      [`%${termo}%`, limit]
    );
    return result.rows;
  }

  static async findByCpf(cpf: string): Promise<RegistroData | null> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const result = await pool.query(
      `SELECT * FROM registros WHERE cpf = $1 AND deleted_at IS NULL LIMIT 1`,
      [cleanCpf]
    );
    return result.rows[0] || null;
  }

  static async findByCidade(cidade: string, limit: number = 100): Promise<RegistroData[]> {
    const result = await pool.query(
      `SELECT * FROM registros 
       WHERE LOWER(cidade) LIKE LOWER($1) 
       AND deleted_at IS NULL 
       LIMIT $2`,
      [`%${cidade}%`, limit]
    );
    return result.rows;
  }

  static async findByEmail(email: string, limit: number = 100): Promise<RegistroData[]> {
    const result = await pool.query(
      `SELECT * FROM registros 
       WHERE LOWER(email) LIKE LOWER($1) 
       AND deleted_at IS NULL 
       LIMIT $2`,
      [`%${email}%`, limit]
    );
    return result.rows;
  }

  static async count(): Promise<number> {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as total FROM registros WHERE deleted_at IS NULL`
      );
      return parseInt(result.rows[0].total);
    } catch (error: any) {
      console.error('❌ Erro em count:', error);
      throw error;
    }
  }

  static async countByStatus(status: 'ativo' | 'inativo'): Promise<number> {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as total FROM registros 
         WHERE status = $1 AND deleted_at IS NULL`,
        [status]
      );
      return parseInt(result.rows[0].total);
    } catch (error: any) {
      console.error('❌ Erro em countByStatus:', error);
      throw error;
    }
  }

  static async getEstatisticas() {
    try {
      console.log('📊 Iniciando busca de estatísticas...');
      const total = await this.count();
      console.log(`✅ Total: ${total}`);
      
      const ativos = await this.countByStatus('ativo');
      console.log(`✅ Ativos: ${ativos}`);
      
      const inativos = await this.countByStatus('inativo');
      console.log(`✅ Inativos: ${inativos}`);

      const porEstado = await pool.query(
        `SELECT estado, COUNT(*) as total 
         FROM registros 
         WHERE deleted_at IS NULL 
         GROUP BY estado 
         ORDER BY total DESC`
      );
      console.log(`✅ Estados: ${porEstado.rows.length} encontrados`);

      return {
        total,
        ativos,
        inativos,
        por_estado: porEstado.rows
      };
    } catch (error: any) {
      console.error('❌ Erro em getEstatisticas:', error);
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  static async create(data: Omit<RegistroData, 'id' | 'created_at' | 'updated_at'>): Promise<RegistroData> {
    const result = await pool.query(
      `INSERT INTO registros (nome, email, cpf, telefone, cidade, estado, data_nascimento, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.nome.toUpperCase(),
        data.email.toLowerCase(),
        data.cpf.replace(/\D/g, ''),
        data.telefone?.replace(/\D/g, '') || null,
        data.cidade,
        data.estado,
        data.data_nascimento,
        data.status
      ]
    );
    return result.rows[0];
  }
}

