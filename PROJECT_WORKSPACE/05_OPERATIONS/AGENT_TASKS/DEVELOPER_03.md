# 👤 مهام المطور 3 - NextAuth + SQLite

> **📍 أنت هنا**: المطور الثالث - نظام المصادقة  
> **⬅️ السابق**: [`DEVELOPER_02.md`](DEVELOPER_02.md)  
> **➡️ التالي**: [`DEVELOPER_04.md`](DEVELOPER_04.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## 🎯 مهمتك الرئيسية

**أنت المطور الثالث** - مسؤوليتك:
- ✅ **تثبيت NextAuth** بدلاً من Firebase Auth
- ✅ **إعداد SQLite database** للإنتاج
- ✅ **إصلاح broken imports** من حذف Firebase
- ✅ **إنشاء Auth flow كامل** (Login/Signup/Logout)
- ✅ **التحقق من عدم تكرار** أي نظام auth موجود
- ✅ **التسليم للمطور 4** بـ Auth يعمل 100%

**تقدير الجهد**: 3-4 أيام  
**الأولوية**: 🔴 حرج - Auth هو الأساس

---

## 📚 قبل أن تبدأ

### **1. اقرأ HANDOFF من Developer 2** ⏱️ 30 دقيقة:

- [ ] راجع HANDOFF من Developer 2
- [ ] تأكد من:
  - ✅ Firebase محذوف بالكامل
  - ✅ package.json نظيف
  - ✅ Git Tag: `dev2_complete` موجود
  - ✅ DELETION_LIST.md موجود

### **2. راجع هذه الملفات** ⏱️ 1 ساعة:

- [ ] [`../../00_MISSION/PROJECT_VISION.md`](../../00_MISSION/PROJECT_VISION.md) - الرؤية
- [ ] [`../../01_ARCHITECTURE/SYSTEM_OVERVIEW.md`](../../01_ARCHITECTURE/SYSTEM_OVERVIEW.md) - البنية (قسم Auth)
- [ ] [`../../04_SECURITY/SECURITY_POLICY.md`](../../04_SECURITY/SECURITY_POLICY.md) - سياسة الأمان

---

## ✅ قائمة التحقق من إعادة الاستخدام (إلزامية!)

### **قبل البدء**:
- [ ] ✅ بحثت في ServerAutomationAI - هل يحتوي على نظام Auth؟
- [ ] ✅ فحصت هل يوجد SQLite database بالفعل في المشروع
- [ ] ✅ راجعت الكود الموجود - أي auth middleware موجود؟
- [ ] ✅ حددت ما سأعيد استخدامه من الكود القديم

### **بعد الانتهاء**:
- [ ] ✅ تأكدت من عدم إنشاء auth logic مكرر
- [ ] ✅ راجعت أن SQLite واحدة فقط (لا تكرار)
- [ ] ✅ وثّقت في HANDOFF ما أعدت استخدامه

---

## 📋 المهام التفصيلية

### **Phase 1: الإعداد والتخطيط** ⏱️ 4 ساعات

#### **1.1 Clone من Git Tag السابق**
```bash
git fetch --tags
git checkout dev2_complete
git describe --tags  # يجب: dev2_complete
```

#### **1.2 فحص الوضع الحالي**
```bash
# 1. ابحث عن أي auth موجود
grep -r "auth\|login\|session" src/ --exclude-dir=node_modules | head -20

# 2. افحص ServerAutomationAI
ls -la ServerAutomationAI/
grep -r "auth" ServerAutomationAI/ | head -10

# 3. افحص database موجودة
find . -name "*.db" -o -name "*.sqlite"
```

#### **1.3 التخطيط**
```markdown
# خطة Auth:

## المطلوب:
- NextAuth.js v4 (مجاني)
- SQLite adapter (مجاني)
- Email/Password provider
- Magic Link (اختياري)

## البنية:
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts  # NextAuth config
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
└── lib/
    ├── auth/
    │   ├── config.ts        # NextAuth options
    │   ├── adapter.ts       # SQLite adapter
    │   └── middleware.ts    # Route protection
    └── db/
        └── sqlite.ts        # Database client
```

---

### **Phase 2: تثبيت Dependencies** ⏱️ 1 ساعة

```bash
# ⚠️ لا تنفذ هذا في Replit!
# فقط عدّل package.json والسيرفر سيثبتها

# أضف في package.json:
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "@auth/prisma-adapter": "^1.0.0",  # أو
    "better-sqlite3": "^9.2.2",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.8"
  }
}
```

**Commit:**
```bash
git add package.json
git commit -m "feat(auth): add NextAuth and SQLite dependencies"
```

---

### **Phase 3: إنشاء SQLite Database** ⏱️ 3 ساعات

#### **3.1 إنشاء Database Client**
```typescript
// src/lib/db/sqlite.ts

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_URL || 
               path.join(process.cwd(), 'data', 'app.db');

const db = new Database(dbPath);

// إنشاء جداول Auth
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified INTEGER,
    image TEXT,
    password TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    expires INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires INTEGER NOT NULL,
    PRIMARY KEY (identifier, token)
  );

  CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts(userId);
  CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions(userId);
`);

export default db;
```

#### **3.2 إنشاء SQLite Adapter**
```typescript
// src/lib/auth/adapter.ts

import type { Adapter } from 'next-auth/adapters';
import db from '../db/sqlite';

