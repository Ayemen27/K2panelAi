# 🔐 API & Authentication System

## نظرة عامة

نظام API والمصادقة هو **العمود الفقري** للمنصة - يدير جميع البيانات، المصادقة، والترخيص.

---

## المكونات

### 1. GraphQL API
```yaml
التقنية: Apollo Server v5 + GraphQL
المسؤولية: API الرئيسي للمنصة
```

**Schema الرئيسي:**
```graphql
type User {
  id: ID!
  email: String!
  name: String
  servers: [Server!]!
  projects: [Project!]!
}

type Server {
  id: ID!
  name: String!
  ipAddress: String!
  status: ServerStatus!
  agents: [Agent!]!
  metrics: ServerMetrics
}

type Project {
  id: ID!
  name: String!
  serverId: ID!
  files: [File!]!
}

type Agent {
  id: ID!
  type: AgentType!
  status: AgentStatus!
  config: JSON
}

enum ServerStatus {
  ONLINE
  OFFLINE
  ERROR
}

enum AgentType {
  PERFORMANCE_MONITOR
  LOG_ANALYZER
  SECURITY_MONITOR
  DATABASE_MANAGER
  BACKUP_RECOVERY
}
```

### 2. Authentication Service
```yaml
التقنية الحالية: Firebase Auth
التقنية المستهدفة: NextAuth.js + SQLite
المسؤولية: إدارة المستخدمين والمصادقة
```

**استراتيجية المصادقة:**
- Email + Password
- OAuth (Google, GitHub) - اختياري
- JWT Tokens (short-lived)
- Refresh Tokens (long-lived)

### 3. Authorization Layer
```yaml
المسؤولية: التحقق من الصلاحيات
```

**نموذج الصلاحيات:**
```typescript
// مثال: التحقق من الصلاحيات
async function canAccessServer(userId: string, serverId: string) {
  const server = await db.servers.findUnique({
    where: { id: serverId }
  })
  
  return server.userId === userId
}
```

---

## Endpoints الرئيسية

### GraphQL Queries:
```graphql
query GetServers {
  servers {
    id
    name
    status
    agents {
      type
      status
    }
  }
}

query GetProjects($serverId: ID!) {
  projects(serverId: $serverId) {
    id
    name
    files {
      path
      size
    }
  }
}
```

### GraphQL Mutations:
```graphql
mutation LinkServer($input: LinkServerInput!) {
  linkServer(input: $input) {
    server {
      id
      bridgeToken
    }
  }
}

mutation ExecuteAgent($agentId: ID!, $action: String!) {
  executeAgent(agentId: $agentId, action: $action) {
    jobId
    status
  }
}
```

### Authentication:
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    refreshToken
    user {
      id
      email
    }
  }
}
```

---

## البنية المعمارية

```
src/server/
├── graphql/
│   ├── schema.ts           # GraphQL Schema
│   ├── resolvers/
│   │   ├── user.ts
│   │   ├── server.ts
│   │   ├── project.ts
│   │   └── agent.ts
│   └── context.ts          # Apollo Context (user, db, etc)
│
├── auth/
│   ├── providers/
│   │   ├── firebase.ts     # Firebase Auth (حالي)
│   │   └── nextauth.ts     # NextAuth (مستهدف)
│   ├── middleware.ts       # Auth Middleware
│   └── tokens.ts           # JWT utilities
│
└── db/
    ├── schema.prisma       # Prisma Schema
    ├── client.ts           # Prisma Client
    └── migrations/         # Database migrations
```

---

## قاعدة البيانات

### Schema (Prisma):
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  servers   Server[]
  projects  Project[]
  createdAt DateTime @default(now())
}

model Server {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  ipAddress   String
  bridgeToken String   @unique
  status      String   @default("offline")
  agents      Agent[]
  createdAt   DateTime @default(now())
}

model Project {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  serverId  String
  name      String
  path      String
  createdAt DateTime @default(now())
}

model Agent {
  id        String   @id @default(uuid())
  serverId  String
  server    Server   @relation(fields: [serverId], references: [id])
  type      String
  config    Json?
  status    String   @default("stopped")
  createdAt DateTime @default(now())
}
```

---

## التكامل مع الأنظمة الأخرى

### مع Control Plane:
```typescript
// Frontend يستخدم Apollo Client
import { ApolloClient } from '@apollo/client'

const client = new ApolloClient({
  uri: '/api/graphql',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### مع Bridge Coordination:
```typescript
// API يرسل أوامر للـ Bridge
await bridge.sendCommand(serverId, {
  type: 'EXECUTE_AGENT',
  agentId: 'agent-123',
  action: 'run'
})
```

---

## الأمان

### 1. Authentication Flow:
```
User → Login → JWT Token → API Request → Verify Token → Allow/Deny
```

### 2. Authorization Checks:
```typescript
// في كل resolver
if (!context.user) {
  throw new Error('Unauthorized')
}

if (!canAccessServer(context.user.id, serverId)) {
  throw new Error('Forbidden')
}
```

### 3. Rate Limiting:
```typescript
// حماية من Brute Force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests
})
```

---

## المهام ذات الصلة

- المطور 3: NextAuth + SQLite Migration
- المطور 4: GraphQL Schema Extension
- المطور 9: Bridge Service Integration

---

## الحالة الحالية

**ما هو موجود (SaaS Boilerplate):**
- ✅ Apollo Server v5
- ✅ Apollo Client v4
- ✅ Firebase Authentication
- ✅ Basic GraphQL schema (users, categories)

**ما يجب إضافته:**
- [ ] Migrate to NextAuth.js
- [ ] Server management schema
- [ ] Project management schema
- [ ] Agent management schema
- [ ] Bridge coordination endpoints
- [ ] SQLite database

---

## الوثائق ذات الصلة

- [`../01_ARCHITECTURE/SYSTEM_OVERVIEW.md`](../../01_ARCHITECTURE/SYSTEM_OVERVIEW.md)
- [`../04_SECURITY/SECURITY_POLICY.md`](../../04_SECURITY/SECURITY_POLICY.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_03.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_03.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_04.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_04.md)

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ موثق
