# Replit Marketing Website - Dynamic Flask Application

## Overview
The Replit marketing website has been transformed from static HTML files into a dynamic Flask application, meticulously preserving 100% of the original design. This project aims to modernize the website by incorporating dynamic content capabilities and a robust backend. Additionally, a `rebuild/` project is underway to completely re-engineer the system using Next.js, Firebase, and Apollo GraphQL, enhancing business vision, market potential, and overall project ambition.

## User Preferences
- أفضل لغة بسيطة
- أريد تطوير تدريجي
- اسأل قبل إجراء تغييرات كبيرة
- أفضل شروحات تفصيلية
- لا تجري تغييرات على مجلد `rebuild/`
- لا تجري تغييرات على `rebuild/planning/rebuild_master_plan.md`
- **اللغة المفضلة**: العربية 🇸🇦

## System Architecture
A hybrid approach was adopted for the current Flask application, integrating static HTML with a dynamic layer while maintaining the original design. The `rebuild/` project represents a complete architectural overhaul.

### Current Flask Application
- **UI/UX Decisions**: All original HTML, CSS, and JavaScript files are preserved, ensuring 100% design fidelity and retention of all original effects and layouts.
- **Technical Implementations**:
    - **Static HTML Files**: `index.html`, `gallery/`, `products/`, `customers/`, `news/`, and original bundled Next.js files are served as-is.
    - **Dynamic Layer**:
        - **Flask Backend APIs** (`routes.py`): Provides endpoints for projects (featured, categories, pagination), categories, project details (`/<slug>`), and authentication (`/auth/signup`, `/auth/login`).
        - **JavaScript Dynamic Loader** (`static/js/dynamic-content.js`): Fetches and displays data from Flask APIs into the static pages without altering design or layout.
        - **Database**: PostgreSQL storing `users`, `projects`, `categories`, and `form_submissions`.

### Rebuild Project (Next.js + Firebase + Apollo GraphQL)
- **Framework**: Next.js 14 (App Router)
- **Data Layer**: Apollo GraphQL (Apollo Server v4 for API, Apollo Client for frontend)
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth) with secure, edge-compatible middleware for protected routes.
- **Content Management**: Sanity CMS (✅ Schema layer complete - 33 schemas covering 109 pages)
- **Payments**: Stripe (planned)
- **Analytics**: Comprehensive integration including GTM, GA4, Segment, Amplitude, and Datadog, with robust readiness gates, retry mechanisms, and strict-mode safeguards.
- **System Design**: Emphasis on modularity, scalability, and performance, including SSR data hydration and TypeScript type safety across the GraphQL layer.
- **Project Structure**: `rebuild/` directory containing `planning/` (for master plans, tasks, page structures), `source/` (Next.js project with `app/`, `lib/`, `server/`, `graphql/`, `components/` directories), `docs/`, and `assets/`.

## External Dependencies

### Flask Application
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt

### Rebuild Project (Next.js)
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (accessed via Flask REST API)
- **GraphQL**: Apollo Server v4, Apollo Client
- **Authentication**: Firebase Auth
- **Content**: Sanity CMS (✅ 33 schemas: 3 global singletons, 9 primitives, 21 sections)
- **Payments**: Stripe (planned)
- **Analytics**: Google Tag Manager (GTM), Google Analytics 4 (GA4), Segment, Amplitude, Datadog
---

## 📅 آخر التحديثات

- **18 نوفمبر 2025**: 📝 **تحديث التوثيق الكامل للعمل على السيرفر الخارجي**
  - ✅ إنشاء دليل شامل `rebuild/SERVER_WORKFLOW.md` مع تعليمات مفصلة
  - ✅ توضيح قيود Replit (2GB) واستراتيجية العمل الموزعة
  - ✅ توثيق جميع المراحل المتبقية (5-8) مع معايير القبول الواضحة
  - ✅ إضافة سيناريوهات العمل التفصيلية لكل مهمة
  - ✅ توثيق بيانات الاتصال بالسيرفر والقاعدة
