import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor() {
    super('workspaces');
  }

  async findByOwnerId(ownerId: string, options: PaginationOptions = {}): Promise<PaginationResult<Workspace>> {
    const { page = 1, perPage = 12 } = options;
    const offset = (page - 1) * perPage;

    const countQuery = 'SELECT COUNT(*) FROM workspaces WHERE owner_id = $1';
    const dataQuery = `
      SELECT * FROM workspaces 
      WHERE owner_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery, [ownerId]),
      this.query<Workspace>(dataQuery, [ownerId, perPage, offset]),
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

  async createWorkspace(data: {
    name: string;
    description?: string;
    owner_id: string;
  }): Promise<Workspace> {
    return this.create(data);
  }

  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace | null> {
    return this.update(id, data);
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async isOwner(workspaceId: string, userId: string): Promise<boolean> {
    const query = 'SELECT id FROM workspaces WHERE id = $1 AND owner_id = $2';
    const result = await this.queryOne(query, [workspaceId, userId]);
    return result !== null;
  }
}

export const workspaceRepository = new WorkspaceRepository();
