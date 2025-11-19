import { BaseRepository } from './BaseRepository';

export interface User {
  id: string;
  name: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  email_verified: Date | null;
  image: string | null;
  avatar_url: string | null;
  password: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    return this.queryOne<User>(query, [email]);
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    return this.queryOne<User>(query, [username]);
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 OR username = $1';
    return this.queryOne<User>(query, [emailOrUsername]);
  }

  async createUser(data: {
    name?: string;
    email: string;
    password?: string;
    image?: string;
  }): Promise<User> {
    return this.create(data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return this.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.delete(id);
  }
}

export const userRepository = new UserRepository();