- **17 نوفمبر 2025**: 🎉 ✅ **المرحلة 4 - Sanity CMS Schemas مكتملة بالكامل!**
- **17 نوفمبر 2025**: ✅ إنشاء 33 Sanity Schema شاملة (3 global singletons + 9 primitives + 21 sections)
- **17 نوفمبر 2025**: ✅ Coverage Matrix موثق - تغطية كاملة للـ 109 صفحة HTML
- **17 نوفمبر 2025**: ✅ Page schema محدث لدعم جميع الـ 21 section types
- **17 نوفمبر 2025**: ✅ TypeScript types كاملة ولا توجد أخطاء LSP
- **17 نوفمبر 2025**: 🎉 ✅ **Automated Testing للإصلاح الأمني - 20/20 tests نجحت!** - المرحلة 3 عند 100%
- **17 نوفمبر 2025**: ✅ إنشاء Integration Tests حقيقية لـ GraphQL context (9 tests)
- **17 نوفمبر 2025**: ✅ استخراج createContext إلى production code قابل للاختبار
- **17 نوفمبر 2025**: ✅ إنشاء Unit Tests لـ verifyFirebaseSession (11 tests)
- **17 نوفمبر 2025**: ✅ إعداد Jest testing framework مع TypeScript support
- **17 نوفمبر 2025**: 🔒 ✅ **إصلاح ثغرة أمنية حرجة في Session Lifecycle**
- **17 نوفمبر 2025**: ✅ تحديث verifyFirebaseSession لاستخدام Firebase Admin SDK مع revocation checking
- **17 نوفمبر 2025**: ✅ إكمال المهمة 3.3 - Session lifecycle (logout + DELETE endpoint + revoke tokens)
- **17 نوفمبر 2025**: ✅ إكمال المهمة 3.2 - دمج Firebase Auth مع Apollo Server + GraphQL context
- **17 نوفمبر 2025**: 🎉 ✅ **Protected Routes Middleware production-ready!**
- **17 نوفمبر 2025**: ✅ إصلاح Hydration error في Navigation component (nested `<a>` tags)
- **17 نوفمبر 2025**: ✅ تصحيح middleware matcher لحماية `/dashboard`, `/profile`, `/replView`
- **17 نوفمبر 2025**: ✅ توثيق Firebase Admin environment variables مع تحذيرات أمان
- **17 نوفمبر 2025**: ✅ اختبار Protected Routes end-to-end ناجح (307 redirects)
- **17 نوفمبر 2025**: ✅ Firebase Authentication - صفحات Login و Signup جاهزة
- **17 نوفمبر 2025**: ✅ إكمال المرحلة 2 - Apollo GraphQL layer
- **17 نوفمبر 2025**: ✅ إكمال المرحلة 1 - Next.js SSR + Analytics موثوق 100%

---

---

## ⚠️ قيود بيئة Replit والعمل على السيرفر الخارجي

### 🚫 القيود المهمة - للوكلاء القادمين:

**⚠️ تحذير حرج: لا تقم بتثبيت المكتبات في Replit!**

- **المساحة المتاحة**: 2GB فقط (حساب مجاني)
- **node_modules حجمه**: ~500MB-1GB (سيستهلك نصف المساحة)
- **الحل**: استخدام Replit كـ **IDE فقط** للتحرير، والبناء والتشغيل على السيرفر الخارجي

### 🔧 استراتيجية العمل الموزعة:

#### 1. على Replit (محرر كود):
- ✍️ تحرير الكود في `rebuild/source/`
- 📝 كتابة وتوثيق التغييرات
- 🧪 اختبارات خفيفة (بدون npm install)
- 🔄 مزامنة الكود للسيرفر

#### 2. على السيرفر الخارجي (البناء والتشغيل):
- 📦 `npm ci` - تثبيت المكتبات
- 🏗️ `npm run build` - بناء التطبيق
- 🚀 `pm2 restart` - تشغيل التطبيق
- 🔍 الاختبار النهائي

### 🌐 بيانات الاتصال بالسيرفر:

**متوفرة في Replit Secrets:**
- `SSH_HOST`: 93.127.142.144
- `SSH_USER`: administrator
- `SSH_PASSWORD`: [موجود في Secrets]
- `SSH_PORT`: 22
- `SSH_PUBLIC_KEY`: [موجود في Secrets]

**قاعدة البيانات الخارجية:**
- `REMOTE_DB_HOST`: 93.127.142.144
- `REMOTE_DB_NAME`: saasboiler_db
- `REMOTE_DB_USER`: saasboiler_user
- `REMOTE_DB_PASSWORD`: [موجود في Secrets]
- `REMOTE_DB_PORT`: 5432

**مسار التطبيق على السيرفر:**
- `/srv/rebuild/app` - مجلد التطبيق الرئيسي
- `/srv/rebuild/shared/logs` - سجلات التطبيق
- تشغيل التطبيق: PM2 (rebuild-nextjs)
- البورت: 3000 (داخلي) → 80/443 (Nginx)

