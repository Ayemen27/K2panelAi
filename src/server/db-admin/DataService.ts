import pool from '@/lib/db/postgres';

export interface PaginationOptions {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class DataService {
  async getTableData<T = any>(
    tableName: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    const { page = 1, perPage = 25, sortBy = 'id', sortOrder = 'desc', filters = {} } = options;
    const offset = (page - 1) * perPage;

    let whereClause = '';
    const whereParams: any[] = [];
    
    if (Object.keys(filters).length > 0) {
      const conditions = Object.entries(filters).map(([key, value], index) => {
        whereParams.push(value);
        return `${key} = $${index + 1}`;
      });
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const countQuery = `SELECT COUNT(*) as count FROM ${tableName} ${whereClause}`;
    const dataQuery = `
      SELECT * FROM ${tableName}
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${whereParams.length + 1} OFFSET $${whereParams.length + 2}
    `;

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, whereParams),
      pool.query(dataQuery, [...whereParams, perPage, offset]),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / perPage);

    return {
      data: dataResult.rows as T[],
      total,
      page,
      perPage,
      totalPages,
    };
  }

  async createRow(tableName: string, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    const query = `
      INSERT INTO ${tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async updateRow(tableName: string, id: string, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

    const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async deleteRow(tableName: string, id: string): Promise<boolean> {
    const query = `DELETE FROM ${tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async exportToJSON(tableName: string): Promise<any[]> {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows;
  }

  async exportToCSV(tableName: string): Promise<string> {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    
    if (result.rows.length === 0) {
      return '';
    }

    const headers = Object.keys(result.rows[0]);
    const csvRows = [
      headers.join(','),
      ...result.rows.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null) return '';
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  async importFromJSON(tableName: string, data: any[]): Promise<number> {
    let count = 0;
    
    for (const row of data) {
      await this.createRow(tableName, row);
      count++;
    }

    return count;
  }
}

export const dataService = new DataService();
