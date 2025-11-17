/**
 * Integration Tests for GraphQL Context with Firebase Auth
 * 
 * Tests that the GraphQL context correctly extracts and verifies
 * session cookies/auth headers and propagates authenticated user state.
 * 
 * This tests the ACTUAL context creation logic used in production
 */

import {
  mockVerifySessionCookie,
  resetFirebaseAdminMocks,
} from '../../../../../__mocks__/firebase-admin';

// Mock the firebase admin module
jest.mock('@/firebase/admin', () => require('../../../../../__mocks__/firebase-admin'));

// Mock next/headers cookies
const mockGet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockGet,
  })),
}));

// Mock datasources
jest.mock('@/server/graphql/datasources', () => ({
  createDataSources: jest.fn(() => ({ projects: {}, categories: {} })),
}));

// Import the REAL context creation function
import { createContext } from '@/server/auth/context';

describe('GraphQL Context - Real Integration Tests', () => {
  beforeEach(() => {
    resetFirebaseAdminMocks();
    mockGet.mockReset();
  });

  describe('✅ Authenticated User - Cookie Flow', () => {
    test('should create context with currentUser from valid session cookie', async () => {
      const mockSessionCookie = 'valid-session-cookie-123';
      const mockDecodedClaims = {
        uid: 'user-abc-123',
        email: 'authenticated@example.com',
      };

      // Mock cookies.get() to return session cookie
      mockGet.mockReturnValue({ value: mockSessionCookie });
      
      // Mock Admin SDK verification
      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      // Create context (simulates what happens in GraphQL handler)
      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      // Critical: Verify currentUser is populated
      expect(context.currentUser).toEqual({
        uid: 'user-abc-123',
        email: 'authenticated@example.com',
      });
      expect(context.dataSources).toBeDefined();
    });
  });

  describe('✅ Authenticated User - Header Flow', () => {
    test('should create context with currentUser from Authorization header', async () => {
      const mockAuthToken = 'bearer-token-xyz';
      const mockDecodedClaims = {
        uid: 'user-xyz-789',
        email: 'header@example.com',
      };

      // No session cookie
      mockGet.mockReturnValue(undefined);
      
      // Mock Admin SDK verification
      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      // Mock request with Authorization header
      const mockRequest = {
        headers: { get: jest.fn((name: string) => 
          name === 'authorization' ? `Bearer ${mockAuthToken}` : null
        )},
      };
      const context = await createContext(mockRequest);

      // Verify currentUser is populated from header
      expect(context.currentUser).toEqual({
        uid: 'user-xyz-789',
        email: 'header@example.com',
      });
    });
  });

  describe('🚫 Unauthenticated/Anonymous Scenarios', () => {
    test('should create context with null currentUser when no token provided', async () => {
      // No cookie and no auth header
      mockGet.mockReturnValue(undefined);

      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      // Critical: currentUser should be null for anonymous
      expect(context.currentUser).toBeNull();
      expect(context.dataSources).toBeDefined();
    });

    test('should create context with null currentUser for invalid cookie', async () => {
      const mockInvalidCookie = 'invalid-cookie';
      const invalidError = new Error('Invalid token');
      (invalidError as any).code = 'auth/argument-error';

      mockGet.mockReturnValue({ value: mockInvalidCookie });
      mockVerifySessionCookie.mockRejectedValue(invalidError);

      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      // Invalid token should result in null currentUser
      expect(context.currentUser).toBeNull();
    });
  });

  describe('🔒 Revoked Token Scenarios (Critical Security)', () => {
    test('should create context with null currentUser for revoked cookie', async () => {
      const mockRevokedCookie = 'revoked-session-cookie';
      const revokedError = new Error('Token has been revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockGet.mockReturnValue({ value: mockRevokedCookie });
      mockVerifySessionCookie.mockRejectedValue(revokedError);

      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      // CRITICAL SECURITY: Revoked tokens MUST NOT populate currentUser
      expect(context.currentUser).toBeNull();
      expect(mockVerifySessionCookie).toHaveBeenCalledWith(mockRevokedCookie, true);
    });

    test('should block GraphQL access after logout/revocation via header', async () => {
      const mockRevokedToken = 'just-revoked-header-token';
      const revokedError = new Error('Token revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockGet.mockReturnValue(undefined);
      mockVerifySessionCookie.mockRejectedValue(revokedError);

      const mockRequest = {
        headers: { get: jest.fn((name: string) => 
          name === 'authorization' ? `Bearer ${mockRevokedToken}` : null
        )},
      };
      const context = await createContext(mockRequest);

      // CRITICAL: Revoked token via header should also result in null user
      expect(context.currentUser).toBeNull();
    });
  });

  describe('⏰ Expired Token Scenarios', () => {
    test('should create context with null currentUser for expired cookie', async () => {
      const mockExpiredCookie = 'expired-session-cookie';
      const expiredError = new Error('Token expired');
      (expiredError as any).code = 'auth/session-cookie-expired';

      mockGet.mockReturnValue({ value: mockExpiredCookie });
      mockVerifySessionCookie.mockRejectedValue(expiredError);

      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      // Expired token should not populate currentUser
      expect(context.currentUser).toBeNull();
    });
  });

  describe('🔧 Edge Cases', () => {
    test('should handle user without email in context', async () => {
      const mockDecodedClaims = {
        uid: 'user-no-email',
        // No email field
      };

      mockGet.mockReturnValue({ value: 'token-no-email' });
      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const mockRequest = {
        headers: { get: jest.fn(() => null) },
      };
      const context = await createContext(mockRequest);

      expect(context.currentUser).toEqual({
        uid: 'user-no-email',
        email: null,
      });
    });

    test('should prioritize cookie over Authorization header', async () => {
      const mockCookieToken = 'cookie-token';
      const mockHeaderToken = 'header-token';
      const mockDecodedClaims = {
        uid: 'user-from-cookie',
        email: 'cookie@example.com',
      };

      // Both cookie and header present
      mockGet.mockReturnValue({ value: mockCookieToken });
      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const mockRequest = {
        headers: { get: jest.fn((name: string) => 
          name === 'authorization' ? `Bearer ${mockHeaderToken}` : null
        )},
      };
      const context = await createContext(mockRequest);

      // Cookie should be used (not header)
      expect(context.currentUser?.uid).toBe('user-from-cookie');
      expect(mockVerifySessionCookie).toHaveBeenCalledWith(mockCookieToken, true);
    });
  });
});
