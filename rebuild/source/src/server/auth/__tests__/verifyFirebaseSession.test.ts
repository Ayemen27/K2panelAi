/**
 * Unit Tests for verifyFirebaseSession
 * 
 * Tests the critical security function that verifies Firebase session cookies
 * and checks for token revocation.
 */

import { verifyFirebaseSession } from '../verifyFirebaseSession';
import {
  adminAuth,
  isAdminInitialized,
  mockVerifySessionCookie,
  resetFirebaseAdminMocks,
} from '../../../../__mocks__/firebase-admin';

// Mock the firebase admin module
jest.mock('@/firebase/admin', () => require('../../../../__mocks__/firebase-admin'));

describe('verifyFirebaseSession', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    resetFirebaseAdminMocks();
  });

  describe('✅ Valid Token Scenarios', () => {
    test('should successfully verify a valid session cookie', async () => {
      const mockToken = 'valid-session-cookie';
      const mockDecodedClaims = {
        uid: 'user-123',
        email: 'test@example.com',
      };

      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: true,
        uid: 'user-123',
        email: 'test@example.com',
      });
      expect(mockVerifySessionCookie).toHaveBeenCalledWith(mockToken, true);
    });

    test('should handle user without email', async () => {
      const mockToken = 'valid-session-cookie-no-email';
      const mockDecodedClaims = {
        uid: 'user-456',
        // no email
      };

      mockVerifySessionCookie.mockResolvedValue(mockDecodedClaims);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: true,
        uid: 'user-456',
        email: null,
      });
    });
  });

  describe('🔒 Revoked Token Scenarios', () => {
    test('should reject revoked session cookie', async () => {
      const mockToken = 'revoked-session-cookie';
      const revokedError = new Error('Token has been revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockVerifySessionCookie.mockRejectedValue(revokedError);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: false,
        error: 'Token has been revoked',
      });
      expect(mockVerifySessionCookie).toHaveBeenCalledWith(mockToken, true);
    });

    test('should log warning for revoked tokens', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockToken = 'revoked-token';
      const revokedError = new Error('Revoked');
      (revokedError as any).code = 'auth/session-cookie-revoked';

      mockVerifySessionCookie.mockRejectedValue(revokedError);

      await verifyFirebaseSession(mockToken);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[verifyFirebaseSession] Session cookie has been revoked'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('⏰ Expired Token Scenarios', () => {
    test('should reject expired session cookie', async () => {
      const mockToken = 'expired-session-cookie';
      const expiredError = new Error('Token has expired');
      (expiredError as any).code = 'auth/session-cookie-expired';

      mockVerifySessionCookie.mockRejectedValue(expiredError);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: false,
        error: 'Token has expired',
      });
    });

    test('should log warning for expired tokens', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const mockToken = 'expired-token';
      const expiredError = new Error('Expired');
      (expiredError as any).code = 'auth/session-cookie-expired';

      mockVerifySessionCookie.mockRejectedValue(expiredError);

      await verifyFirebaseSession(mockToken);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[verifyFirebaseSession] Session cookie has expired'
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('❌ Invalid Token Scenarios', () => {
    test('should reject invalid session cookie format', async () => {
      const mockToken = 'invalid-format';
      const invalidError = new Error('Invalid token format');
      (invalidError as any).code = 'auth/argument-error';

      mockVerifySessionCookie.mockRejectedValue(invalidError);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: false,
        error: 'Invalid token format',
      });
    });

    test('should reject empty token', async () => {
      const result = await verifyFirebaseSession('');

      expect(result).toEqual({
        success: false,
        error: 'No token provided',
      });
      expect(mockVerifySessionCookie).not.toHaveBeenCalled();
    });

    test('should handle generic verification errors', async () => {
      const mockToken = 'some-token';
      const genericError = new Error('Unknown verification error');

      mockVerifySessionCookie.mockRejectedValue(genericError);

      const result = await verifyFirebaseSession(mockToken);

      expect(result).toEqual({
        success: false,
        error: 'Unknown verification error',
      });
    });
  });

  describe('🔧 Admin SDK Initialization', () => {
    test('should fail if Admin SDK is not initialized', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (isAdminInitialized as jest.Mock).mockReturnValue(false);

      const result = await verifyFirebaseSession('some-token');

      expect(result).toEqual({
        success: false,
        error: 'Firebase Admin SDK not initialized',
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[verifyFirebaseSession] Firebase Admin SDK is not initialized'
      );
      expect(mockVerifySessionCookie).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('🔐 Security: Revocation Check Parameter', () => {
    test('should always pass true to verifySessionCookie for revocation check', async () => {
      const mockToken = 'test-token';
      mockVerifySessionCookie.mockResolvedValue({ uid: 'user-123' });

      await verifyFirebaseSession(mockToken);

      // Critical: The second parameter MUST be true to check revocation
      expect(mockVerifySessionCookie).toHaveBeenCalledWith(mockToken, true);
    });
  });
});
