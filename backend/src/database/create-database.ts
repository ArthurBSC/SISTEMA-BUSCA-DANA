import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
  // Conectar ao banco 'postgres' padrão para criar o novo banco
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // Conecta ao banco padrão
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : '',
  });

  const dbName = process.env.DB_NAME || 'sistema_busca';

  try {
    console.log('🔍 Verificando se o banco de dados existe...');
    
    // Verificar se o banco já existe
    const checkResult = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkResult.rows.length > 0) {
      console.log(`✅ Banco de dados "${dbName}" já existe!`);
      await adminPool.end();
      return;
    }

    console.log(`📦 Criando banco de dados "${dbName}"...`);
    
    // Criar o banco de dados
    await adminPool.query(`CREATE DATABASE ${dbName}`);
    
    console.log(`✅ Banco de dados "${dbName}" criado com sucesso!`);
    
    await adminPool.end();
  } catch (error: any) {
    console.error('❌ Erro ao criar banco de dados:', error.message);
    
    if (error.code === '3D000') {
      console.error('💡 O banco de dados não existe e não foi possível criar.');
    } else if (error.code === '42P04') {
      console.log(`ℹ️ Banco de dados "${dbName}" já existe.`);
    } else {
      console.error('💡 Verifique:');
      console.error('   1. PostgreSQL está rodando');
      console.error('   2. Credenciais no .env estão corretas');
      console.error('   3. Usuário tem permissão para criar bancos');
    }
    
    await adminPool.end();
    process.exit(1);
  }
}

createDatabase()
  .then(() => {
    console.log('\n🎉 Pronto! Agora execute: npm run migrate');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });

