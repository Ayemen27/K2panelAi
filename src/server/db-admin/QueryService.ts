import pool from '@/lib/db/postgres';

export interface QueryResult {
  success: boolean;
  rows?: any[];
  rowCount?: number;
  fields?: any[];
  error?: string;
  executionTime?: number;
}

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  createdAt: Date;
  userId?: string;
}

export class QueryService {
  private queryHistory: Array<{ query: string; timestamp: Date; result: QueryResult }> = [];
  private savedQueries: Map<string, SavedQuery> = new Map();

  async executeQuery(query: string, timeout: number = 30000): Promise<QueryResult> {
    const startTime = Date.now();
    
    try {
      const client = await pool.connect();
      
      try {
        const sanitizedTimeout = parseInt(timeout.toString(), 10);
        if (isNaN(sanitizedTimeout) || sanitizedTimeout < 0 || sanitizedTimeout > 300000) {
          throw new Error('Invalid timeout value');
        }
        await client.query('SET statement_timeout = $1', [sanitizedTimeout]);
        
        const result = await client.query(query);
        const executionTime = Date.now() - startTime;

        const queryResult: QueryResult = {
          success: true,
          rows: result.rows,
          rowCount: result.rowCount || 0,
          fields: result.fields.map(f => ({
            name: f.name,
            dataType: f.dataTypeID,
          })),
          executionTime,
        };

        this.queryHistory.push({
          query,
          timestamp: new Date(),
          result: queryResult,
        });

        return queryResult;
      } finally {
        client.release();
      }
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      
      const queryResult: QueryResult = {
        success: false,
        error: error.message,
        executionTime,
      };

      this.queryHistory.push({
        query,
        timestamp: new Date(),
        result: queryResult,
      });

      return queryResult;
    }
  }

  getQueryHistory(limit: number = 50): Array<{ query: string; timestamp: Date; result: QueryResult }> {
    return this.queryHistory.slice(-limit).reverse();
  }

  clearQueryHistory(): void {
    this.queryHistory = [];
  }

  saveQuery(name: string, query: string, userId?: string): SavedQuery {
    const id = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const savedQuery: SavedQuery = {
      id,
      name,
      query,
      createdAt: new Date(),
      userId,
    };

    this.savedQueries.set(id, savedQuery);
    return savedQuery;
  }

  getSavedQueries(userId?: string): SavedQuery[] {
    const queries = Array.from(this.savedQueries.values());
    if (userId) {
      return queries.filter(q => q.userId === userId);
    }
    return queries;
  }

  deleteSavedQuery(id: string): boolean {
    return this.savedQueries.delete(id);
  }

  async explainQuery(query: string): Promise<any[]> {
    try {
      const result = await pool.query(`EXPLAIN (FORMAT JSON, ANALYZE) ${query}`);
      return result.rows;
    } catch (error: any) {
      throw new Error(`Failed to explain query: ${error.message}`);
    }
  }
}

export const queryService = new QueryService();
