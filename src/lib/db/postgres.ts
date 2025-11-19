import { Pool } from 'pg';

// إنشاء Pool للاتصال بقاعدة PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// معالجة الأخطاء بدون إيقاف العملية
pool.on('error', (err: Error) => {
  console.error('⚠️ Unexpected error on idle PostgreSQL client:', err.message);
  // لا نوقف العملية - فقط نسجل الخطأ
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL client connected');
});

pool.on('remove', () => {
  console.log('🔌 PostgreSQL client removed from pool');
});

// دالة للتحقق من الاتصال
export async function testConnection() {
  let client;
  try {
    // محاولة الاتصال مع timeout أطول للاختبار
    client = await Promise.race([
      pool.connect(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 15s')), 15000)
      )
    ]);
    
    const result = await client.query('SELECT NOW() as now');
    console.log('✅ PostgreSQL connection successful:', result.rows[0].now);
    return true;
  } catch (error: any) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.error('Make sure DATABASE_URL is set correctly in Replit Secrets');
    return false;
  } finally {
    if (client) {
      try {
        client.release();
      } catch (e) {
        // تجاهل أخطاء release
      }
    }
  }
}

// دالة لتنفيذ استعلام مع retry logic
export async function query<T = any>(text: string, params?: any[], retries = 3): Promise<T[]> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query(text, params);
      return result.rows;
    } catch (error: any) {
      lastError = error;
      console.error(`Query attempt ${attempt + 1}/${retries} failed:`, error.message);
      
      // إذا كان الخطأ بسبب انقطاع الاتصال، ننتظر قليلاً قبل المحاولة مرة أخرى
      if (error.message.includes('Connection terminated') && attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // إذا كان خطأ آخر، نرميه مباشرة
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  
  throw lastError || new Error('Query failed after retries');
}

// دالة لتنفيذ transaction
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// دالة لإغلاق Pool بشكل آمن
export async function closePool() {
  try {
    await pool.end();
    console.log('✅ PostgreSQL pool closed successfully');
  } catch (error: any) {
    console.error('⚠️ Error closing PostgreSQL pool:', error.message);
  }
}

// معالجة إغلاق التطبيق
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closePool);
  process.on('SIGINT', closePool);
}

export default pool;
