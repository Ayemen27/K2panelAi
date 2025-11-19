import pool from '../postgres';
import { QueryResult } from 'pg';

export interface PaginationOptions {
  page?: number;
  perPage?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pageInfo: {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async query<R = any>(text: string, params?: any[]): Promise<R[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows as R[];
    } finally {
      client.release();
    }
  }

  protected async queryOne<R = any>(text: string, params?: any[]): Promise<R | null> {
    const rows = await this.query<R>(text, params);
    return rows.length > 0 ? rows[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    return this.queryOne<T>(query, [id]);
  }

  async findAll(options: PaginationOptions = {}): Promise<PaginationResult<T>> {
    const { page = 1, perPage = 12 } = options;
    const offset = (page - 1) * perPage;

    const countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
    const dataQuery = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery),
      this.query<T>(dataQuery, [perPage, offset]),
    ]);

    const totalCount = parseInt(countResult?.count || '0', 10);
    const totalPages = Math.ceil(totalCount / perPage);

    return {
      data,
      pageInfo: {
        page,
        perPage,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    return this.queryOne<T>(query, values) as Promise<T>;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `;

    return this.queryOne<T>(query, [id, ...values]);
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, [id]);
    return result.length > 0;
  }
}
