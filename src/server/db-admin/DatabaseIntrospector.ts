import pool from '@/lib/db/postgres';

export interface TableInfo {
  tableName: string;
  rowCount: number;
  sizeBytes: number;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  foreignKeys: ForeignKeyInfo[];
}

export interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  defaultValue: string | null;
  isPrimaryKey: boolean;
}

export interface IndexInfo {
  indexName: string;
  columnName: string;
  isUnique: boolean;
  indexType: string;
}

export interface ForeignKeyInfo {
  constraintName: string;
  columnName: string;
  foreignTableName: string;
  foreignColumnName: string;
}

export class DatabaseIntrospector {
  async getAllTables(): Promise<string[]> {
    const result = await pool.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public' 
       ORDER BY table_name`
    );
    return result.rows.map(r => r.table_name);
  }

  async getTableInfo(tableName: string): Promise<TableInfo> {
    const [columns, indexes, foreignKeys, stats] = await Promise.all([
      this.getColumns(tableName),
      this.getIndexes(tableName),
      this.getForeignKeys(tableName),
      this.getTableStats(tableName),
    ]);

    return {
      tableName,
      rowCount: stats.rowCount,
      sizeBytes: stats.sizeBytes,
      columns,
      indexes,
      foreignKeys,
    };
  }

  private async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const result = await pool.query(
      `SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key
       FROM information_schema.columns c
       LEFT JOIN (
         SELECT ku.column_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage ku
           ON tc.constraint_name = ku.constraint_name
         WHERE tc.constraint_type = 'PRIMARY KEY'
           AND tc.table_name = $1
       ) pk ON c.column_name = pk.column_name
       WHERE c.table_name = $1
       ORDER BY c.ordinal_position`,
      [tableName]
    );

    return result.rows.map(row => ({
      columnName: row.column_name,
      dataType: row.data_type,
      isNullable: row.is_nullable === 'YES',
      defaultValue: row.column_default,
      isPrimaryKey: row.is_primary_key,
    }));
  }

  private async getIndexes(tableName: string): Promise<IndexInfo[]> {
    const result = await pool.query(
      `SELECT 
        i.indexname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique,
        am.amname as index_type
       FROM pg_indexes i
       JOIN pg_class t ON t.relname = i.tablename
       JOIN pg_index ix ON ix.indexrelid = (i.schemaname || '.' || i.indexname)::regclass
       JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
       JOIN pg_am am ON am.oid = (SELECT c.relam FROM pg_class c WHERE c.oid = ix.indexrelid)
       WHERE i.schemaname = 'public' AND i.tablename = $1
       ORDER BY i.indexname`,
      [tableName]
    );

    return result.rows.map(row => ({
      indexName: row.index_name,
      columnName: row.column_name,
      isUnique: row.is_unique,
      indexType: row.index_type,
    }));
  }

  private async getForeignKeys(tableName: string): Promise<ForeignKeyInfo[]> {
    const result = await pool.query(
      `SELECT 
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
       FROM information_schema.table_constraints AS tc
       JOIN information_schema.key_column_usage AS kcu
         ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.constraint_column_usage AS ccu
         ON ccu.constraint_name = tc.constraint_name
       WHERE tc.constraint_type = 'FOREIGN KEY'
         AND tc.table_name = $1
       ORDER BY tc.constraint_name`,
      [tableName]
    );

    return result.rows.map(row => ({
      constraintName: row.constraint_name,
      columnName: row.column_name,
      foreignTableName: row.foreign_table_name,
      foreignColumnName: row.foreign_column_name,
    }));
  }

  private async getTableStats(tableName: string): Promise<{ rowCount: number; sizeBytes: number }> {
    const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    const sizeResult = await pool.query(
      `SELECT pg_total_relation_size($1) as size`,
      [tableName]
    );

    return {
      rowCount: parseInt(countResult.rows[0].count, 10),
      sizeBytes: parseInt(sizeResult.rows[0].size, 10),
    };
  }

  async getAllForeignKeys(): Promise<ForeignKeyInfo[]> {
    const result = await pool.query(
      `SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
       FROM information_schema.table_constraints AS tc
       JOIN information_schema.key_column_usage AS kcu
         ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.constraint_column_usage AS ccu
         ON ccu.constraint_name = tc.constraint_name
       WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
       ORDER BY tc.table_name, tc.constraint_name`
    );

    return result.rows.map(row => ({
      constraintName: row.constraint_name,
      columnName: row.column_name,
      foreignTableName: row.foreign_table_name,
      foreignColumnName: row.foreign_column_name,
    }));
  }

  async getAllTriggers(): Promise<any[]> {
    const result = await pool.query(
      `SELECT 
        event_object_table AS table_name,
        trigger_name,
        event_manipulation,
        action_timing,
        action_statement
       FROM information_schema.triggers
       WHERE trigger_schema = 'public'
       ORDER BY event_object_table, trigger_name`
    );

    return result.rows;
  }
}

export const databaseIntrospector = new DatabaseIntrospector();
