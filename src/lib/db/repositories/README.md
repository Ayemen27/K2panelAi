# Database Repositories

طبقة الوصول إلى قاعدة البيانات (Data Access Layer) لمشروع K2Panel AI.

## البنية

```
repositories/
├── BaseRepository.ts           # Repository أساسي يحتوي على العمليات المشتركة
├── UserRepository.ts           # إدارة المستخدمين
├── ProjectRepository.ts        # إدارة المشاريع
├── WorkspaceRepository.ts      # إدارة مساحات العمل
├── ServerRepository.ts         # إدارة السيرفرات
├── CategoryRepository.ts       # إدارة التصنيفات
├── TerminalRepository.ts       # إدارة جلسات Terminal
├── AIAgentRepository.ts        # إدارة وكلاء الذكاء الاصطناعي
├── ActivityLogRepository.ts   # سجلات النشاط
├── FormSubmissionRepository.ts # نماذج الاتصال
└── index.ts                   # Exports جميع الـ repositories
```

## الاستخدام

### 1. استيراد Repository

```typescript
import { userRepository, projectRepository } from '@/lib/db/repositories';
```

### 2. العمليات الأساسية

#### البحث بواسطة ID
```typescript
const user = await userRepository.findById('user-id');
```

#### جلب كل البيانات مع Pagination
```typescript
const result = await projectRepository.findAll({
  page: 1,
  perPage: 12
});

console.log(result.data); // المشاريع
console.log(result.pageInfo); // معلومات الترقيم
```

#### إنشاء سجل جديد
```typescript
const newProject = await projectRepository.create({
  title: 'My Project',
  slug: 'my-project',
  description: 'A cool project',
  author_id: 'user-id'
});
```

#### تحديث سجل
```typescript
const updated = await projectRepository.update('project-id', {
  title: 'Updated Title'
});
```

#### حذف سجل
```typescript
const deleted = await projectRepository.delete('project-id');
```

### 3. عمليات خاصة

#### UserRepository
```typescript
// البحث عن مستخدم بالبريد الإلكتروني
const user = await userRepository.findByEmail('user@example.com');

// إنشاء مستخدم جديد
const newUser = await userRepository.createUser({
  name: 'Ahmed',
  email: 'ahmed@example.com',
  password: 'hashed-password'
});
```

#### ProjectRepository
```typescript
// جلب المشاريع المميزة
const featured = await projectRepository.findFeatured(6);

// البحث مع فلاتر
const projects = await projectRepository.findWithFilters({
  featured: true,
  categoryId: 'category-id',
  page: 1,
  perPage: 12
});

// زيادة عدد المشاهدات
await projectRepository.incrementViews('project-id');
```

#### WorkspaceRepository
```typescript
// جلب مساحات العمل الخاصة بمستخدم
const workspaces = await workspaceRepository.findByOwnerId('user-id');

// التحقق من ملكية Workspace
const isOwner = await workspaceRepository.isOwner('workspace-id', 'user-id');

// إنشاء workspace جديد
const workspace = await workspaceRepository.createWorkspace({
  name: 'My Workspace',
  description: 'Development environment',
  owner_id: 'user-id'
});
```

#### ServerRepository
```typescript
// جلب جميع السيرفرات في workspace
const servers = await serverRepository.findByWorkspaceId('workspace-id');

// الحصول على إحصائيات السيرفرات
const stats = await serverRepository.getServerStats('workspace-id');
console.log(stats); // { total: 5, online: 3, offline: 2, ... }

// تحديث حالة السيرفر
await serverRepository.updateStatus('server-id', 'ONLINE');
```

#### TerminalRepository
```typescript
// إنشاء جلسة terminal جديدة
const terminal = await terminalRepository.createTerminal({
  server_id: 'server-id',
  session_id: 'unique-session-id'
});

// جلب الجلسات النشطة
const activeSessions = await terminalRepository.findActiveByServerId('server-id');

// إغلاق جلسة
await terminalRepository.closeTerminal('terminal-id');
```

#### AIAgentRepository
```typescript
// إنشاء وكيل AI جديد
const agent = await aiAgentRepository.createAgent({
  workspace_id: 'workspace-id',
  server_id: 'server-id',
  name: 'Deployment Agent',
  agent_type: 'deployment',
  config: { autoRetry: true }
});

// تحديث حالة الوكيل
await aiAgentRepository.updateStatus('agent-id', 'RUNNING');

// جلب الوكلاء حسب الحالة
const runningAgents = await aiAgentRepository.findByStatus('RUNNING');
```

#### ActivityLogRepository
```typescript
// تسجيل نشاط
await activityLogRepository.logActivity({
  user_id: 'user-id',
  workspace_id: 'workspace-id',
  action: 'CREATE_SERVER',
  resource_type: 'server',
  resource_id: 'server-id',
  details: { serverName: 'Production Server' },
  ip_address: req.ip,
  user_agent: req.headers['user-agent']
});

// جلب السجلات مع فلاتر
const logs = await activityLogRepository.findWithFilters({
  workspaceId: 'workspace-id',
  action: 'CREATE_SERVER',
  page: 1,
  perPage: 50
});
```

#### FormSubmissionRepository
```typescript
// حفظ نموذج اتصال
const submission = await formSubmissionRepository.submitForm({
  form_type: 'contact',
  name: 'Ahmed',
  email: 'ahmed@example.com',
  message: 'Hello!',
  company: 'Tech Corp'
});

// جلب النماذج حسب الحالة
const newForms = await formSubmissionRepository.findWithFilters({
  status: 'NEW',
  page: 1
});

// تحديث حالة النموذج
await formSubmissionRepository.updateStatus('form-id', 'READ');
```

## استخدام في GraphQL Resolvers

```typescript
import { projectRepository } from '@/lib/db/repositories';

export const resolvers = {
  Query: {
    projects: async (_, { page, perPage, featured, category }) => {
      const result = await projectRepository.findWithFilters({
        page,
        perPage,
        featured,
        categoryId: category
      });
      
      return {
        projects: result.data,
        pageInfo: result.pageInfo,
        totalCount: result.pageInfo.totalCount
      };
    },
    
    project: async (_, { slug }) => {
      const project = await projectRepository.findBySlug(slug);
      if (project) {
        await projectRepository.incrementViews(project.id);
      }
      return project;
    }
  },
  
  Mutation: {
    createProject: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      return await projectRepository.create({
        ...input,
        author_id: context.user.id
      });
    }
  }
};
```

## Migrations

لتطبيق جميع الـ migrations على قاعدة البيانات:

### طريقة 1: عبر API
```bash
curl -X POST http://localhost:5000/api/db/migrate
```

### طريقة 2: عبر الكود
```typescript
import { migrate } from '@/lib/db/migrate';

const result = await migrate();
console.log(result.migrations); // قائمة الـ migrations المنفذة
```

## Best Practices

1. **استخدم Repositories دائماً** - لا تستعلم مباشرة من pool في الـ resolvers
2. **Transaction Management** - استخدم BaseRepository للعمليات البسيطة
3. **Error Handling** - تعامل مع الأخطاء بشكل مناسب
4. **Validation** - تحقق من البيانات قبل الإرسال للـ repository
5. **Pagination** - استخدم pagination للقوائم الطويلة

## TypeScript Support

جميع الـ repositories مكتوبة بـ TypeScript مع أنواع كاملة:

```typescript
import { Project, ProjectFilters } from '@/lib/db/repositories';

const filters: ProjectFilters = {
  page: 1,
  perPage: 12,
  featured: true
};

const result = await projectRepository.findWithFilters(filters);
const projects: Project[] = result.data;
```
