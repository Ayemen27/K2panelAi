import { BaseRepository } from './BaseRepository';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: Date;
  updated_at: Date;
}

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('categories');
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    return this.queryOne<Category>(query, [slug]);
  }

  async findAllCategories(): Promise<Category[]> {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    return this.query<Category>(query);
  }
}

export const categoryRepository = new CategoryRepository();
