'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

function getGraphQLEndpoint() {
  if (typeof window !== 'undefined') {
    // Client-side: always use relative URL
    return '/api/graphql';
  }
  
  // Server-side: Check for explicit GraphQL endpoint first
  if (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  }
  
  // Build from deployment environment
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  // Vercel deployment
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`;
  }
  
  // Replit deployment
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `${protocol}://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/graphql`;
  }
  
  // Development fallback
  return 'http://localhost:5000/api/graphql';
}

export function makeClient() {
  const httpLink = new HttpLink({
    uri: getGraphQLEndpoint(),
    credentials: 'include',
    fetchOptions: {
      cache: 'no-store',
    },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            errorLink,
            httpLink,
          ])
        : ApolloLink.from([errorLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}
