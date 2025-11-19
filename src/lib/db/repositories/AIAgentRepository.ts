import { BaseRepository } from './BaseRepository';

export type AgentStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';

export interface AIAgent {
  id: string;
  workspace_id: string;
  server_id: string | null;
  name: string;
  agent_type: string;
  status: AgentStatus;
  config: any;
  last_run_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class AIAgentRepository extends BaseRepository<AIAgent> {
  constructor() {
    super('ai_agents');
  }

  async findByWorkspaceId(workspaceId: string): Promise<AIAgent[]> {
    const query = `
      SELECT * FROM ai_agents 
      WHERE workspace_id = $1 
      ORDER BY created_at DESC
    `;
    return this.query<AIAgent>(query, [workspaceId]);
  }

  async findByServerId(serverId: string): Promise<AIAgent[]> {
    const query = `
      SELECT * FROM ai_agents 
      WHERE server_id = $1 
      ORDER BY created_at DESC
    `;
    return this.query<AIAgent>(query, [serverId]);
  }

  async findByStatus(status: AgentStatus): Promise<AIAgent[]> {
    const query = 'SELECT * FROM ai_agents WHERE status = $1 ORDER BY created_at DESC';
    return this.query<AIAgent>(query, [status]);
  }

  async createAgent(data: {
    workspace_id: string;
    server_id?: string;
    name: string;
    agent_type: string;
    config?: any;
  }): Promise<AIAgent> {
    return this.create({ ...data, status: 'IDLE' as AgentStatus });
  }

  async updateStatus(id: string, status: AgentStatus): Promise<AIAgent | null> {
    const query = `
      UPDATE ai_agents 
      SET status = $2, last_run_at = CASE WHEN $2 = 'RUNNING' THEN CURRENT_TIMESTAMP ELSE last_run_at END
      WHERE id = $1 
      RETURNING *
    `;
    return this.queryOne<AIAgent>(query, [id, status]);
  }

  async updateConfig(id: string, config: any): Promise<AIAgent | null> {
    return this.update(id, { config } as Partial<AIAgent>);
  }
}

export const aiAgentRepository = new AIAgentRepository();
