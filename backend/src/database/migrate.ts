import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './connection';

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running migrations...');
    
    // Read migration file (ajustar caminho conforme necessário)
    const migrationSQL = readFileSync(
      join(process.cwd(), 'src', 'database', 'migrations', '001_create_registros_table.sql'),
      'utf-8'
    );
    
    // Execute migration
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('COMMIT');
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

