# 👤 دليل إدارة بيانات المسؤول في Tolgee

**تاريخ الإنشاء**: 20 نوفمبر 2025  
**آخر تحديث**: 20 نوفمبر 2025

---

## 📊 معلومات المسؤول الحالية

### بيانات API Key
```json
{
  "id": 1000011002,
  "username": "admin",
  "userFullName": "admin",
  "projectId": 2,
  "projectName": "k2panelai",
  "description": "K2PANELAI",
  "lastUsedAt": 1763601096349,
  "expiresAt": null,
  "scopes": [
    "admin",
    "all.view",
    "keys.create",
    "keys.edit",
    "keys.delete",
    "translations.edit",
    "translations.view",
    "project.edit",
    "members.edit",
    "webhooks.manage"
  ]
}
```

### بيانات المشروع
```json
{
  "id": 2,
  "name": "k2panelai",
  "slug": "binarjoinanalytic-ai",
  "organizationOwner": {
    "id": 1,
    "name": "admin",
    "slug": "admin"
  },
  "baseLanguage": {
    "id": 1000009001,
    "name": "English",
    "tag": "en"
  },
  "languageCount": 2,
  "keyCount": 0,
  "membersCount": 1,
  "organizationRole": "OWNER"
}
```

### اللغات المدعومة
1. **English (en)** - اللغة الأساسية
   - ID: 1000009001
   - Tag: en
   - Flag: 🇬🇧

2. **Arabic (ar)**
   - ID: 1000009003
   - Tag: ar
   - Flag: 🇪🇬

---

## 🔐 الوصول إلى لوحة التحكم

### معلومات الاتصال
- **URL**: https://tolgee.binarjoinanelytic.info
- **Username**: admin
- **Project ID**: 2
- **Organization**: admin

### تسجيل الدخول
1. افتح المتصفح واذهب إلى: `https://tolgee.binarjoinanelytic.info`
2. أدخل بيانات الاعتماد (username + password)
3. ستصل إلى لوحة التحكم الرئيسية

---

## 🔄 تغيير بيانات المسؤول

### 1. تغيير كلمة المرور

#### من لوحة التحكم:
```
Settings → Account → Change Password
```

#### من واجهة API:
```bash
curl -X PUT "https://tolgee.binarjoinanelytic.info/v2/user" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "current_password",
    "password": "new_password"
  }'
```

### 2. تغيير الاسم الكامل (Full Name)

```bash
curl -X PUT "https://tolgee.binarjoinanelytic.info/v2/user" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "اسم جديد"
  }'
```

### 3. تحديث البريد الإلكتروني

```bash
curl -X PUT "https://tolgee.binarjoinanelytic.info/v2/user" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new_email@example.com"
  }'
```

---

## 🔑 إدارة API Keys

### إنشاء API Key جديد

#### من لوحة التحكم:
```
Project Settings → API Keys → Create API Key
```

#### الخطوات:
1. حدد الصلاحيات المطلوبة (Scopes)
2. اختر وصف واضح (Description)
3. حدد تاريخ الانتهاء (اختياري)
4. انقر "Create"
5. **احفظ المفتاح فوراً** (لن تستطيع رؤيته مرة أخرى)

### الصلاحيات الموصى بها

#### للـ Client-side (Public Key):
```json
{
  "scopes": [
    "translations.view",
    "keys.view",
    "screenshots.view"
  ],
  "description": "Public API Key for Next.js Client"
}
```

#### للـ Server-side (Secret Key):
```json
{
  "scopes": [
    "translations.view",
    "translations.edit",
    "keys.create",
    "keys.edit",
    "keys.delete"
  ],
  "description": "Server API Key for Next.js Backend"
}
```

### إبطال API Key

#### من لوحة التحكم:
```
Project Settings → API Keys → [Select Key] → Revoke
```

#### من API:
```bash
curl -X DELETE "https://tolgee.binarjoinanelytic.info/v2/api-keys/{keyId}" \
  -H "X-API-Key: your_admin_api_key"
```

---

## 👥 إدارة المستخدمين

### إضافة مستخدم جديد

```bash
curl -X POST "https://tolgee.binarjoinanelytic.info/v2/projects/2/users" \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "role": "TRANSLATE"
  }'
```

### الأدوار المتاحة:
- **OWNER**: صلاحيات كاملة
- **MANAGE**: إدارة المحتوى والإعدادات
- **EDIT**: تعديل الترجمات
- **TRANSLATE**: ترجمة فقط
- **VIEW**: مشاهدة فقط

### حذف مستخدم

```bash
curl -X DELETE "https://tolgee.binarjoinanelytic.info/v2/projects/2/users/{userId}" \
  -H "X-API-Key: your_api_key"
```

---

## 🔧 التكوين في التطبيق

### ملف Environment Variables

