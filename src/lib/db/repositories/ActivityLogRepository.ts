import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export interface ActivityLog {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  server_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface ActivityLogFilters extends PaginationOptions {
  userId?: string;
  workspaceId?: string;
  serverId?: string;
  resourceType?: string;
  action?: string;
}

export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor() {
    super('activity_logs');
  }

  async findWithFilters(filters: ActivityLogFilters = {}): Promise<PaginationResult<ActivityLog>> {
    const { page = 1, perPage = 50, userId, workspaceId, serverId, resourceType, action } = filters;
    const offset = (page - 1) * perPage;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (userId) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(userId);
    }

    if (workspaceId) {
      conditions.push(`workspace_id = $${paramIndex++}`);
      params.push(workspaceId);
    }

    if (serverId) {
      conditions.push(`server_id = $${paramIndex++}`);
      params.push(serverId);
    }

    if (resourceType) {
      conditions.push(`resource_type = $${paramIndex++}`);
      params.push(resourceType);
    }

    if (action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(action);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM activity_logs ${whereClause}`;
    const dataQuery = `
      SELECT * FROM activity_logs 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery, params),
      this.query<ActivityLog>(dataQuery, [...params, perPage, offset]),
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

  async logActivity(data: {
    user_id?: string;
    workspace_id?: string;
    server_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    details?: any;
    ip_address?: string;
    user_agent?: string;
  }): Promise<ActivityLog> {
    return this.create(data);
  }

  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    const query = `
      DELETE FROM activity_logs 
      WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '${daysToKeep} days'
    `;
    const result = await this.query(query);
    return result.length;
  }
}

export const activityLogRepository = new ActivityLogRepository();
