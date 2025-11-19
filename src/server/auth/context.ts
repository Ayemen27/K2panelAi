import { DataSources, createDataSources } from '../graphql/datasources';
import { GraphQLError } from 'graphql';
import { cookies } from 'next/headers';

// TODO: Developer 3 will replace this with NextAuth
export interface User {
  uid: string;
  email?: string | null;
}

export interface GraphQLContext {
  dataSources: DataSources;
  currentUser?: User | null;
}

export async function createContext(req: {
  headers: { get: (name: string) => string | null };
}): Promise<GraphQLContext> {
  // TODO: Developer 3 will implement NextAuth session verification here
  // For now, returning null user (unauthenticated)
  let currentUser: User | null = null;

  // Placeholder for future NextAuth implementation
  // const cookieStore = cookies();
  // const sessionCookie = cookieStore.get('next-auth.session-token');
  // if (sessionCookie) {
  //   currentUser = await verifyNextAuthSession(sessionCookie.value);
  // }

  return {
    dataSources: createDataSources(),
    currentUser,
  };
}

export function requireAuth(context: GraphQLContext): User {
  if (!context.currentUser) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
  
  return context.currentUser;
}

export function optionalAuth(context: GraphQLContext): User | null {
  return context.currentUser || null;
}
