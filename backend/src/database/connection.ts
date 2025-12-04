import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Função para criar configuração do pool
function createPoolConfig(): PoolConfig {
  // Prioridade 1: DATABASE_URL (comum no Railway, Heroku, etc)
  if (process.env.DATABASE_URL) {
    console.log('🔧 Usando DATABASE_URL para conexão');
    return {
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Aumentado para Railway
    };
  }

  // Prioridade 2: Variáveis PG* (comum no Railway)
  if (process.env.PGHOST || process.env.PGDATABASE) {
    console.log('🔧 Usando variáveis PG* para conexão');
    const dbPassword = process.env.PGPASSWORD !== undefined 
      ? String(process.env.PGPASSWORD) 
      : '';
    
    return {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE || 'sistema_busca',
      user: process.env.PGUSER || 'postgres',
      password: dbPassword,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Aumentado para Railway
    };
  }

  // Prioridade 3: Variáveis DB_* (nossa convenção)
  console.log('🔧 Usando variáveis DB_* para conexão');
  const dbPassword = process.env.DB_PASSWORD !== undefined 
    ? String(process.env.DB_PASSWORD) 
    : '';
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'sistema_busca',
    user: process.env.DB_USER || 'postgres',
    password: dbPassword,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Aumentado para Railway
  };
}

const config = createPoolConfig();

// Log de configuração (sem mostrar senha)
console.log('🔧 Configuração do Banco:');
if ('connectionString' in config) {
  // DATABASE_URL - não mostrar a URL completa por segurança
  const url = process.env.DATABASE_URL || '';
  const maskedUrl = url.replace(/:[^:@]+@/, ':****@'); // Mascarar senha na URL
  console.log(`   Connection String: ${maskedUrl}`);
} else {
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  const password = 'password' in config ? config.password : '';
  console.log(`   Password: ${password ? '*** (configurada)' : '(vazia - sem senha)'}`);
}

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
        console.warn('⚠️ Tabela "registros" não encontrada. Será criada automaticamente.');
      }
    } catch (tableErr: any) {
      console.error('❌ Erro ao verificar tabela:', tableErr.message);
      console.error('   Code:', tableErr.code);
    }
  } catch (err: any) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('   Code:', err.code);
    console.error('   Stack:', err.stack);
    console.error('💡 Verifique as variáveis de ambiente:');
    console.error('   - DATABASE_URL (Railway/Heroku)');
    console.error('   - PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD (Railway)');
    console.error('   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (custom)');
  }
}, 2000); // Aumentado para dar mais tempo ao Railway

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default pool;

