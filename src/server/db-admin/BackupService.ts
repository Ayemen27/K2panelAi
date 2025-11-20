import pool from '@/lib/db/postgres';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'full' | 'schema' | 'data';
}

export class BackupService {
  private backupsDir = path.join(process.cwd(), 'data', 'backups');
  private backups: Map<string, BackupInfo> = new Map();

  constructor() {
    this.ensureBackupsDir();
  }

  private async ensureBackupsDir(): Promise<void> {
    try {
      await fs.mkdir(this.backupsDir, { recursive: true });
    } catch (error) {
    }
  }

  async createFullBackup(): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_full_${timestamp}.sql`;
    const filepath = path.join(this.backupsDir, filename);

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    try {
      await execAsync(`pg_dump "${databaseUrl}" > "${filepath}"`);
      
      const stats = await fs.stat(filepath);
      const backupInfo: BackupInfo = {
        id: `backup_${Date.now()}`,
        filename,
        size: stats.size,
        createdAt: new Date(),
        type: 'full',
      };

      this.backups.set(backupInfo.id, backupInfo);
      return backupInfo;
    } catch (error: any) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  async createSchemaBackup(): Promise<BackupInfo> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_schema_${timestamp}.sql`;
    const filepath = path.join(this.backupsDir, filename);

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    try {
      await execAsync(`pg_dump --schema-only "${databaseUrl}" > "${filepath}"`);
      
      const stats = await fs.stat(filepath);
      const backupInfo: BackupInfo = {
        id: `backup_${Date.now()}`,
        filename,
        size: stats.size,
        createdAt: new Date(),
        type: 'schema',
      };

      this.backups.set(backupInfo.id, backupInfo);
      return backupInfo;
    } catch (error: any) {
      throw new Error(`Schema backup failed: ${error.message}`);
    }
  }

  async exportSchemaAsSQL(): Promise<string> {
    const tables = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );

    let sql = '';

    for (const table of tables.rows) {
      const tableName = table.table_name;
      
      const columnsResult = await pool.query(
        `SELECT 
          column_name, 
          data_type, 
          character_maximum_length,
          column_default,
          is_nullable
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [tableName]
      );

      sql += `\n-- Table: ${tableName}\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      const columns = columnsResult.rows.map(col => {
        let line = `  ${col.column_name} ${col.data_type}`;
        if (col.character_maximum_length) {
          line += `(${col.character_maximum_length})`;
        }
        if (col.is_nullable === 'NO') {
          line += ' NOT NULL';
        }
        if (col.column_default) {
          line += ` DEFAULT ${col.column_default}`;
        }
        return line;
      });

      sql += columns.join(',\n');
      sql += '\n);\n\n';
    }

    return sql;
  }

  async listBackups(): Promise<BackupInfo[]> {
    try {
      const files = await fs.readdir(this.backupsDir);
      const backups: BackupInfo[] = [];

      for (const file of files) {
        if (file.endsWith('.sql')) {
          const filepath = path.join(this.backupsDir, file);
          const stats = await fs.stat(filepath);
          
          backups.push({
            id: file,
            filename: file,
            size: stats.size,
            createdAt: stats.mtime,
            type: file.includes('schema') ? 'schema' : file.includes('data') ? 'data' : 'full',
          });
        }
      }

      return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      return [];
    }
  }

  async deleteBackup(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(this.backupsDir, filename);
      await fs.unlink(filepath);
      this.backups.delete(filename);
      return true;
    } catch (error) {
      return false;
    }
  }

  async restoreBackup(filename: string): Promise<void> {
    const filepath = path.join(this.backupsDir, filename);
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    try {
      await execAsync(`psql "${databaseUrl}" < "${filepath}"`);
    } catch (error: any) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }
}

export const backupService = new BackupService();
