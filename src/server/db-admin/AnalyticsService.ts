import pool from '@/lib/db/postgres';

export interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  totalSize: number;
  activeConnections: number;
  databaseSize: number;
}

export interface TableStats {
  tableName: string;
  rowCount: number;
  tableSize: number;
  indexSize: number;
  totalSize: number;
}

export interface SlowQuery {
  query: string;
  calls: number;
  totalTime: number;
  meanTime: number;
  maxTime: number;
}

export class AnalyticsService {
  async getDatabaseStats(): Promise<DatabaseStats> {
    const tablesResult = await pool.query(
      `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`
    );

    const connectionsResult = await pool.query(
      `SELECT COUNT(*) as count FROM pg_stat_activity WHERE datname = current_database()`
    );

    const dbSizeResult = await pool.query(
      `SELECT pg_database_size(current_database()) as size`
    );

    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );

    let totalRows = 0;
    for (const table of tables.rows) {
      const tableName = this.sanitizeIdentifier(table.table_name);
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      totalRows += parseInt(countResult.rows[0].count, 10);
    }

    const totalSize = parseInt(dbSizeResult.rows[0].size, 10);

    return {
      totalTables: parseInt(tablesResult.rows[0].count, 10),
      totalRows,
      totalSize,
      activeConnections: parseInt(connectionsResult.rows[0].count, 10),
      databaseSize: totalSize,
    };
  }

  async getTableStats(): Promise<TableStats[]> {
    const result = await pool.query(
      `SELECT 
        schemaname,
        tablename,
        pg_total_relation_size(schemaname || '.' || tablename) AS total_size,
        pg_relation_size(schemaname || '.' || tablename) AS table_size,
        pg_total_relation_size(schemaname || '.' || tablename) - pg_relation_size(schemaname || '.' || tablename) AS index_size
       FROM pg_tables
       WHERE schemaname = 'public'
       ORDER BY total_size DESC`
    );

    const stats: TableStats[] = [];

    for (const row of result.rows) {
      const tableName = this.sanitizeIdentifier(row.tablename);
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      
      stats.push({
        tableName: row.tablename,
        rowCount: parseInt(countResult.rows[0].count, 10),
        tableSize: parseInt(row.table_size, 10),
        indexSize: parseInt(row.index_size, 10),
        totalSize: parseInt(row.total_size, 10),
      });
    }

    return stats;
  }

  async getActiveConnections(): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
        pid,
        usename,
        application_name,
        client_addr,
        state,
        query_start,
        state_change
       FROM pg_stat_activity
       WHERE datname = current_database()
       ORDER BY query_start DESC`
    );

    return result.rows;
  }

  async getSlowQueries(limit: number = 10): Promise<SlowQuery[]> {
    try {
      const result = await pool.query(
        `SELECT 
          query,
          calls,
          total_exec_time as total_time,
          mean_exec_time as mean_time,
          max_exec_time as max_time
         FROM pg_stat_statements
         WHERE query NOT LIKE '%pg_stat_statements%'
         ORDER BY mean_exec_time DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map(row => ({
        query: row.query,
        calls: parseInt(row.calls, 10),
        totalTime: parseFloat(row.total_time),
        meanTime: parseFloat(row.mean_time),
        maxTime: parseFloat(row.max_time),
      }));
    } catch (error) {
      return [];
    }
  }

  async getGrowthHistory(): Promise<any[]> {
    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );

    const history = [];
    for (const table of tables.rows) {
      const tableName = this.sanitizeIdentifier(table.table_name);
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      history.push({
        tableName: table.table_name,
        rowCount: parseInt(countResult.rows[0].count, 10),
        timestamp: new Date(),
      });
    }

    return history;
  }

  private sanitizeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return identifier.replace(/"/g, '""');
  }
}

export const analyticsService = new AnalyticsService();
