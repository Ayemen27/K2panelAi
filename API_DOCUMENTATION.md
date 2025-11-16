# توثيق APIs للنظام الخلفي

## معلومات عامة
- **URL الأساسي**: `http://localhost:5000`
- **نوع المحتوى**: `application/json`
- **المصادقة**: JWT Token في Header

---

## 🔐 APIs المصادقة (Authentication)

### 1. إنشاء حساب جديد (Signup)
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "first_name": "محمد",
  "last_name": "أحمد"
}
```

**الرد:**
```json
{
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "محمد",
    "last_name": "أحمد"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. تسجيل الدخول (Login)
```http
POST /auth/login
Content-Type: application/json

{
  "email_or_username": "user@example.com",
  "password": "password123"
}
```

**الرد:**
```json
{
  "message": "تم تسجيل الدخول بنجاح",
  "user": {...},
  "access_token": "...",
  "refresh_token": "..."
}
```

### 3. الحصول على معلومات المستخدم الحالي
```http
GET /auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**الرد:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "محمد",
    "last_name": "أحمد",
    "created_at": "2025-11-16T20:00:00"
  }
}
```

---

## 📁 APIs المشاريع (Projects)

### 1. الحصول على قائمة المشاريع
```http
GET /api/projects?category=education&featured=true&page=1&per_page=12
```

**المعاملات (Query Parameters):**
- `category` (اختياري): slug الفئة
- `featured` (اختياري): `true` للمشاريع المميزة فقط
- `page` (اختياري): رقم الصفحة (افتراضي: 1)
- `per_page` (اختياري): عدد المشاريع في الصفحة (افتراضي: 12)

**الرد:**
```json
{
  "projects": [
    {
      "id": 1,
      "title": "تطبيق تعليم الرياضيات",
      "slug": "math-learning-app",
      "description": "تطبيق تفاعلي لتعليم الرياضيات للأطفال",
      "image_url": "https://...",
      "demo_url": "https://...",
      "repl_url": "https://...",
      "is_featured": true,
      "views_count": 100,
      "likes_count": 25,
      "author": {...},
      "category": {...},
      "created_at": "2025-11-16T20:00:00"
    }
  ],
  "total": 50,
  "page": 1,
  "per_page": 12,
  "pages": 5
}
```

### 2. الحصول على مشروع محدد
```http
GET /api/projects/math-learning-app
```

**الرد:**
```json
{
  "project": {
    "id": 1,
    "title": "تطبيق تعليم الرياضيات",
    "slug": "math-learning-app",
    ...
  }
}
```

### 3. إنشاء مشروع جديد (يتطلب مصادقة)
```http
POST /api/projects
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "مشروعي الجديد",
  "slug": "my-new-project",
  "description": "وصف المشروع",
  "image_url": "https://...",
  "demo_url": "https://...",
  "repl_url": "https://...",
  "category_id": 1,
  "is_published": true
}
```

**الرد:**
```json
{
  "message": "تم إنشاء المشروع بنجاح",
  "project": {...}
}
```

---

## 🏷️ APIs الفئات (Categories)

### الحصول على جميع الفئات
```http
GET /api/categories
```

**الرد:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "تعليم",
      "slug": "education",
      "description": "تطبيقات تعليمية",
      "icon": "📚"
    },
    ...
  ]
}
```

---

## 📋 APIs النماذج (Forms)

### إرسال نموذج
```http
POST /api/forms/submit
Content-Type: application/json

{
  "form_type": "contact",
  "name": "محمد أحمد",
  "email": "user@example.com",
  "company": "شركتي",
  "message": "رسالة الاستفسار",
  "phone": "+966500000000",
  "extra_data": {
    "source": "website"
  }
}
```

**أنواع النماذج المتاحة:**
- `contact`: نموذج الاتصال
- `sales`: طلب مبيعات
- `demo`: طلب عرض توضيحي
- `enterprise`: استفسار للشركات
- `newsletter`: الاشتراك في النشرة البريدية

**الرد:**
```json
{
  "message": "تم إرسال النموذج بنجاح",
  "submission": {
    "id": 1,
    "form_type": "contact",
    "name": "محمد أحمد",
    "email": "user@example.com",
    ...
  }
}
```

---

## 💡 أمثلة استخدام JavaScript

### مثال: تسجيل دخول
```javascript
async function login() {
  const response = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_or_username: 'demo@replit.com',
      password: 'demo123'
    })
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('access_token', data.access_token);
    console.log('تم تسجيل الدخول بنجاح!', data.user);
  } else {
    console.error('خطأ:', data.error);
  }
}
```

### مثال: الحصول على المشاريع
```javascript
async function getProjects() {
  const response = await fetch('http://localhost:5000/api/projects?featured=true');
  const data = await response.json();
  
  data.projects.forEach(project => {
    console.log(project.title);
  });
}
```

### مثال: إنشاء مشروع (مع مصادقة)
```javascript
async function createProject() {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:5000/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'مشروعي الجديد',
      slug: 'my-new-project',
      description: 'وصف المشروع',
      is_published: true
    })
  });
  
  const data = await response.json();
  console.log(data);
}
```

### مثال: إرسال نموذج اتصال
```javascript
async function submitContactForm() {
  const response = await fetch('http://localhost:5000/api/forms/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      form_type: 'contact',
      name: 'محمد أحمد',
      email: 'user@example.com',
      message: 'رسالة الاستفسار'
    })
  });
  
  const data = await response.json();
  console.log(data.message);
}
```

---

## 🔑 بيانات التجربة (Demo Credentials)
```
البريد الإلكتروني: demo@replit.com
كلمة المرور: demo123
```

---

## ⚠️ رموز الأخطاء
- `200`: نجاح العملية
- `201`: تم الإنشاء بنجاح
- `400`: خطأ في البيانات المرسلة
- `401`: يتطلب تسجيل الدخول
- `403`: غير مصرح لك بالوصول
- `404`: المورد غير موجود
- `500`: خطأ في الخادم

---

## 📊 قاعدة البيانات
تم إنشاء الجداول التالية:
- `users`: المستخدمون
- `projects`: المشاريع
- `categories`: الفئات
- `form_submissions`: النماذج المرسلة

البيانات محفوظة في ملف: `instance/replit_website.db`
