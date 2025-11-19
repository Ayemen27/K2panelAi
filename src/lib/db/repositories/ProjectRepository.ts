import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  demo_url: string | null;
  repl_url: string | null;
  author_id: string | null;
  category_id: string | null;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectFilters extends PaginationOptions {
  featured?: boolean;
  categoryId?: string;
  authorId?: string;
}

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects');
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const query = 'SELECT * FROM projects WHERE slug = $1';
    return this.queryOne<Project>(query, [slug]);
  }

  async findWithFilters(filters: ProjectFilters = {}): Promise<PaginationResult<Project>> {
    const { page = 1, perPage = 12, featured, categoryId, authorId } = filters;
    const offset = (page - 1) * perPage;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (featured !== undefined) {
      conditions.push(`is_featured = $${paramIndex++}`);
      params.push(featured);
    }

    if (categoryId) {
      conditions.push(`category_id = $${paramIndex++}`);
      params.push(categoryId);
    }

    if (authorId) {
      conditions.push(`author_id = $${paramIndex++}`);
      params.push(authorId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM projects ${whereClause}`;
    const dataQuery = `
      SELECT * FROM projects 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery, params),
      this.query<Project>(dataQuery, [...params, perPage, offset]),
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

  async findFeatured(limit: number = 6): Promise<Project[]> {
    const query = `
      SELECT * FROM projects 
      WHERE is_featured = true 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    return this.query<Project>(query, [limit]);
  }

  async incrementViews(id: string): Promise<void> {
    const query = 'UPDATE projects SET views_count = views_count + 1 WHERE id = $1';
    await this.query(query, [id]);
  }

  async incrementLikes(id: string): Promise<void> {
    const query = 'UPDATE projects SET likes_count = likes_count + 1 WHERE id = $1';
    await this.query(query, [id]);
  }
}

export const projectRepository = new ProjectRepository();