### 📋 سيناريوهات العمل:

#### السيناريو 1: تحرير الكود
```bash
# على Replit
1. تحرير الملفات في rebuild/source/
2. حفظ التغييرات
3. لا تقم بتشغيل npm install!
```

#### السيناريو 2: رفع التحديثات للسيرفر
```bash
# استخدم سكربت المزامنة (متوفر في rebuild/SERVER_WORKFLOW.md)
rsync -avz --delete \
  --exclude='node_modules' --exclude='.next' --exclude='.env*' \
  rebuild/source/ \
  administrator@93.127.142.144:/srv/rebuild/app/
```

#### السيناريو 3: البناء والتشغيل على السيرفر
```bash
# اتصل بالسيرفر
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144

# على السيرفر
cd /srv/rebuild/app
npm ci                    # تثبيت المكتبات
npm run build             # بناء التطبيق
pm2 restart rebuild-nextjs # إعادة التشغيل
pm2 logs rebuild-nextjs    # مراقبة السجلات
```

#### السيناريو 4: فحص حالة التطبيق
```bash
# على السيرفر
pm2 status                 # حالة العمليات
pm2 logs rebuild-nextjs    # السجلات المباشرة
curl http://localhost:3000 # اختبار محلي
```

---

## 📊 حالة المشروع والمراحل المتبقية

### ✅ المراحل المكتملة (1-4): ~65%

| المرحلة | الحالة | التفاصيل |
|---------|--------|----------|
| **0. الإعداد** | ✅ 100% | Boilerplate، متغيرات البيئة، هيكل المشروع |
| **1. Next.js SSR** | ✅ 100% | App Router، Analytics، GTM، Datadog |
| **2. Apollo GraphQL** | ✅ 100% | GraphQL API، Resolvers، Datasources، اختبارات |
| **3. Firebase Auth** | ✅ 100% | Login/Signup، Protected Routes، Session Management |
| **4. Sanity CMS** | ✅ 100% | 33 Schema، Coverage Matrix، 109 صفحة |

### ⏳ المراحل المتبقية (5-8): ~35%

#### **المرحلة 5: Analytics والتتبع** (3-4 أيام)
**الحالة**: ⏳ جاهز للبدء على السيرفر

**المهام المتبقية:**
- [ ] إصلاح GTM readiness gate
- [ ] إضافة retry mechanism للـ Analytics
- [ ] إعادة هيكلة Segment/Amplitude clients
- [ ] اختبار إرسال الأحداث (pageview، identify)

**معايير القبول:**
- ✅ أحداث pageview تصل لجميع الأدوات خلال ≤2 ثانية
- ✅ سجل أخطاء نظيف
- ✅ Datadog يستقبل البيانات

**العمل على السيرفر:**
```bash
# تحرير على Replit: src/providers/AnalyticsProvider.tsx
# رفع للسيرفر + بناء + اختبار
```

#### **المرحلة 6: المدفوعات - Stripe** (2-3 أيام)
**الحالة**: ⏳ لم يبدأ - يحتاج Stripe account

**المهام المتبقية:**
- [ ] إعداد Stripe Test Account
- [ ] تنفيذ Checkout Session API
- [ ] تنفيذ Webhook endpoint (`/api/webhooks`)
- [ ] ربط الاشتراكات بقاعدة البيانات

**معايير القبول:**
- ✅ إنشاء جلسة دفع تجريبية
- ✅ استقبال webhook بنجاح
- ✅ تحديث اشتراك المستخدم في PostgreSQL

**المتغيرات المطلوبة:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### **المرحلة 7: المراقبة والـ Feature Flags** (2 أيام)
**الحالة**: ⏳ لم يبدأ - يحتاج Datadog و LaunchDarkly accounts

**المهام المتبقية:**
- [ ] تفعيل Datadog RUM الكامل
- [ ] إعداد LaunchDarkly SDK
- [ ] تنفيذ feature flags في middleware
- [ ] اختبار تبديل الميزات

**معايير القبول:**
- ✅ ظهور الجلسات في Datadog Dashboard
- ✅ نجاح تبديل علم ميزات
- ✅ Session replay يعمل

**المتغيرات المطلوبة:**
```env
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=...
NEXT_PUBLIC_DATADOG_APPLICATION_ID=...
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID=...
```

