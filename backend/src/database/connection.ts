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
setTimeout(() => {
  pool.query('SELECT NOW()')
    .then(() => {
      console.log('✅ Connected to PostgreSQL');
    })
    .catch((err) => {
      console.error('❌ Failed to connect to PostgreSQL:', err.message);
      console.error('💡 Verifique se o PostgreSQL está rodando e as credenciais no .env estão corretas');
      console.error('💡 Veja o arquivo CONFIGURAR-BANCO.md para mais detalhes');
    });
}, 1000);

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default pool;

