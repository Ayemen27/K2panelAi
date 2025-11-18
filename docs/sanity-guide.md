# 📝 دليل إضافة المحتوى في Sanity CMS

**آخر تحديث**: 18 نوفمبر 2025

---

## 🎯 نظرة عامة

هذا الدليل يشرح كيفية إضافة المحتوى في Sanity Studio لصفحة Home Page.

---

## 🚀 تشغيل Sanity Studio

### على السيرفر:

```bash
# 1. الاتصال بالسيرفر
ssh administrator@93.127.142.144

# 2. الانتقال لمجلد التطبيق
cd /srv/app

# 3. تشغيل Sanity Studio
npm run sanity

# 4. فتح المتصفح
# افتح: http://93.127.142.144:3333
# (أو المنفذ المعروض في التيرمينال)
```

---

## 📄 إنشاء صفحة Home Page

### الخطوة 1: إنشاء صفحة جديدة

1. في Sanity Studio، اذهب إلى **Pages**
2. انقر على **Create New**
3. اختر نوع **Page**

### الخطوة 2: الإعدادات الأساسية

املأ الحقول التالية:

```
Title: Home
Slug: home (مهم جداً!)
Meta Title: Replit - Build software faster
Meta Description: The collaborative browser-based IDE
```

---

## 🎨 إضافة Sections

### 1. Hero Section

**النوع**: `heroSection`

**الحقول:**
```
Title: Build software faster
Subtitle: Code, collaborate, create
Description: The collaborative browser-based IDE that makes it easy to write, run, and deploy code from anywhere

Buttons (CTA Buttons):
  Button 1:
    - Text: Start building for free
    - Link: /signup
    - Variant: primary
  
  Button 2:
    - Text: Explore projects
    - Link: /gallery
    - Variant: secondary
```

**الشكل النهائي:**
- خلفية متدرجة من الأزرق إلى البنفسجي
- عنوان كبير
- وصف
- زرين للحث على اتخاذ إجراء

---

### 2. Value Prop Grid Section (Features)

**النوع**: `valuePropGridSection`

**الحقول:**
```
Heading: Why developers love Replit
Description: Everything you need to build and deploy software, all in one place

Items (Value Propositions):
  Item 1:
    - Title: Code anywhere
    - Description: Write and run code directly from your browser. No setup required.
    - Icon: 💻
  
  Item 2:
    - Title: Collaborate in real-time
    - Description: Work together with your team, instantly. See changes as they happen.
    - Icon: 👥
  
  Item 3:
    - Title: Deploy instantly
    - Description: Go from code to production in seconds. Hosting included.
    - Icon: 🚀
  
  Item 4:
    - Title: 100+ languages
    - Description: Support for all major programming languages and frameworks.
    - Icon: 🌐
  
  Item 5:
    - Title: AI-powered
    - Description: Get intelligent code suggestions and assistance.
    - Icon: 🤖
  
  Item 6:
    - Title: Always available
    - Description: Access your projects from any device, anywhere in the world.
    - Icon: ☁️
```

---

### 3. Stats Section

**النوع**: `statsSection`

**الحقول:**
```
Heading: (اختياري) By the numbers
Description: (اختياري) Join millions of developers worldwide

Stats (Statistics):
  Stat 1:
    - Value: 10M+
    - Label: Developers building on Replit
    - Icon: 👥 (اختياري)
  
  Stat 2:
    - Value: 50M+
    - Label: Projects created
    - Icon: 📁 (اختياري)
  
  Stat 3:
    - Value: 100+
    - Label: Programming languages supported
    - Icon: 🌐 (اختياري)
```

---

### 4. CTA Band Section

**النوع**: `ctaBandSection`

**الحقول:**
```
Title: Ready to start building?
Description: Join millions of developers creating amazing things on Replit

Buttons:
  Button 1:
    - Text: Get started for free
    - Link: /signup
    - Variant: primary
```

---

## ✅ قائمة تحقق كاملة

### صفحة Home - Sections بالترتيب:

- [ ] 1. Hero Section
  - [ ] Title
  - [ ] Subtitle (اختياري)
  - [ ] Description
  - [ ] 2 Buttons
  
- [ ] 2. Value Prop Grid Section
  - [ ] Heading
  - [ ] Description
  - [ ] 6 Items (features)
  
- [ ] 3. Stats Section
  - [ ] Heading (اختياري)
  - [ ] Description (اختياري)
  - [ ] 3 Stats (10M+, 50M+, 100+)
  
- [ ] 4. CTA Band Section
  - [ ] Title
  - [ ] Description
  - [ ] Buttons (1 أو أكثر)

---

## 🧪 الاختبار

### بعد إضافة المحتوى:

```bash
# على السيرفر
cd /srv/app
npm run build
pm2 restart nextjs-app

# فتح المتصفح
curl http://localhost:3000
# أو
# افتح http://93.127.142.144
```

### التحقق:

1. ✅ الصفحة تُحمّل بدون أخطاء
2. ✅ Hero Section يظهر مع الأزرار
3. ✅ Features grid يعرض 6 ميزات
4. ✅ Stats تعرض الأرقام الصحيحة
5. ✅ CTA Band يظهر في الأسفل

---

## 🎨 نصائح التصميم

### الألوان:
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#9333EA)
- **Accent**: Pink (#EC4899)
- **Text**: Gray (#1F2937)
- **Background**: Light Gray (#F9FAFB)

### الخطوط:
- **Headings**: Font Bold, Large
- **Body**: Font Regular, Medium
- **CTAs**: Font Semibold

### الأيقونات:
استخدم Emoji أو:
- 💻 للكود
- 👥 للتعاون
- 🚀 للنشر
- 🌐 للغات
- 🤖 للذكاء الاصطناعي
- ☁️ للسحابة

---

## 🔧 استكشاف الأخطاء

### المشكلة: الصفحة فارغة
**الحل**: تأكد أن `slug.current === "home"` بالضبط

### المشكلة: البيانات لا تظهر
**الحل**: 
1. تحقق من السجلات: `pm2 logs nextjs-app`
2. تأكد من متغيرات البيئة:
   ```bash
   echo $NEXT_PUBLIC_SANITY_PROJECT_ID
   echo $NEXT_PUBLIC_SANITY_DATASET
   ```

### المشكلة: أخطاء في console
**الحل**: افتح DevTools → Console وابحث عن رسالة الخطأ

---

## 📞 الدعم

- **Sanity Schemas**: `./sanity/schemas/`
- **Home Page Code**: `./src/app/(marketing)/page.tsx`
- **Sanity Client**: `./src/lib/sanity.ts`

---

**بعد إنشاء المحتوى، يمكنك إضافة محتوى صفحات أخرى (Pricing, Gallery, etc.)**
