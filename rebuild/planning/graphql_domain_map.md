# 🗺️ GraphQL Domain Map - REST → GraphQL Migration

**تاريخ الإنشاء**: 17 نوفمبر 2025  
**المرحلة**: Phase 2 - Apollo GraphQL Layer  
**الهدف**: تحديد REST endpoints المطلوب تحويلها لـ GraphQL حسب الأولويات

---

## 📊 نظرة عامة

### المصادر
- **Flask REST APIs الحالية**: 7 endpoints
- **Next.js Routes**: 18 route (8 منها تحتاج Apollo)
- **الأولوية**: التركيز على الصفحات ذات الأولوية العالية أولاً

---

## 🎯 REST APIs الموجودة حالياً

### 1. Projects Domain
```
GET  /api/projects              # قائمة المشاريع (featured, category, pagination)
GET  /api/projects/<slug>       # تفاصيل مشروع واحد
POST /api/projects              # إنشاء مشروع جديد (requires auth)
```

### 2. Categories Domain
```
GET  /api/categories            # قائمة الفئات
```

### 3. Authentication Domain
```
POST /auth/signup               # إنشاء حساب جديد
POST /auth/login                # تسجيل دخول
GET  /auth/me                   # معلومات المستخدم الحالي (requires auth)
```

### 4. Forms Domain
```
POST /api/forms/submit          # إرسال نموذج
```

---

## 🔄 Phase 2 - GraphQL Operations Priority

### ✅ **Priority 1: Critical Operations** (يوم 1-2)

#### **Projects Queries**
```graphql
type Query {
  # القائمة الرئيسية للمشاريع
  projects(
    featured: Boolean
    category: String
    page: Int = 1
    perPage: Int = 12
  ): ProjectConnection!
  
  # تفاصيل مشروع واحد
  project(slug: String!): Project
  
  # المشاريع المميزة (للصفحة الرئيسية)
  # Note: REST يستخدم per_page parameter وليس limit
  featuredProjects(perPage: Int = 6): [Project!]!
}

type ProjectConnection {
  edges: [Project!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type Project {
  id: ID!
  title: String!
  slug: String!
  description: String
  imageUrl: String
  demoUrl: String
  replUrl: String
  # Note: REST returns 'author' field (nested User object)
  author: User
  category: Category
  isFeatured: Boolean!
  viewsCount: Int!
  likesCount: Int!
  createdAt: String!
}

# Note: REST response structure
# - 'author' field يحتوي على nested User object (from Project.author.to_dict())
# - 'category' field يحتوي على nested Category object (from Project.category.to_dict())
# - viewsCount و likesCount موجودان في REST response
```

**الصفحات المستفيدة**:
- `/` (home) - featuredProjects
- `/gallery` - projects
- `/gallery/[categoriesSlug]` - projects(category)
- `/gallery/.../[detailSlug]` - project(slug)

**Data Source**: REST `/api/projects`

---

#### **Categories Queries**
```graphql
type Query {
  # قائمة جميع الفئات
  categories: [Category!]!
  
  # فئة واحدة بالـ slug
  category(slug: String!): Category
}

type Category {
  id: ID!
  name: String!
  slug: String!
  description: String
  icon: String
}

# Note: REST response structure for Category.to_dict():
# - يحتوي فقط على: id, name, slug, description, icon
# - ❌ لا يحتوي على projectsCount أو projects
# - يمكن إضافة projectsCount و projects كـ resolvers منفصلة في المستقبل
#   عبر query: projects(category: slug) للحصول على المشاريع
```

**الصفحات المستفيدة**:
- `/gallery` - categories
- `/gallery/[categoriesSlug]` - category(slug)

**Data Source**: REST `/api/categories`

---

#### **User/Auth Queries**
```graphql
type Query {
  # المستخدم الحالي (requires auth)
  me: User
}

type User {
  id: ID!
  username: String!
  email: String!
  firstName: String
  lastName: String
  profileImageUrl: String
  isActive: Boolean!
  createdAt: String!
  # Note: projects resolver سيستخدم /api/projects?user_id (غير متاح حالياً)
  # يمكن تنفيذها لاحقاً أو في client-side filtering
}
```

**الصفحات المستفيدة**:
- `/profile` - me (المستخدم الحالي فقط)
- `/auth` - me (للتحقق من الجلسة)
- Header/Navigation - me (لعرض اسم المستخدم)

**Data Source**: REST `/auth/me`

**ملاحظة**: 
- ❌ `user(username)` غير مدعوم - لا يوجد REST endpoint
- ❌ `projects` field سيتطلب إضافة query param `user_id` لـ `/api/projects` (مؤجل)

---

### 🟡 **Priority 2: Important Operations** (يوم 3)

#### **Authentication Mutations**
```graphql
type Mutation {
  # إنشاء حساب جديد
  signup(input: SignupInput!): AuthPayload!
  
  # تسجيل دخول
  login(input: LoginInput!): AuthPayload!
}

input SignupInput {
  # جميع الحقول مطلوبة في REST
  username: String!
  email: String!
  password: String!
  # optional fields
  firstName: String
  lastName: String
}

input LoginInput {
  # يطابق REST API الذي يتوقع email_or_username
  emailOrUsername: String!
  password: String!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}
```

