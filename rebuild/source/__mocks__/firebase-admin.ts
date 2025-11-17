// Mock for firebase-admin module
import { jest } from '@jest/globals';

export const mockVerifySessionCookie = jest.fn<any>();
export const mockCreateSessionCookie = jest.fn<any>();
export const mockRevokeRefreshTokens = jest.fn<any>();
export const mockListUsers = jest.fn<any>();

export const adminAuth = {
  verifySessionCookie: mockVerifySessionCookie,
  createSessionCookie: mockCreateSessionCookie,
  revokeRefreshTokens: mockRevokeRefreshTokens,
  listUsers: mockListUsers,
};

export const isAdminInitialized = jest.fn<any>(() => true);
export const getInitializationError = jest.fn<any>(() => null);

// Reset helper for tests
export const resetFirebaseAdminMocks = () => {
  mockVerifySessionCookie.mockReset();
  mockCreateSessionCookie.mockReset();
  mockRevokeRefreshTokens.mockReset();
  mockListUsers.mockReset();
  (isAdminInitialized as jest.Mock).mockReturnValue(true);
  (getInitializationError as jest.Mock).mockReturnValue(null);
};
