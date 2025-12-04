import { pool } from './connection';

async function checkConnection() {
  try {
    console.log('🔍 Verificando conexão com PostgreSQL...');
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Conexão estabelecida!');
    console.log('⏰ Hora do servidor:', result.rows[0].current_time);
    console.log('📦 Versão PostgreSQL:', result.rows[0].version.split('\n')[0]);
    
    // Verificar se a tabela existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'registros'
      )
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Tabela "registros" existe');
      
      // Contar registros
      const count = await pool.query('SELECT COUNT(*) as total FROM registros');
      console.log(`📊 Total de registros: ${count.rows[0].total}`);
    } else {
      console.log('⚠️ Tabela "registros" NÃO existe. Execute: npm run migrate');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao conectar:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   1. PostgreSQL está rodando?');
    console.error('   2. Credenciais no .env estão corretas?');
    console.error('   3. Banco de dados "sistema_busca" existe?');
    process.exit(1);
  }
}

checkConnection();

