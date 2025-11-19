import { BaseRepository } from './BaseRepository';

export type ServerStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';

export interface Server {
  id: string;
  workspace_id: string;
  name: string;
  ip_address: string;
  port: number;
  status: ServerStatus;
  os: string | null;
  cpu: string | null;
  ram: string | null;
  disk: string | null;
  created_at: Date;
  updated_at: Date;
}

export class ServerRepository extends BaseRepository<Server> {
  constructor() {
    super('servers');
  }

  async findByWorkspaceId(workspaceId: string): Promise<Server[]> {
    const query = `
      SELECT * FROM servers 
      WHERE workspace_id = $1 
      ORDER BY created_at DESC
    `;
    return this.query<Server>(query, [workspaceId]);
  }

  async findByStatus(status: ServerStatus): Promise<Server[]> {
    const query = 'SELECT * FROM servers WHERE status = $1 ORDER BY created_at DESC';
    return this.query<Server>(query, [status]);
  }

  async createServer(data: {
    workspace_id: string;
    name: string;
    ip_address: string;
    port: number;
    os?: string;
    cpu?: string;
    ram?: string;
    disk?: string;
  }): Promise<Server> {
    return this.create({ ...data, status: 'OFFLINE' as ServerStatus });
  }

  async updateServer(id: string, data: Partial<Server>): Promise<Server | null> {
    return this.update(id, data);
  }

  async updateStatus(id: string, status: ServerStatus): Promise<Server | null> {
    return this.update(id, { status } as Partial<Server>);
  }

  async deleteServer(id: string): Promise<boolean> {
    return this.delete(id);
  }

  async getServerStats(workspaceId: string): Promise<{
    total: number;
    online: number;
    offline: number;
    maintenance: number;
    error: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'ONLINE') as online,
        COUNT(*) FILTER (WHERE status = 'OFFLINE') as offline,
        COUNT(*) FILTER (WHERE status = 'MAINTENANCE') as maintenance,
        COUNT(*) FILTER (WHERE status = 'ERROR') as error
      FROM servers 
      WHERE workspace_id = $1
    `;
    const result = await this.queryOne<any>(query, [workspaceId]);
    return {
      total: parseInt(result?.total || '0', 10),
      online: parseInt(result?.online || '0', 10),
      offline: parseInt(result?.offline || '0', 10),
      maintenance: parseInt(result?.maintenance || '0', 10),
      error: parseInt(result?.error || '0', 10),
    };
  }
}

export const serverRepository = new ServerRepository();
