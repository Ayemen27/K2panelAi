import pool from './postgres';
import fs from 'fs/promises';
import path from 'path';

export interface MigrationResult {
  success: boolean;
  message: string;
  migrations: string[];
  errors?: string[];
}

export async function runMigrations(): Promise<MigrationResult> {
  const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql');
  
  const results = {
    success: true,
    message: '',
    migrations: [] as string[],
    errors: [] as string[],
  };

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('📂 Running base schema.sql...');
    const baseSchema = await fs.readFile(schemaPath, 'utf-8');
    await client.query(baseSchema);
    results.migrations.push('schema.sql');
    console.log('✅ Base schema created successfully');

    console.log('📂 Reading migrations directory...');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📋 Found ${migrationFiles.length} migration files`);

    for (const file of migrationFiles) {
      try {
        console.log(`🔄 Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf-8');
        
        await client.query(sql);
        results.migrations.push(file);
        console.log(`✅ Migration ${file} completed`);
      } catch (error: any) {
        const errorMsg = `❌ Error in ${file}: ${error.message}`;
        console.error(errorMsg);
        results.errors?.push(errorMsg);
        results.success = false;
      }
    }

    await client.query('COMMIT');
    
    results.message = results.success 
      ? `✅ Successfully ran ${results.migrations.length} migrations`
      : `⚠️ Completed with errors: ${results.errors?.length || 0} failed`;
    
    console.log(results.message);
    
  } catch (error: any) {
    await client.query('ROLLBACK');
    results.success = false;
    results.message = `❌ Migration failed: ${error.message}`;
    results.errors?.push(error.message);
    console.error('Migration rollback due to error:', error);
  } finally {
    client.release();
  }

  return results;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
