/**
 * Environment Configuration
 * يستكشف متغيرات البيئة تلقائياً ويوفر قيم افتراضية ذكية
 */

/**
 * استكشاف رابط Replit تلقائياً
 */
export function getReplitUrl(): string {
  // في Production: استخدم REPLIT_DOMAINS
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    return `https://${domain}`;
  }
  
  // في Development: استخدم localhost
  return 'http://localhost:3000';
}

/**
 * توليد NEXTAUTH_SECRET تلقائياً إذا لم يكن موجوداً
 */
export function getNextAuthSecret(): string {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  
  // في Development فقط: استخدم قيمة افتراضية
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ NEXTAUTH_SECRET not set, using default value for development');
    return 'c2QtP07BJvhPp+2Rd0/5LeyND1JYqF4VArxSQFc+Ggw=';
  }
  
  throw new Error('NEXTAUTH_SECRET must be set in production');
}

/**
 * الحصول على NEXTAUTH_URL
 */
export function getNextAuthUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // استكشاف تلقائي من REPLIT_DOMAINS
  return getReplitUrl();
}

/**
 * تصدير جميع متغيرات البيئة المطلوبة
 */
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // NextAuth
  NEXTAUTH_SECRET: getNextAuthSecret(),
  NEXTAUTH_URL: getNextAuthUrl(),
  
  // Replit Info
  REPLIT_DOMAINS: process.env.REPLIT_DOMAINS || '',
  REPL_OWNER: process.env.REPL_OWNER || '',
  REPL_ID: process.env.REPL_ID || '',
  
  // Node
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validation
if (!env.DATABASE_URL && env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL must be set in production');
}

// Log في Development
if (env.NODE_ENV === 'development') {
  console.log('🔧 Environment Configuration:');
  console.log('  - NEXTAUTH_URL:', env.NEXTAUTH_URL);
  console.log('  - DATABASE_URL:', env.DATABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('  - NEXTAUTH_SECRET:', env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not set');
}
