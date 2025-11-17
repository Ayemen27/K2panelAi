import { jwtVerify, importX509 } from 'jose';

// Firebase session cookie public keys (X.509 certificates, not JWKS)
const SESSION_COOKIE_KEYS_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys';

// Cache for public keys
let publicKeysCache: Record<string, any> = {};
let cacheExpiry: number = 0;

// Custom key resolver for Firebase session cookies
async function sessionPublicKeyResolver(protectedHeader: any) {
  const { kid, alg } = protectedHeader;
  
  // Check if cache is expired or key is missing
  const now = Date.now();
  if (now >= cacheExpiry || !publicKeysCache[kid]) {
    // Fetch public keys
    const response = await fetch(SESSION_COOKIE_KEYS_URL);
    const publicKeys = await response.json();
    
    // Cache expiry from Cache-Control header (default: 1 hour)
    const cacheControl = response.headers.get('cache-control');
    const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
    cacheExpiry = now + (maxAge ? parseInt(maxAge) * 1000 : 3600000);
    
    // Import all X.509 certificates
    publicKeysCache = {};
    for (const [keyId, cert] of Object.entries(publicKeys)) {
      publicKeysCache[keyId] = await importX509(cert as string, alg);
    }
  }
  
  return publicKeysCache[kid];
}

export interface VerifySessionResult {
  success: boolean;
  uid?: string;
  email?: string | null;
  error?: string;
}

export async function verifyFirebaseSession(token: string): Promise<VerifySessionResult> {
  if (!token) {
    return {
      success: false,
      error: 'No token provided'
    };
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    return {
      success: false,
      error: 'Firebase project ID not configured'
    };
  }

  try {
    // Verify session cookie with custom key resolver
    const { payload } = await jwtVerify(token, sessionPublicKeyResolver, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
      algorithms: ['RS256'],
    });

    return {
      success: true,
      uid: payload.sub,
      email: payload.email as string | null | undefined,
    };
  } catch (error: any) {
    console.error('[verifyFirebaseSession] Verification failed:', error.message);
    return {
      success: false,
      error: error.message || 'Token verification failed'
    };
  }
}
