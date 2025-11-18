# 🎛️ Control Plane System

## نظرة عامة

**Control Plane** هو الواجهة الأمامية الرئيسية للمنصة - حيث يتفاعل المستخدمون مع النظام.

---

## المكونات

### 1. Dashboard (لوحة التحكم)
```yaml
التقنية: Next.js 14 + React 18 + Tailwind CSS
المسؤولية: الواجهة الرئيسية للمستخدمين
```

**الصفحات الرئيسية:**
- `/dashboard` - نظرة عامة على السيرفرات والمشاريع
- `/servers` - إدارة السيرفرات المربوطة
- `/projects` - إدارة المشاريع
- `/agents` - إدارة الوكلاء الذكية
- `/monitoring` - مراقبة الأداء
- `/settings` - إعدادات الحساب

### 2. Marketing Pages
```yaml
المسؤولية: صفحات عامة (قبل تسجيل الدخول)
```

**الصفحات:**
- `/` - الصفحة الرئيسية
- `/features` - الميزات
- `/pricing` - الأسعار
- `/docs` - التوثيق
- `/blog` - المدونة

### 3. Authentication UI
```yaml
المسؤولية: واجهات تسجيل الدخول والتسجيل
```

**الصفحات:**
- `/login` - تسجيل الدخول
- `/signup` - إنشاء حساب جديد
- `/forgot-password` - استعادة كلمة المرور
- `/verify-email` - تأكيد البريد الإلكتروني

---

## البنية المعمارية

```
src/
├── app/
│   ├── (marketing)/      # الصفحات العامة
│   │   ├── page.tsx      # الصفحة الرئيسية
│   │   ├── features/
│   │   ├── pricing/
│   │   └── docs/
│   │
│   ├── (auth)/           # صفحات المصادقة
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   │
│   └── (app)/            # Dashboard (محمي)
│       ├── dashboard/
│       ├── servers/
│       ├── projects/
│       ├── agents/
│       ├── monitoring/
│       └── settings/
│
├── components/
│   ├── layout/           # مكونات التخطيط
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/               # مكونات UI قابلة لإعادة الاستخدام
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   │
│   └── features/         # مكونات خاصة بالميزات
│       ├── ServerCard.tsx
│       ├── ProjectCard.tsx
│       └── AgentCard.tsx
│
└── lib/
    ├── apollo-client.ts  # Apollo Client setup
    └── utils.ts          # أدوات مساعدة
```

---

## التكامل مع الأنظمة الأخرى

### مع API & Authentication:
```typescript
// استخدام Apollo Client للاتصال بالـ GraphQL API
import { useQuery } from '@apollo/client'

const { data, loading } = useQuery(GET_SERVERS)
```

### مع Web Terminal:
```typescript
// دمج Terminal Component
import Terminal from '@/components/features/Terminal'

<Terminal serverId={server.id} />
```

### مع Code Editor:
```typescript
// دمج Monaco Editor
import CodeEditor from '@/components/features/CodeEditor'

<CodeEditor file={selectedFile} />
```

### مع AI Chat:
```typescript
// دمج AI Chat Interface
import AIChat from '@/components/features/AIChat'

<AIChat context={projectContext} />
```

---

## المهام ذات الصلة

- المطور 5: Terminal Component
- المطور 6: File Manager UI
- المطور 7: Code Editor Integration
- المطور 8: AI Chat Interface
- المطور 10: Server Monitoring Dashboard

---

## الحالة الحالية

**ما هو موجود (SaaS Boilerplate):**
- ✅ Next.js 14 setup
- ✅ Dashboard layout
- ✅ Firebase Authentication UI
- ✅ Basic components (Button, Card, etc)

**ما يجب إضافته:**
- [ ] Server management UI
- [ ] Project workspace UI
- [ ] Agent management UI
- [ ] Monitoring dashboards
- [ ] Terminal integration
- [ ] Code Editor integration
- [ ] AI Chat integration

---

## التوسعة المطلوبة

```typescript
// مثال: إضافة Server Management Page

// app/(app)/servers/page.tsx
export default function ServersPage() {
  const { data } = useQuery(GET_SERVERS)
  
  return (
    <div>
      <h1>My Servers</h1>
      <ServerList servers={data.servers} />
      <Button onClick={openLinkServerModal}>
        Link New Server
      </Button>
    </div>
  )
}
```

---

## الوثائق ذات الصلة

- [`../01_ARCHITECTURE/SYSTEM_OVERVIEW.md`](../../01_ARCHITECTURE/SYSTEM_OVERVIEW.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_05.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_05.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_06.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_06.md)
- [`../05_OPERATIONS/AGENT_TASKS/DEVELOPER_10.md`](../../05_OPERATIONS/AGENT_TASKS/DEVELOPER_10.md)

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ موثق
