import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './connection';

/**
 * Script de inicialização que verifica e cria a tabela se necessário
 * Executado automaticamente no startup do servidor
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔍 Verificando banco de dados...');
    
    // Verificar se a tabela existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'registros'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Tabela "registros" já existe');
      
      // Contar registros
      const countResult = await pool.query('SELECT COUNT(*) as total FROM registros');
      const total = parseInt(countResult.rows[0].total, 10);
      console.log(`📊 Total de registros: ${total}`);
      
      if (total === 0) {
        console.log('⚠️ Tabela vazia. Execute: npm run seed');
      }
      
      return;
    }
    
    // Tabela não existe, criar
    console.log('📦 Criando tabela "registros"...');
    
    const migrationSQL = readFileSync(
      join(process.cwd(), 'src', 'database', 'migrations', '001_create_registros_table.sql'),
      'utf-8'
    );
    
    // Remover DROP TABLE em produção
    const isProduction = process.env.NODE_ENV === 'production';
    const sqlToExecute = isProduction 
      ? migrationSQL.replace(/DROP TABLE IF EXISTS.*?;/gi, '')
      : migrationSQL;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sqlToExecute);
      await client.query('COMMIT');
      console.log('✅ Tabela "registros" criada com sucesso!');
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    console.error('   Code:', error.code);
    // Não lançar erro para não impedir o servidor de iniciar
    // O erro será capturado quando tentar usar o banco
  }
}