```bash
# .env.local

# معلومات الاتصال
NEXT_PUBLIC_TOLGEE_API_URL=https://tolgee.binarjoinanelytic.info
NEXT_PUBLIC_TOLGEE_PROJECT_ID=2

# Public API Key (للقراءة من Client)
NEXT_PUBLIC_TOLGEE_API_KEY=tgpak_gjpw...

# Secret API Key (للعمليات Server-side)
TOLGEE_API_KEY=tgpak_...

# إعدادات i18n
NEXT_PUBLIC_DEFAULT_LOCALE=ar
NEXT_PUBLIC_SUPPORTED_LOCALES=ar,en
NEXT_PUBLIC_FALLBACK_LOCALE=en
```

### التحقق من الاتصال

```bash
# من الـ Terminal
npx tsx scripts/test-tolgee-connection.ts

# استخراج بيانات المسؤول
npx tsx scripts/test-tolgee-admin.ts
```

---

## 📋 سيناريوهات شائعة

### السيناريو 1: تغيير بيانات تسجيل الدخول

**الخطوات:**
1. سجل دخول إلى لوحة Tolgee
2. اذهب إلى `Settings → Account`
3. غيّر البيانات المطلوبة (Password, Name, Email)
4. احفظ التغييرات
5. سجل خروج ثم سجل دخول بالبيانات الجديدة

### السيناريو 2: تجديد API Key

**الخطوات:**
1. سجل دخول إلى لوحة Tolgee
2. اذهب إلى `Project Settings → API Keys`
3. أنشئ API Key جديد بنفس الصلاحيات
4. احفظ المفتاح الجديد
5. حدّث `.env.local` في التطبيق:
   ```bash
   NEXT_PUBLIC_TOLGEE_API_KEY=new_key_here
   ```
6. أعد تشغيل التطبيق
7. تحقق من الاتصال: `npx tsx scripts/test-tolgee-connection.ts`
8. بعد التحقق، أبطل المفتاح القديم

### السيناريو 3: إضافة مترجم جديد

**الخطوات:**
1. اذهب إلى `Project Settings → Members`
2. انقر `Invite Member`
3. أدخل البريد الإلكتروني
4. اختر الدور: `TRANSLATE`
5. حدد اللغات المسموح بالعمل عليها (ar, en)
6. أرسل الدعوة

---

## 🚨 الأمان

### ⚠️ قواعد مهمة

1. **لا تشارك API Keys أبداً**
2. **استخدم HTTPS دائماً**
3. **غيّر كلمة المرور بشكل دوري**
4. **راجع سجلات الوصول بانتظام**
5. **أبطل المفاتيح غير المستخدمة**

### نصائح الأمان

- **Public Keys**: صلاحيات قراءة فقط
- **Secret Keys**: لا تكشفها في Client-side
- **Environment Variables**: استخدم Replit Secrets
- **CORS**: حدد Domains المسموح بها فقط
- **Rate Limiting**: راقب الاستخدام

---

## 📊 نتائج الاختبار

### اختبار الاتصال الأساسي
```bash
$ npx tsx scripts/test-tolgee-connection.ts
✅ الاتصال بـ Tolgee ناجح!
📊 تم جلب الترجمات للمشروع 2 بنجاح
```

### اختبار بيانات المسؤول
```bash
$ npx tsx scripts/test-tolgee-admin.ts
✅ معلومات API Key: admin (ID: 1000011002)
✅ معلومات المشروع: k2panelai (ID: 2)
✅ اللغات المدعومة: ar, en
✅ إحصائيات: 0 keys, 2 languages, 1 member
```

---

## 📚 المراجع

### API Documentation
- [Tolgee API Docs](https://tolgee.io/api)
- [Authentication](https://tolgee.io/api#tag/Authentication)
- [Projects](https://tolgee.io/api#tag/Projects)
- [API Keys](https://tolgee.io/api#tag/API-keys)

### دليل الاستخدام
- [CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md) - دليل الربط بسيرفر Tolgee
- [MASTER_PLAN.md](./MASTER_PLAN.md) - الخطة الرئيسية
- [QUICK_START.md](./QUICK_START.md) - دليل البدء السريع

---

## ✅ قائمة التحقق

- [x] الاتصال بسيرفر Tolgee يعمل
- [x] استخراج بيانات API Key
- [x] استخراج بيانات المشروع
- [x] التحقق من اللغات المدعومة
- [x] توثيق بيانات المسؤول
- [x] إنشاء دليل إدارة المسؤول
- [x] اختبار جميع Endpoints

---

**✍️ المؤلف**: فريق الاستكمال - الوكيل #3  
**📅 تاريخ الإنشاء**: 20 نوفمبر 2025  
**🔄 آخر تحديث**: 20 نوفمبر 2025  
**✅ الحالة**: مكتمل ومختبر