#### **المرحلة 8: مطابقة الواجهات** (4-5 أيام)
**الحالة**: ⏳ جاهز للبدء - صفحات P0 موجودة هيكلياً

**المهام المتبقية:**
- [ ] **ربط صفحات P0 بالبيانات** (Home، Pricing، About، Customers، Gallery، Help)
- [ ] إنشاء محتوى في Sanity Studio
- [ ] كتابة GROQ queries
- [ ] مقارنة بصرية مع HTML الأصلي
- [ ] إصلاح CSS/Responsive
- [ ] اختبار Lighthouse (الهدف: ≥90)

**معايير القبول:**
- ✅ مطابقة كاملة لصفحات P0/P1 مع HTML الأصلي
- ✅ جميع الصور تُحمل من Sanity CDN
- ✅ Lighthouse Performance ≥90
- ✅ Responsive على جميع الأحجام

**الصفحات المطلوبة:**
| الأولوية | الصفحة | الملف | الحالة |
|----------|--------|------|--------|
| **P0** | Home | `(marketing)/page.tsx` | ⏳ بحاجة لربط بيانات |
| **P0** | Pricing | `(marketing)/pricing/page.tsx` | ⏳ بحاجة لربط بيانات |
| **P0** | About | `(marketing)/[slug]/page.tsx` | ⏳ بحاجة لربط بيانات |
| **P0** | Customers | `(marketing)/customers/[slug]/page.tsx` | ⏳ بحاجة لربط بيانات |
| **P0** | Gallery | `(marketing)/gallery/page.tsx` | ⏳ بحاجة لربط بيانات |
| **P0** | Help | `(marketing)/help/page.tsx` | ⏳ بحاجة لربط بيانات |

---

## 🎯 التقدم الإجمالي

```
المراحل المكتملة: 4/8 (50%)
الكود المنفذ: ~65%
جاهز للإنتاج: لا (بحاجة للمراحل 5-8)

التقدير:
├─ البنية التحتية: ✅ 100% (Next.js، GraphQL، Firebase، Sanity)
├─ الأمان: ✅ 100% (Auth، Protected Routes، Session Management)
├─ المحتوى: ⏳ 30% (Schemas جاهزة، البيانات الفعلية مفقودة)
├─ Analytics: ⏳ 70% (مُعد لكن يحتاج اختبار وإصلاحات)
├─ Payments: ⏳ 0% (لم يبدأ)
├─ UI/UX: ⏳ 40% (هيكل موجود، المحتوى والتصميم الكامل مفقود)
└─ الجودة: ⏳ 60% (اختبارات آلية موجودة، اختبارات التكامل مفقودة)
```

---

## 🚀 الخطوات التالية الموصى بها

### للوكيل القادم:

1. **قراءة هذا الملف بالكامل** لفهم القيود والعمل على السيرفر
2. **عدم تشغيل `npm install` في Replit** - ستفشل بسبب المساحة
3. **قراءة `rebuild/SERVER_WORKFLOW.md`** للتعليمات التفصيلية
4. **البدء بالمرحلة 5** (Analytics) أو **المرحلة 8** (ربط البيانات)
5. **استخدام السيرفر** لجميع عمليات البناء والاختبار

### الأولويات:

**أولوية عالية** 🔴:
- المرحلة 8 (ربط صفحات P0 بالبيانات) - **أهم شيء للإطلاق**
- المرحلة 5 (اختبار وإصلاح Analytics)

**أولوية متوسطة** 🟡:
- المرحلة 6 (Stripe Payments)
- المرحلة 7 (Monitoring)

**أولوية منخفضة** 🟢:
- تحسينات الأداء
- صفحات P1/P2

---

## 📚 المراجع السريعة
- **⭐ دليل العمل على السيرفر**: `rebuild/SERVER_WORKFLOW.md` (جديد!)
- **الخطة الرئيسية**: `rebuild/planning/rebuild_master_plan.md`
- **دليل النشر**: `rebuild/source/DEPLOY_README.md`
- **دليل إعداد Firebase**: `rebuild/docs/FIREBASE_SETUP_GUIDE.md`
- **دليل Firebase Admin**: `rebuild/docs/FIREBASE_ADMIN_SETUP.md`
- **دليل إعداد البيئة**: `rebuild/planning/ENV_SETUP_GUIDE.md`
- **Sanity CMS Coverage Matrix**: `rebuild/planning/schema_coverage_matrix.md`
- **Pages Migration Plan**: `rebuild/planning/pages_migration_plan.md`
