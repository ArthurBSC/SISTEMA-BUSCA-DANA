import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Garantir que a senha seja sempre uma string
const dbPassword = process.env.DB_PASSWORD !== undefined 
  ? String(process.env.DB_PASSWORD) 
  : '';

const config: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sistema_busca',
  user: process.env.DB_USER || 'postgres',
  password: dbPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Log de configuração (sem mostrar senha)
console.log('🔧 Configuração do Banco:');
console.log(`   Host: ${config.host}`);
console.log(`   Port: ${config.port}`);
console.log(`   Database: ${config.database}`);
console.log(`   User: ${config.user}`);
console.log(`   Password: ${dbPassword ? '*** (configurada)' : '(vazia - sem senha)'}`);

export const pool = new Pool(config);

// Test connection on startup (com delay para evitar erro no início)
setTimeout(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');
    console.log('   Server time:', result.rows[0].now);
    
    // Verificar se a tabela existe
    try {
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'registros'
        );
      `);
      
      if (tableCheck.rows[0].exists) {
        console.log('✅ Tabela "registros" encontrada');
        
        // Contar registros
        const countResult = await pool.query('SELECT COUNT(*) as total FROM registros');
        console.log(`📊 Total de registros: ${countResult.rows[0].total}`);
      } else {
        console.warn('⚠️ Tabela "registros" não encontrada. Execute as migrações!');
        console.warn('   Execute: npm run migrate');
      }
    } catch (tableErr: any) {
      console.error('❌ Erro ao verificar tabela:', tableErr.message);
    }
  } catch (err: any) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('   Code:', err.code);
    console.error('   Stack:', err.stack);
    console.error('💡 Verifique se o PostgreSQL está rodando e as credenciais no .env estão corretas');
  }
}, 1000);

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default pool;

