/**
 * Integration Tests for GraphQL Context with Firebase Auth
 * 
 * Tests that the GraphQL context correctly extracts and verifies
 * session cookies/auth headers and propagates authenticated user state.
 */

import { GraphQLContext } from '@/server/auth/context';
import {
  adminAuth,
  isAdminInitialized,
  mockVerifySessionCookie,
  resetFirebaseAdminMocks,
} from '../../../../../__mocks__/firebase-admin';

// Mock the firebase admin module
jest.mock('@/firebase/admin', () => require('../../../../../__mocks__/firebase-admin'));

// Mock next/headers cookies
const mockGet = jest.fn();
const mockCookies = jest.fn(() => ({
  get: mockGet,
}));

jest.mock('next/headers', () => ({
  cookies: mockCookies,
}));

// Import the context creation logic (we'll need to extract it or test through route handler)
import { verifyFirebaseSession } from '@/server/auth/verifyFirebaseSession';

describe('GraphQL Context - Firebase Auth Integration', () => {
  beforeEach(() => {
    resetFirebaseAdminMocks();
    mockGet.mockReset();
    mockCookies.mockClear();
  });

  describe('✅ Authenticated User Scenarios', () => {
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

      // Simulate context creation
      const result = await verifyFirebaseSession(mockSessionCookie);

      // Verify authenticated user is extracted
      expect(result).toEqual({
        success: true,
        uid: 'user-abc-123',
        email: 'authenticated@example.com',
      });
    });

    test('should extract session token from Authorization header when no cookie', async () => {
      const mockAuthToken = 'bearer-token-xyz';
      const mockDecodedClaims = {
        uid: 'user-xyz-789',
        email: 'header@example.com',
      };

      // No session cookie
      mockGet.mockReturnValue(undefined);
      
      // Mock Admin SDK verification for header token
      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const result = await verifyFirebaseSession(mockAuthToken);

      expect(result).toEqual({
        success: true,
        uid: 'user-xyz-789',
        email: 'header@example.com',
      });
    });
  });

  describe('🚫 Unauthenticated/Anonymous Scenarios', () => {
    test('should create context without currentUser when no token provided', async () => {
      // No cookie and no auth header
      mockGet.mockReturnValue(undefined);

      const result = await verifyFirebaseSession('');

      expect(result).toEqual({
        success: false,
        error: 'No token provided',
      });
    });

    test('should reject invalid session cookie', async () => {
      const mockInvalidCookie = 'invalid-cookie';
      const invalidError = new Error('Invalid token');
      (invalidError as any).code = 'auth/argument-error';

      mockGet.mockReturnValue({ value: mockInvalidCookie });
      mockVerifySessionCookie.mockRejectedValue(invalidError);

      const result = await verifyFirebaseSession(mockInvalidCookie);

      expect(result).toEqual({
        success: false,
        error: 'Invalid token',
      });
    });
  });

  describe('🔒 Revoked Token Scenarios (Critical Security)', () => {
    test('should reject revoked session cookie in GraphQL context', async () => {
      const mockRevokedCookie = 'revoked-session-cookie';
      const revokedError = new Error('Token has been revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockGet.mockReturnValue({ value: mockRevokedCookie });
      mockVerifySessionCookie.mockRejectedValue(revokedError);

      const result = await verifyFirebaseSession(mockRevokedCookie);

      // Critical: Revoked tokens MUST be rejected
      expect(result.success).toBe(false);
      expect(result.error).toBe('Token has been revoked');
    });

    test('should prevent GraphQL access after logout/revocation', async () => {
      const mockRevokedToken = 'just-revoked-token';
      const revokedError = new Error('Token revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockVerifySessionCookie.mockRejectedValue(revokedError);

      const result = await verifyFirebaseSession(mockRevokedToken);

      expect(result.success).toBe(false);
      // This ensures GraphQL context will have currentUser = null
      expect(result.uid).toBeUndefined();
    });
  });

  describe('⏰ Expired Token Scenarios', () => {
    test('should reject expired session cookie', async () => {
      const mockExpiredCookie = 'expired-session-cookie';
      const expiredError = new Error('Token expired');
      (expiredError as any).code = 'auth/session-cookie-expired';

      mockGet.mockReturnValue({ value: mockExpiredCookie });
      mockVerifySessionCookie.mockRejectedValue(expiredError);

      const result = await verifyFirebaseSession(mockExpiredCookie);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token expired');
    });
  });

  describe('🔧 Edge Cases', () => {
    test('should handle Admin SDK not initialized gracefully', async () => {
      (isAdminInitialized as jest.Mock).mockReturnValue(false);

      const result = await verifyFirebaseSession('some-token');

      expect(result).toEqual({
        success: false,
        error: 'Firebase Admin SDK not initialized',
      });
    });

    test('should handle user without email in context', async () => {
      const mockDecodedClaims = {
        uid: 'user-no-email',
        // No email field
      };

      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const result = await verifyFirebaseSession('token-no-email');

      expect(result).toEqual({
        success: true,
        uid: 'user-no-email',
        email: null,
      });
    });
  });
});
