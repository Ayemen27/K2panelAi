import pool from '@/lib/db/postgres';

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  checks: {
    connection: boolean;
    migrations: boolean;
    orphanedData: boolean;
    indexes: boolean;
    triggers: boolean;
  };
  details: {
    connection?: string;
    migrations?: string;
    orphanedData?: any[];
    indexes?: any[];
    triggers?: any[];
  };
}

export class HealthService {
  async runFullHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      connection: false,
      migrations: false,
      orphanedData: false,
      indexes: false,
      triggers: false,
    };

    const details: any = {};

    try {
      const connectionResult = await this.checkConnection();
      checks.connection = connectionResult.success;
      details.connection = connectionResult.message;
    } catch (error: any) {
      details.connection = error.message;
    }

    try {
      const migrationsResult = await this.checkMigrations();
      checks.migrations = migrationsResult.success;
      details.migrations = migrationsResult.message;
    } catch (error: any) {
      details.migrations = error.message;
    }

    try {
      const orphanedResult = await this.checkOrphanedData();
      checks.orphanedData = orphanedResult.length === 0;
      details.orphanedData = orphanedResult;
    } catch (error: any) {
      details.orphanedData = error.message;
    }

    try {
      const indexesResult = await this.checkIndexes();
      checks.indexes = indexesResult.length > 0;
      details.indexes = indexesResult;
    } catch (error: any) {
      details.indexes = error.message;
    }

    try {
      const triggersResult = await this.checkTriggers();
      checks.triggers = triggersResult.length > 0;
      details.triggers = triggersResult;
    } catch (error: any) {
      details.triggers = error.message;
    }

    const allChecksPass = Object.values(checks).every(v => v === true);
    const someChecksFail = Object.values(checks).some(v => v === false);

    return {
      status: allChecksPass ? 'healthy' : someChecksFail ? 'warning' : 'error',
      checks,
      details,
    };
  }

  private async checkConnection(): Promise<{ success: boolean; message: string }> {
    const result = await pool.query('SELECT NOW() as now');
    return {
      success: true,
      message: `Connected at ${result.rows[0].now}`,
    };
  }

  private async checkMigrations(): Promise<{ success: boolean; message: string }> {
    const result = await pool.query('SELECT COUNT(*) as count FROM pg_migrations');
    const count = parseInt(result.rows[0].count, 10);
    return {
      success: count > 0,
      message: `${count} migrations applied`,
    };
  }

  private async checkOrphanedData(): Promise<any[]> {
    const orphaned = [];

    const orphanedAccounts = await pool.query(`
      SELECT COUNT(*) as count 
      FROM accounts a 
      LEFT JOIN users u ON a.user_id = u.id 
      WHERE u.id IS NULL
    `);
    if (parseInt(orphanedAccounts.rows[0].count, 10) > 0) {
      orphaned.push({ table: 'accounts', count: parseInt(orphanedAccounts.rows[0].count, 10) });
    }

    const orphanedSessions = await pool.query(`
      SELECT COUNT(*) as count 
      FROM sessions s 
      LEFT JOIN users u ON s.user_id = u.id 
      WHERE u.id IS NULL
    `);
    if (parseInt(orphanedSessions.rows[0].count, 10) > 0) {
      orphaned.push({ table: 'sessions', count: parseInt(orphanedSessions.rows[0].count, 10) });
    }

    return orphaned;
  }

  private async checkIndexes(): Promise<any[]> {
    const result = await pool.query(`
      SELECT schemaname, tablename, indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);

    return result.rows;
  }

  private async checkTriggers(): Promise<any[]> {
    const result = await pool.query(`
      SELECT event_object_table, trigger_name
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `);

    return result.rows;
  }
}

export const healthService = new HealthService();
