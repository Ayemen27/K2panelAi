import fs from 'fs';
import path from 'path';
import pool from './postgres';

export interface MigrationResult {
  success: boolean;
  message: string;
  migrations: string[];
  errors?: string[];
}

/**
 * تطبيق جميع Migrations على قاعدة البيانات
 */
export async function migrate(): Promise<MigrationResult> {
  const results = {
    success: true,
    message: '',
    migrations: [] as string[],
    errors: [] as string[],
  };

  const client = await pool.connect();

  try {
    console.log('🔄 Starting database migration...');

    console.log('📝 Step 1: Ensuring migrations tracking table exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS pg_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Migrations tracking table ready');

    console.log('📝 Step 2: Checking for applied migrations...');
    const appliedMigrations = await getAppliedMigrations(client);
    console.log(`📊 Already applied: ${appliedMigrations.size} migrations`);

    console.log('📝 Step 3: Running base schema.sql if not already applied...');
    if (!appliedMigrations.has('000_base_schema.sql')) {
      const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schema);
      await recordMigration(client, '000_base_schema.sql');
      results.migrations.push('000_base_schema.sql');
      console.log('✅ Base schema created successfully');
    } else {
      console.log('⏭️ Base schema already applied, skipping...');
    }

    console.log('📝 Step 4: Running new migration files...');
    const migrationsDir = path.join(process.cwd(), 'database', 'migrations');
    
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();

      console.log(`📋 Found ${migrationFiles.length} migration files`);

      for (const file of migrationFiles) {
        if (appliedMigrations.has(file)) {
          console.log(`⏭️ Skipping ${file} (already applied)`);
          continue;
        }

        try {
          console.log(`🔄 Running migration: ${file}`);
          const filePath = path.join(migrationsDir, file);
          const sql = fs.readFileSync(filePath, 'utf-8');
          
          await client.query(sql);
          await recordMigration(client, file);
          results.migrations.push(file);
          console.log(`✅ Migration ${file} completed`);
        } catch (error: any) {
          const errorMsg = `❌ Error in ${file}: ${error.message}`;
          console.error(errorMsg);
          results.errors?.push(errorMsg);
          results.success = false;
        }
      }
    } else {
      console.log('⚠️ No migrations directory found, skipping...');
    }

    const newMigrations = results.migrations.filter(m => !m.includes('idempotent'));
    results.message = results.success 
      ? `✅ Successfully ran ${newMigrations.length} new migrations (${appliedMigrations.size} already applied)`
      : `⚠️ Completed with errors: ${results.errors?.length || 0} failed`;
    
    console.log(results.message);
    console.log('✅ Database migration completed successfully!');
    return results;
  } catch (error: any) {
    results.success = false;
    results.message = `❌ Migration failed: ${error.message}`;
    results.errors?.push(error.message);
    console.error('❌ Database migration failed:', error.message);
    console.error('💡 Alternative: Run manually with: psql $DATABASE_URL -f src/lib/db/schema.sql');
    throw error;
  } finally {
    client.release();
  }
}

async function getAppliedMigrations(client: any): Promise<Set<string>> {
  try {
    const result = await client.query('SELECT name FROM pg_migrations');
    return new Set(result.rows.map((row: any) => row.name));
  } catch (error) {
    console.log('⚠️ Migrations table not found, will be created by 000_init_migrations_table.sql');
    return new Set();
  }
}

async function recordMigration(client: any, name: string): Promise<void> {
  await client.query(
    'INSERT INTO pg_migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
    [name]
  );
}

/**
 * التحقق من حالة قاعدة البيانات
 */
export async function checkDatabase() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📊 Database tables:', result.rows.map((r: any) => r.table_name));
    return result.rows;
  } catch (error) {
    console.error('❌ Database check failed:', error);
    throw error;
  }
}

// تنفيذ Migration إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  migrate()
    .then(() => checkDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