export function SQLiteAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = crypto.randomUUID();
      const now = Date.now();
      
      const stmt = db.prepare(`
        INSERT INTO users (id, name, email, emailVerified, image, password, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(id, user.name, user.email, user.emailVerified ? 1 : 0, 
               user.image, null, now, now);
      
      return { ...user, id, createdAt: new Date(now), updatedAt: new Date(now) };
    },
    
    async getUser(id) {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      return user ? formatUser(user) : null;
    },
    
    async getUserByEmail(email) {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      return user ? formatUser(user) : null;
    },
    
    // ... باقي الـ adapter methods
    // (راجع NextAuth docs للتفاصيل الكاملة)
  };
}

function formatUser(user: any) {
  return {
    ...user,
    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt)
  };
}
```

---

### **Phase 4: إعداد NextAuth** ⏱️ 4 ساعات

#### **4.1 إنشاء NextAuth Config**
```typescript
// src/lib/auth/config.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SQLiteAdapter } from './adapter';
import bcrypt from 'bcrypt';
import db from '../db/sqlite';

export const authOptions: NextAuthOptions = {
  adapter: SQLiteAdapter(),
  
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = db.prepare('SELECT * FROM users WHERE email = ?')
                       .get(credentials.email) as any;
        
        if (!user || !user.password) {
          return null;
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        };
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};
```

#### **4.2 إنشاء API Route**
```typescript
// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

### **Phase 5: إنشاء صفحات Auth** ⏱️ 6 ساعات

#### **5.1 صفحة Login**
```typescript
// src/app/(auth)/login/page.tsx

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">تسجيل الدخول</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : 'دخول'}
          </button>
        </form>
        
        <p className="text-center text-sm">
          ليس لديك حساب؟{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            سجل الآن
          </a>
        </p>
      </div>
    </div>
  );
}
```

#### **5.2 صفحة Signup**
```typescript
// src/app/(auth)/signup/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs'; // استخدم bcryptjs للـ client side

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">إنشاء حساب جديد</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              8 أحرف على الأقل
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
          </button>
        </form>
        
        <p className="text-center text-sm">
          لديك حساب بالفعل؟{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            سجل دخول
          </a>
        </p>
      </div>
    </div>
  );
}
```

#### **5.3 إنشاء Signup API**
```typescript
// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import db from '@/lib/db/sqlite';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    
    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const id = crypto.randomUUID();
    const now = Date.now();
    
    db.prepare(`
      INSERT INTO users (id, name, email, password, emailVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NULL, ?, ?)
    `).run(id, name, email, hashedPassword, now, now);
    
    return NextResponse.json(
      { message: 'User created successfully', userId: id },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### **Phase 6: Route Protection Middleware** ⏱️ 2 ساعات

```typescript
// src/middleware.ts

import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workspace/:path*',
    '/api/protected/:path*'
  ],
};
```

---

### **Phase 7: الاختبار** ⏱️ 4 ساعات

#### **7.1 الاختبار المحلي (على السيرفر)**
```yaml
سيناريوهات الاختبار:

1. Signup Flow:
   - ✓ إنشاء حساب جديد
   - ✓ التحقق من وجود user في database
   - ✓ التحقق من hash كلمة المرور
   
2. Login Flow:
   - ✓ تسجيل دخول بحساب موجود
   - ✓ رفض كلمة مرور خاطئة
   - ✓ إنشاء session صحيح
   
3. Protected Routes:
   - ✓ الوصول لـ /dashboard بدون login → redirect لـ /login
   - ✓ الوصول لـ /dashboard بعد login → نجاح
   
4. Session Management:
   - ✓ Session تستمر بعد refresh
   - ✓ Logout يحذف session
```

**Commit:**
```bash
git add .
git commit -m "feat(auth): complete NextAuth + SQLite implementation"
git tag -a dev3_complete -m "Developer 3: Auth system working"
```

---

### **Phase 8: Push والتحقق** ⏱️ 2 ساعات

```bash
cd ServerAutomationAI/bridge_tool
python3 cli.py push --message "Dev3: NextAuth + SQLite Auth"

# انتظر تقرير السيرفر
python3 cli.py status
```

**المتوقع من السيرفر**:
```yaml
Build: ✅ Success
Tests: ✅ All pass (auth tests)
Auth Flow: ✅ Working
Database: ✅ Created and migrated
```

---

## 📝 Deliverables النهائية

- [ ] SQLite database جاهزة (data/app.db)
- [ ] NextAuth configured
- [ ] Login page working
- [ ] Signup page working
- [ ] Protected routes middleware
- [ ] Session management working
- [ ] HANDOFF للمطور 4 مكتوب

---

## ✅ معايير القبول

### **يُقبل العمل عندما**:
- [x] ✅ يمكن إنشاء حساب جديد
- [x] ✅ يمكن تسجيل الدخول
- [x] ✅ Protected routes تعمل
- [x] ✅ Session تستمر بعد refresh
- [x] ✅ Logout يعمل
- [x] ✅ SQLite database تحتوي بيانات المستخدمين
- [x] ✅ Git Tag: `dev3_complete`

### **يُرفض العمل عندما**:
- [ ] ❌ Auth لا يعمل
- [ ] ❌ Protected routes لا تحمي
- [ ] ❌ Database فارغة أو بها أخطاء

---

## 📊 تقدير الوقت التفصيلي

| المرحلة | الوقت |
|---------|-------|
| Phase 1: الإعداد | 4 ساعات |
| Phase 2: Dependencies | 1 ساعة |
| Phase 3: SQLite | 3 ساعات |
| Phase 4: NextAuth Config | 4 ساعات |
| Phase 5: صفحات Auth | 6 ساعات |
| Phase 6: Middleware | 2 ساعات |
| Phase 7: الاختبار | 4 ساعات |
| Phase 8: Push | 2 ساعات |
| **المجموع** | **26 ساعة (~3-4 أيام)** |

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ جاهز للتنفيذ  
**تقدير الجهد**: 3-4 أيام (26 ساعة)