**الصفحات المستفيدة**:
- `/auth/signup` - signup mutation
- `/auth/login` - login mutation

**Data Source**: REST `/auth/signup`, `/auth/login`

**تصحيحات**:
- ✅ `SignupInput.username` الآن required (يطابق REST)
- ✅ `LoginInput.emailOrUsername` بدلاً من `email` (يطابق REST)
- ✅ `AuthPayload` يعيد accessToken و refreshToken (يطابق REST response)

---

#### **Project Mutations**
```graphql
type Mutation {
  # إنشاء مشروع جديد (requires auth)
  createProject(input: CreateProjectInput!): Project!
}

input CreateProjectInput {
  # Required fields (يطابق REST requirements)
  title: String!
  slug: String!
  description: String!
  # Optional fields
  imageUrl: String
  demoUrl: String
  replUrl: String
  categoryId: ID
  isPublished: Boolean
}
```

**الصفحات المستفيدة**:
- `/projects/create` - createProject

**Data Source**: REST `/api/projects` (POST)

**تصحيحات**:
- ✅ `slug` و `description` الآن required (يطابق REST validation)
- ❌ **Removed unsupported mutations**:
  - `updateProject` - لا يوجد PUT/PATCH endpoint
  - `deleteProject` - لا يوجد DELETE endpoint
  - `likeProject/unlikeProject` - لا يوجد endpoints

**ملاحظة**: هذه العمليات يمكن إضافتها في المرحلة 2.3 بعد توسيع Flask REST API

---

### 🟢 **Priority 3: Nice-to-Have** (يوم 4)

#### **Forms Mutations**
```graphql
type Mutation {
  # إرسال نموذج تواصل
  submitForm(input: FormSubmissionInput!): FormSubmission!
}

input FormSubmissionInput {
  formType: String!
  name: String!
  email: String!
  company: String
  message: String
  phone: String
  extraData: JSON
}

type FormSubmission {
  id: ID!
  formType: String!
  submittedAt: String!
}
```

**الصفحات المستفيدة**:
- `/pricing` - submitForm (contact sales)
- `/help` - submitForm (support)
- `/enterprise` - submitForm (demo request)

**Data Source**: REST `/api/forms/submit`

---

## 📦 Data Sources Architecture

### REST Data Source Class Structure
```
src/server/graphql/datasources/
├── RestDataSource.ts          # Base class
├── ProjectsDataSource.ts      # Projects domain
├── CategoriesDataSource.ts    # Categories domain
├── AuthDataSource.ts          # Authentication domain
└── FormsDataSource.ts         # Forms domain
```

### Base REST Data Source
```typescript
// src/server/graphql/datasources/RestDataSource.ts
import { KeyValueCache } from '@apollo/utils.keyvaluecache';

export abstract class RestDataSource {
  protected baseURL: string;
  protected cache?: KeyValueCache;
  
  constructor(baseURL: string, cache?: KeyValueCache) {
    this.baseURL = baseURL;
    this.cache = cache;
  }
  
  protected async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    // Implementation with fetch + caching
  }
  
  protected async post<T>(path: string, body: any): Promise<T> {
    // Implementation with fetch
  }
}
```

---

## 🔐 Environment Variables Required

```env
# GraphQL Endpoint
NEXT_PUBLIC_GRAPHQL_ENDPOINT=/api/graphql

# REST Backend (Data Sources)
REST_API_BASE_URL=http://localhost:5000/api
REST_AUTH_BASE_URL=http://localhost:5000/auth

# JWT Secret (for auth context)
JWT_SECRET_KEY=<your-secret-key>
```

**الحالة**: 
- ✅ `NEXT_PUBLIC_GRAPHQL_ENDPOINT` موثق في `.env.local`
- ⏳ `REST_API_BASE_URL` و `REST_AUTH_BASE_URL` يحتاجان إضافة

---

## 🧩 Resolvers Structure

```
src/server/graphql/resolvers/
├── index.ts                # Combined resolvers
├── projectResolvers.ts     # Projects queries & mutations
├── categoryResolvers.ts    # Categories queries
├── userResolvers.ts        # User/Auth queries & mutations
└── formResolvers.ts        # Forms mutations
```

### Context Type
```typescript
export interface GraphQLContext {
  dataSources: {
    projectsAPI: ProjectsDataSource;
    categoriesAPI: CategoriesDataSource;
    authAPI: AuthDataSource;
    formsAPI: FormsDataSource;
  };
  user?: {
    id: string;
    email: string;
    username: string;
  };
  token?: string;
}
```

---

## 📁 Schema Files Structure

```
src/server/graphql/schema/
├── index.ts                # Combined schema
├── project.graphql         # Project types & operations
├── category.graphql        # Category types & operations
├── user.graphql            # User & Auth types & operations
├── form.graphql            # Form types & operations
└── common.graphql          # Shared types (PageInfo, etc)
```

