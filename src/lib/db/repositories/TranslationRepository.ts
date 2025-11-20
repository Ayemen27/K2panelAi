
import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export interface TranslationOperation {
  id: string;
  user_id: string | null;
  operation_type: 'upload' | 'download' | 'verify' | 'sync' | 'fetch';
  status: 'success' | 'failed' | 'partial';
  keys_count: number;
  languages_count: number;
  namespaces: string[];
  error_message: string | null;
  duration_ms: number | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface TranslationKeysStat {
  id: string;
  total_keys: number;
  translated_keys: number;
  empty_keys: number;
  error_keys: number;
  language: string;
  namespace: string;
  last_sync_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TranslationError {
  id: string;
  key_name: string;
  language: string;
  namespace: string;
  error_type: 'empty' | 'missing' | 'invalid' | 'duplicate';
  error_details: string | null;
  resolved: boolean;
  created_at: Date;
  resolved_at: Date | null;
}

export interface TranslationStats {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  totalKeysUploaded: number;
  totalKeysDownloaded: number;
  lastOperation: TranslationOperation | null;
  errorsByLanguage: { language: string; count: number }[];
  operationsByType: { type: string; count: number }[];
}

export class TranslationRepository extends BaseRepository<TranslationOperation> {
  constructor() {
    super('translation_operations');
  }

  async logOperation(data: {
    user_id?: string;
    operation_type: 'upload' | 'download' | 'verify' | 'sync' | 'fetch';
    status: 'success' | 'failed' | 'partial';
    keys_count?: number;
    languages_count?: number;
    namespaces?: string[];
    error_message?: string;
    duration_ms?: number;
    ip_address?: string;
    user_agent?: string;
  }): Promise<TranslationOperation> {
    return this.create(data);
  }

  async getOperations(options: PaginationOptions = {}): Promise<PaginationResult<TranslationOperation>> {
    const { page = 1, perPage = 20 } = options;
    const offset = (page - 1) * perPage;

    const countQuery = 'SELECT COUNT(*) FROM translation_operations';
    const dataQuery = `
      SELECT * FROM translation_operations 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery),
      this.query<TranslationOperation>(dataQuery, [perPage, offset]),
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

  async getStatistics(): Promise<TranslationStats> {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_operations,
        COUNT(*) FILTER (WHERE status = 'success') as successful_operations,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_operations,
        SUM(CASE WHEN operation_type = 'upload' THEN keys_count ELSE 0 END) as total_keys_uploaded,
        SUM(CASE WHEN operation_type = 'download' THEN keys_count ELSE 0 END) as total_keys_downloaded
      FROM translation_operations
    `;

    const lastOpQuery = `
      SELECT * FROM translation_operations 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    const errorsByLangQuery = `
      SELECT language, COUNT(*) as count 
      FROM translation_errors 
      WHERE resolved = false
      GROUP BY language
    `;

    const opsByTypeQuery = `
      SELECT operation_type as type, COUNT(*) as count 
      FROM translation_operations 
      GROUP BY operation_type
    `;

    const [stats, lastOp, errorsByLang, opsByType] = await Promise.all([
      this.queryOne(statsQuery),
      this.queryOne<TranslationOperation>(lastOpQuery),
      this.query<{ language: string; count: string }>(errorsByLangQuery),
      this.query<{ type: string; count: string }>(opsByTypeQuery),
    ]);

    return {
      totalOperations: parseInt(stats?.total_operations || '0'),
      successfulOperations: parseInt(stats?.successful_operations || '0'),
      failedOperations: parseInt(stats?.failed_operations || '0'),
      totalKeysUploaded: parseInt(stats?.total_keys_uploaded || '0'),
      totalKeysDownloaded: parseInt(stats?.total_keys_downloaded || '0'),
      lastOperation: lastOp || null,
      errorsByLanguage: errorsByLang.map(e => ({ language: e.language, count: parseInt(e.count) })),
      operationsByType: opsByType.map(o => ({ type: o.type, count: parseInt(o.count) })),
    };
  }

  async updateKeyStats(data: {
    language: string;
    namespace: string;
    total_keys: number;
    translated_keys: number;
    empty_keys: number;
    error_keys: number;
  }): Promise<void> {
    const query = `
      INSERT INTO translation_keys_stats 
        (language, namespace, total_keys, translated_keys, empty_keys, error_keys, last_sync_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (language, namespace) 
      DO UPDATE SET 
        total_keys = $3,
        translated_keys = $4,
        empty_keys = $5,
        error_keys = $6,
        last_sync_at = NOW(),
        updated_at = NOW()
    `;

    await this.query(query, [
      data.language,
      data.namespace,
      data.total_keys,
      data.translated_keys,
      data.empty_keys,
      data.error_keys,
    ]);
  }

  async getKeyStats(): Promise<TranslationKeysStat[]> {
    return this.query<TranslationKeysStat>(
      'SELECT * FROM translation_keys_stats ORDER BY language, namespace'
    );
  }

  async logError(data: {
    key_name: string;
    language: string;
    namespace: string;
    error_type: 'empty' | 'missing' | 'invalid' | 'duplicate';
    error_details?: string;
  }): Promise<void> {
    const query = `
      INSERT INTO translation_errors 
        (key_name, language, namespace, error_type, error_details)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING
    `;

    await this.query(query, [
      data.key_name,
      data.language,
      data.namespace,
      data.error_type,
      data.error_details || null,
    ]);
  }

  async getErrors(resolved: boolean = false): Promise<TranslationError[]> {
    return this.query<TranslationError>(
      'SELECT * FROM translation_errors WHERE resolved = $1 ORDER BY created_at DESC',
      [resolved]
    );
  }

  async resolveError(errorId: string): Promise<void> {
    await this.query(
      'UPDATE translation_errors SET resolved = true, resolved_at = NOW() WHERE id = $1',
      [errorId]
    );
  }
}

export const translationRepository = new TranslationRepository();
