# 👤 مهام المطور 4 - GraphQL Migration

> **📍 أنت هنا**: المطور الرابع - نقل GraphQL  
> **⬅️ السابق**: [`DEVELOPER_03.md`](DEVELOPER_03.md)  
> **➡️ التالي**: [`DEVELOPER_05.md`](DEVELOPER_05.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## 🎯 مهمتك الرئيسية

**أنت المطور الرابع** - مسؤوليتك:
- ✅ **مراجعة GraphQL الموجود** في SaaS Boilerplate
- ✅ **تبسيط Schema** (إزالة ما لا نحتاجه)
- ✅ **إضافة Queries/Mutations جديدة** للـ Workspace
- ✅ **التحقق من عدم تكرار** أي resolvers موجودة
- ✅ **دمج مع Auth** من Developer 3
- ✅ **التسليم للمطور 5** مع GraphQL يعمل

**تقدير الجهد**: 3-4 أيام (24 ساعة)  
**الأولوية**: 🔴 حرج - GraphQL هو API الأساسي

---

## ✅ قائمة التحقق من إعادة الاستخدام (إلزامية!)

### **قبل البدء**:
- [ ] ✅ راجعت GraphQL Schema الموجود في src/server/graphql
- [ ] ✅ فحصت ServerAutomationAI - هل يحتوي API؟
- [ ] ✅ حددت Queries/Mutations الموجودة القابلة لإعادة الاستخدام
- [ ] ✅ وثّقت ما سأحذف وما سأبقي

### **بعد الانتهاء**:
- [ ] ✅ تأكدت من عدم إنشاء resolvers مكررة
- [ ] ✅ راجعت Schema - لا تكرار في Types
- [ ] ✅ وثّقت في HANDOFF التغييرات

---

## 📋 المهام التفصيلية

### **Phase 1: تحليل GraphQL الموجود** ⏱️ 4 ساعات

```bash
# فحص Schema الحالي
cat src/server/graphql/schema.graphql
cat src/server/graphql/resolvers/*.ts

# تحديد ما نحتاجه
```

**ما نحتاجه**:
```graphql
# ✅ نحتفظ بـ:
- User type
- Query: me, user, users
- Mutation: createUser, updateUser

# ❌ نحذف:
- كل ما يتعلق بـ Firebase
- Stripe types/queries
- Analytics types
```

---

### **Phase 2: تنظيف Schema** ⏱️ 3 ساعات

```graphql
# src/server/graphql/schema.graphql

type User {
  id: ID!
  name: String!
  email: String!
  image: String
  createdAt: DateTime!
  workspaces: [Workspace!]!
}

type Workspace {
  id: ID!
  name: String!
  ownerId: ID!
  owner: User!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  me: User
  user(id: ID!): User
  workspaces: [Workspace!]!
  workspace(id: ID!): Workspace
}

type Mutation {
  createWorkspace(name: String!): Workspace!
  updateWorkspace(id: ID!, name: String!): Workspace!
  deleteWorkspace(id: ID!): Boolean!
}
```

---

### **Phase 3: إنشاء Resolvers** ⏱️ 8 ساعات

```typescript
// src/server/graphql/resolvers/workspace.ts

import db from '@/lib/db/sqlite';
import { AuthenticationError } from 'apollo-server-errors';

export const workspaceResolvers = {
  Query: {
    workspaces: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const workspaces = db.prepare(`
        SELECT * FROM workspaces WHERE ownerId = ?
      `).all(context.user.id);
      
      return workspaces;
    },
    
    workspace: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const workspace = db.prepare(`
        SELECT * FROM workspaces WHERE id = ? AND ownerId = ?
      `).get(id, context.user.id);
      
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      
      return workspace;
    },
  },
  
  Mutation: {
    createWorkspace: async (_: any, { name }: { name: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const id = crypto.randomUUID();
      const now = Date.now();
      
      db.prepare(`
        INSERT INTO workspaces (id, name, ownerId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, name, context.user.id, now, now);
      
      return {
        id,
        name,
        ownerId: context.user.id,
        createdAt: new Date(now),
        updatedAt: new Date(now)
      };
    },
  },
};
```

---

### **Phase 4: دمج مع Auth** ⏱️ 4 ساعات

```typescript
// src/server/graphql/context.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function createContext({ req, res }: any) {
  const session = await getServerSession(req, res, authOptions);
  
  return {
    user: session?.user,
    session,
  };
}
```

---

### **Phase 5: الاختبار** ⏱️ 3 ساعات

```graphql
# اختبارات:

# 1. Create Workspace
mutation {
  createWorkspace(name: "My First Workspace") {
    id
    name
    createdAt
  }
}

# 2. Get Workspaces
query {
  workspaces {
    id
    name
    owner {
      name
      email
    }
  }
}

# 3. Protected Query (without auth)
# المتوقع: AuthenticationError
```

---

## 📝 Deliverables

- [ ] Schema منظف وبسيط
- [ ] Resolvers تعمل مع SQLite
- [ ] دمج مع NextAuth
- [ ] اختبارات تنجح
- [ ] HANDOFF للمطور 5

---

## ✅ معايير القبول

**يُقبل عندما**:
- [x] ✅ GraphQL queries تعمل
- [x] ✅ Mutations تعمل مع Auth
- [x] ✅ Schema نظيف (لا Firebase/Stripe)
- [x] ✅ Database integration يعمل
- [x] ✅ Git Tag: `dev4_complete`

---

## 📊 تقدير الوقت

| المرحلة | الوقت |
|---------|-------|
| Phase 1: التحليل | 4 ساعات |
| Phase 2: التنظيف | 3 ساعات |
| Phase 3: Resolvers | 8 ساعات |
| Phase 4: Auth Integration | 4 ساعات |
| Phase 5: الاختبار | 3 ساعات |
| Phase 6: Push | 2 ساعات |
| **المجموع** | **24 ساعة (3-4 أيام)** |

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ جاهز للتنفيذ  
**تقدير الجهد**: 3-4 أيام (24 ساعة)
