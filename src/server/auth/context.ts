import { DataSources, createDataSources } from '../graphql/datasources';
import { GraphQLError } from 'graphql';
import { verifyFirebaseSession } from './verifyFirebaseSession';
import { cookies } from 'next/headers';

export interface FirebaseUser {
  uid: string;
  email?: string | null;
}

export interface GraphQLContext {
  dataSources: DataSources;
  currentUser?: FirebaseUser | null;
}

export async function createContext(req: {
  headers: { get: (name: string) => string | null };
}): Promise<GraphQLContext> {
  let sessionToken: string | undefined;

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('__session');
  if (sessionCookie) {
    sessionToken = sessionCookie.value;
  } else {
    const authHeader = req.headers.get('authorization');
    sessionToken = authHeader?.replace('Bearer ', '') || undefined;
  }

  let currentUser = null;

  if (sessionToken) {
    const result = await verifyFirebaseSession(sessionToken);
    if (result.success && result.uid) {
      currentUser = {
        uid: result.uid,
        email: result.email,
      };
    }
  }

  return {
    dataSources: createDataSources(),
    currentUser,
  };
}

export function requireAuth(context: GraphQLContext): FirebaseUser {
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

export function optionalAuth(context: GraphQLContext): FirebaseUser | null {
  return context.currentUser || null;
}