---

## ⏱️ Implementation Timeline

### Day 1 (0.5 day - المهمة 2.1 الحالية)
- ✅ إنشاء `graphql_domain_map.md` (هذا الملف)
- ⏳ مراجعة واعتماد الخريطة

### Day 2 (1 day - المهمة 2.2)
- Schema design: إنشاء ملفات `.graphql`
- تعريف جميع Types و Operations
- إنشاء shared types (PageInfo, etc)

### Day 3 (1-1.5 days - المهمة 2.3)
- Data Sources: إنشاء REST data source classes
- Resolvers: تنفيذ resolvers للأولوية 1 و 2
- Context: إعداد GraphQL context مع auth

### Day 4 (0.5 day - المهمة 2.4)
- API Route: إنشاء `/api/graphql/route.ts`
- تثبيت dependencies: `@apollo/server`, `@as-integrations/next`
- اختبار GraphQL playground

### Day 5 (0.5 day - المهمة 2.5)
- Apollo Client SSR: تحسين apollo-client.ts للـ SSR
- Server Components: إضافة data fetching لأول صفحة
- اختبار SSR rendering

### Day 6 (0.5 day - المهمة 2.6)
- Validation: إضافة schema lint
- Documentation: توثيق الـ API
- Testing: smoke tests

---

## 📋 Acceptance Criteria - Phase 2

### ✅ Domain Map (المهمة 2.1)
- [x] تحديد جميع REST endpoints
- [x] تحديد GraphQL operations المطلوبة
- [x] تحديد الأولويات (P1, P2, P3)
- [x] تحديد Data Sources المطلوبة
- [x] تحديد Environment Variables
- [ ] **موافقة Architect على الخريطة**

### Schema Design (المهمة 2.2)
- [ ] ملفات `.graphql` لجميع domains
- [ ] shared types واضحة
- [ ] Schema يمر من TypeScript check
- [ ] توثيق كل Type و Field

### Data Sources & Resolvers (المهمة 2.3)
- [ ] REST data source classes
- [ ] Resolvers للأولوية 1 (Projects, Categories, User)
- [ ] Error handling
- [ ] Caching strategy
- [ ] Authentication في Context

### GraphQL API Route (المهمة 2.4)
- [ ] `/api/graphql/route.ts` يعمل
- [ ] GraphQL Playground متاح
- [ ] smoke test يمر
- [ ] logging يعمل

### SSR Integration (المهمة 2.5)
- [ ] Apollo Client SSR-ready
- [ ] صفحة واحدة على الأقل تعرض data من server
- [ ] لا client waterfalls
- [ ] cache hydration يعمل

### Validation & Docs (المهمة 2.6)
- [ ] Schema lint يمر
- [ ] Documentation في README
- [ ] Sample queries موثقة
- [ ] Test pipeline يمر

---

## 🚀 Pages → GraphQL Operations Mapping

| Page Route | Priority | GraphQL Operations | Status |
|-----------|----------|-------------------|--------|
| `/` (home) | High | `featuredProjects` | ⏳ Pending |
| `/pricing` | High | `categories`, `submitForm` | ⏳ Pending |
| `/gallery` | Medium | `projects`, `categories` | ⏳ Pending |
| `/gallery/[categoriesSlug]` | Medium | `projects(category)`, `category(slug)` | ⏳ Pending |
| `/gallery/.../[detailSlug]` | Medium | `project(slug)` | ⏳ Pending |
| `/products/[slug]` | High | Static content only | N/A |
| `/profile` | High | `me`, `createProject` | ⏳ Pending |
| `/auth/login` | High | `login` | ⏳ Pending |
| `/auth/signup` | High | `signup` | ⏳ Pending |
| `/help` | Medium | `submitForm` | ⏳ Pending |
| `/mobile` | Medium | Static content + `submitForm` | ⏳ Pending |

**ملاحظة**: تم إزالة العمليات غير المدعومة (user, updateProject, deleteProject, likeProject, unlikeProject)

---

## 📝 Notes & Decisions

### 1. **Firebase Auth vs REST Auth**
**القرار**: نستخدم Flask REST Auth حالياً، لكن سنتحول لـ Firebase Auth في المرحلة 3.  
**الحل المؤقت**: GraphQL context سيتحقق من JWT token من Flask.

### 2. **Caching Strategy**
- **Server-side**: Redis cache للـ REST responses (مستقبلاً)
- **Client-side**: Apollo InMemoryCache مع normalized caching
- **SSR**: Cache hydration من server إلى client

### 3. **Error Handling**
- REST errors → GraphQL errors مع proper error codes
- Authentication errors → throw AuthenticationError
- Validation errors → throw UserInputError

### 4. **Pagination**
- استخدام Relay-style cursor pagination
- PageInfo: hasNextPage, hasPreviousPage, startCursor, endCursor
- افتراضي: 12 items per page

---

## ✅ Ready for Next Task

هذا الملف جاهز لمراجعة Architect. بعد الموافقة، ننتقل للمهمة 2.2 (Schema Design).
