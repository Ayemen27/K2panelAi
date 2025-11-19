import { BaseRepository } from './BaseRepository';

export interface Terminal {
  id: string;
  server_id: string;
  session_id: string;
  is_active: boolean;
  created_at: Date;
  closed_at: Date | null;
}

export class TerminalRepository extends BaseRepository<Terminal> {
  constructor() {
    super('terminals');
  }

  async findByServerId(serverId: string): Promise<Terminal[]> {
    const query = `
      SELECT * FROM terminals 
      WHERE server_id = $1 
      ORDER BY created_at DESC
    `;
    return this.query<Terminal>(query, [serverId]);
  }

  async findActiveByServerId(serverId: string): Promise<Terminal[]> {
    const query = `
      SELECT * FROM terminals 
      WHERE server_id = $1 AND is_active = true 
      ORDER BY created_at DESC
    `;
    return this.query<Terminal>(query, [serverId]);
  }

  async findBySessionId(sessionId: string): Promise<Terminal | null> {
    const query = 'SELECT * FROM terminals WHERE session_id = $1';
    return this.queryOne<Terminal>(query, [sessionId]);
  }

  async createTerminal(data: {
    server_id: string;
    session_id: string;
  }): Promise<Terminal> {
    return this.create({ ...data, is_active: true });
  }

  async closeTerminal(id: string): Promise<Terminal | null> {
    const query = `
      UPDATE terminals 
      SET is_active = false, closed_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;
    return this.queryOne<Terminal>(query, [id]);
  }

  async closeAllByServerId(serverId: string): Promise<number> {
    const query = `
      UPDATE terminals 
      SET is_active = false, closed_at = CURRENT_TIMESTAMP 
      WHERE server_id = $1 AND is_active = true
    `;
    const result = await this.query(query, [serverId]);
    return result.length;
  }
}

export const terminalRepository = new TerminalRepository();
