import { BaseRepository, PaginationOptions, PaginationResult } from './BaseRepository';

export type FormStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

export interface FormSubmission {
  id: string;
  form_type: string;
  name: string | null;
  email: string;
  company: string | null;
  message: string | null;
  phone: string | null;
  status: FormStatus;
  extra_data: any;
  created_at: Date;
  updated_at: Date;
}

export interface FormSubmissionFilters extends PaginationOptions {
  formType?: string;
  status?: FormStatus;
}

export class FormSubmissionRepository extends BaseRepository<FormSubmission> {
  constructor() {
    super('form_submissions');
  }

  async findWithFilters(filters: FormSubmissionFilters = {}): Promise<PaginationResult<FormSubmission>> {
    const { page = 1, perPage = 20, formType, status } = filters;
    const offset = (page - 1) * perPage;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (formType) {
      conditions.push(`form_type = $${paramIndex++}`);
      params.push(formType);
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM form_submissions ${whereClause}`;
    const dataQuery = `
      SELECT * FROM form_submissions 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const [countResult, data] = await Promise.all([
      this.queryOne<{ count: string }>(countQuery, params),
      this.query<FormSubmission>(dataQuery, [...params, perPage, offset]),
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

  async submitForm(data: {
    form_type: string;
    name?: string;
    email: string;
    company?: string;
    message?: string;
    phone?: string;
    extra_data?: any;
  }): Promise<FormSubmission> {
    return this.create({ ...data, status: 'NEW' as FormStatus });
  }

  async updateStatus(id: string, status: FormStatus): Promise<FormSubmission | null> {
    return this.update(id, { status } as Partial<FormSubmission>);
  }
}

export const formSubmissionRepository = new FormSubmissionRepository();
