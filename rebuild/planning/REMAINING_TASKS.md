# 📋 المهام المتبقية - ملخص سريع

**آخر تحديث**: 18 نوفمبر 2025  
**التقدم الإجمالي**: 65% (4/8 مراحل مكتملة)

---

## 🎯 الأولويات

### 🔴 أولوية قصوى (للإطلاق)

**المرحلة 8.1: ربط صفحات P0 بالبيانات**
- ⏰ الوقت: 12-16 ساعة
- 📍 المكان: السيرفر (93.127.142.144)
- ⚠️ ملاحظة: **الأهم! بدون هذا الموقع فارغ**

**المهام:**
1. إنشاء محتوى في Sanity Studio
2. ربط Home page بـ Sanity
3. ربط Pricing page بـ Sanity
4. ربط About, Customers, Gallery, Help

**معايير القبول:**
- ✅ جميع صفحات P0 تعرض محتوى حقيقي
- ✅ الصور تُحمّل من Sanity CDN
- ✅ SSR يعمل بدون أخطاء

**كيف أبدأ:**
```bash
# 1. على السيرفر: تشغيل Sanity Studio
ssh administrator@93.127.142.144
cd /srv/rebuild/app
npm run sanity
# افتح http://93.127.142.144:3333

# 2. أنشئ المحتوى في Studio

# 3. على Replit: اربط الصفحات
# تحرير src/app/(marketing)/page.tsx
# أضف GROQ queries

# 4. ارفع ← ابنِ ← اختبر
./deploy-to-server.sh
```

---

### 🟡 أولوية متوسطة

#### المرحلة 5: Analytics (3-4 ساعات)

**المهام:**
- [ ] إصلاح GTM readiness gate
- [ ] إضافة retry mechanism
- [ ] اختبار إرسال الأحداث

**الملفات:**
- `src/providers/AnalyticsProvider.tsx`
- `src/lib/analytics/gtm.ts`

**معايير القبول:**
- ✅ الأحداث تصل خلال ≤2 ثانية
- ✅ لا أخطاء في console

**ملاحظة**: ⚠️ يجب العمل على السيرفر!

---

#### المرحلة 6: Stripe (2-3 ساعات)

**المتطلبات:**
- ⚠️ حساب Stripe Test

**المهام:**
- [ ] إعداد Stripe account
- [ ] إنشاء Checkout API
- [ ] Webhook handler
- [ ] اختبار الدفع

**الملفات:**
- `src/app/api/checkout/route.ts` (جديد)
- `src/app/api/webhooks/route.ts` (موجود)

**معايير القبول:**
- ✅ Checkout يعمل
- ✅ Webhook يستقبل الأحداث
- ✅ الاشتراك يُسجّل في DB

**ملاحظة**: ⚠️ المفاتيح في `.env.production` على السيرفر فقط!

---

### 🟢 أولوية منخفضة

#### المرحلة 7: Monitoring (2 ساعة)

**المتطلبات:**
- ⚠️ Datadog account (اختياري)
- ⚠️ LaunchDarkly account (اختياري)

**المهام:**
- [ ] تفعيل Datadog RUM
- [ ] إعداد LaunchDarkly

**معايير القبول:**
- ✅ Session replay يعمل
- ✅ Feature flags تعمل

---

## 🗓️ جدول العمل المقترح

### اليوم 1-2: المرحلة 8 (P0 Pages)
```
ساعات 1-3: إنشاء محتوى Sanity
ساعات 4-6: ربط Home + Pricing
ساعات 7-9: ربط About + Customers
ساعات 10-12: ربط Gallery + Help
ساعات 13-14: مطابقة CSS
ساعات 15-16: اختبار شامل
```

### اليوم 3: المرحلة 5 (Analytics)
```
ساعات 1-2: إصلاح GTM
ساعات 3-4: Retry mechanism + اختبار
```

### اليوم 4: المرحلة 6 (Stripe)
```
ساعات 1-2: إعداد Stripe + Checkout
ساعة 3: Webhook + اختبار
```

### اليوم 5 (اختياري): المرحلة 7
```
ساعات 1-2: Datadog + LaunchDarkly
```

---

## ✅ قوائم التحقق التفصيلية

### المرحلة 8: UI/UX ⭐

#### ✅ المهمة 8.1: محتوى Sanity
- [ ] فتح Sanity Studio (`npm run sanity` على السيرفر)
- [ ] إنشاء صفحة Home في CMS
  - [ ] Hero Section
  - [ ] Features Grid
  - [ ] Customer Logos
  - [ ] Statistics
  - [ ] Testimonials
  - [ ] CTA
- [ ] إنشاء صفحة Pricing
  - [ ] Pricing tiers (3 plans)
  - [ ] Feature comparison
  - [ ] FAQ
- [ ] إنشاء صفحة About
  - [ ] Mission statement
  - [ ] Team members
  - [ ] Company values
- [ ] إنشاء Customer Stories (14 قصة)
- [ ] إنشاء Gallery Projects (40+ مشروع)
- [ ] إنشاء Help Articles

**ملاحظة**: ⏰ هذا يأخذ 4-6 ساعات

---

#### ✅ المهمة 8.2: ربط Home Page
**الملف**: `src/app/(marketing)/page.tsx`

```typescript
// على Replit: تحرير الملف
import { client } from '@/lib/sanity';

async function getHomeData() {
  const query = `*[_type == "page" && slug.current == "home"][0]{
    title,
    sections[]{
      _type,
      _key,
      _type == "heroSection" => {
        heading,
        subheading,
        ctaButton{text, link}
      },
      _type == "valuePropGridSection" => {
        heading,
        items[]{title, description, icon}
      },
      // ... باقي الـ sections
    }
  }`;
  
  return await client.fetch(query);
}

export default async function HomePage() {
  const data = await getHomeData();
  
  return (
    <main>
      {data.sections.map((section: any) => {
        switch (section._type) {
          case 'heroSection':
            return <HeroSection key={section._key} {...section} />;
          case 'valuePropGridSection':
            return <FeaturesGrid key={section._key} {...section} />;
          // ... باقي الـ sections
        }
      })}
    </main>
  );
}
```

**الخطوات:**
1. تحرير على Replit
2. حفظ
3. رفع: `./deploy-to-server.sh`
4. فحص: `curl http://93.127.142.144:3000`

**معيار القبول**: ✅ Home page تعرض المحتوى

---

#### ✅ المهمة 8.3: ربط Pricing Page
**الملف**: `src/app/(marketing)/pricing/page.tsx`

**GROQ Query:**
```typescript
const query = `*[_type == "page" && slug.current == "pricing"][0]{
  sections[]{
    _type == "pricingTableSection" => {
      plans[]{
        name,
        price,
        features[],
        cta{text, link}
      }
    }
  }
}`;
```

**معيار القبول**: ✅ Pricing page تعرض الباقات

---

#### ✅ المهمة 8.4-8.6: باقي صفحات P0
نفس الطريقة لـ:
- About (`[slug]/page.tsx` with slug="about")
- Customers (`customers/[slug]/page.tsx`)
- Gallery (`gallery/page.tsx`)
- Help (`help/page.tsx`)

---

#### ✅ المهمة 8.7: مطابقة CSS
**الملفات**: `src/app/globals.css` + component styles

**الخطوات:**
1. فتح HTML الأصلي (`static_pages/index.html`)
2. فتح الصفحة الجديدة في متصفح
3. المقارنة البصرية
4. تعديل CSS

**أدوات:**
- Chrome DevTools → Elements → Computed
- Color picker للألوان
- Rulers للمسافات

**معيار القبول**: ✅ تطابق 95%+ مع الأصل

---

#### ✅ المهمة 8.8: Responsive Testing
**الأحجام:**
- 375px (Mobile)
- 768px (Tablet)
- 1440px (Desktop)
- 1920px (Large Desktop)

**معيار القبول**: ✅ يعمل على جميع الأحجام

---

#### ✅ المهمة 8.9: Lighthouse Audit
**الهدف**: ≥90 لكل فئة

**الخطوات:**
```bash
# في Chrome
F12 → Lighthouse → Run audit
```

**إذا كان الأداء منخفض:**
- تحسين الصور (Next/Image)
- تقليل JavaScript bundle
- إزالة CSS غير المستخدم

**معيار القبول**: ✅ Performance ≥90

---

### المرحلة 5: Analytics

#### ✅ المهمة 5.1: GTM Ready Gate
**الملف**: `src/providers/AnalyticsProvider.tsx`

**الكود:**
```typescript
const waitForGTM = async (maxWait = 2000) => {
  const start = Date.now();
  while (!window.dataLayer && Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 100));
  }
  return !!window.dataLayer;
};
```

**معيار القبول**: ✅ لا أخطاء `dataLayer undefined`

---

#### ✅ المهمة 5.2: Retry Mechanism
**الكود:**
```typescript
const sendWithRetry = async (fn: () => void, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      return true;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

**معيار القبول**: ✅ الأحداث تُعاد 3 مرات عند الفشل

---

#### ✅ المهمة 5.3: اختبار شامل
**الخطوات:**
1. فتح DevTools → Console
2. زيارة الموقع
3. تسجيل الدخول
4. التنقل بين الصفحات
5. فحص GTM Dashboard

**معيار القبول**: 
- ✅ pageview events تُرسل
- ✅ identify events تُرسل
- ✅ console نظيف

---

### المرحلة 6: Stripe

#### ✅ المهمة 6.1: Stripe Setup
**الخطوات:**
1. تسجيل على https://dashboard.stripe.com
2. Test Mode → API Keys
3. نسخ المفاتيح

**على السيرفر:**
```bash
ssh administrator@93.127.142.144
nano /srv/rebuild/app/.env.production

# أضف:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

**معيار القبول**: ✅ المفاتيح محفوظة

---

#### ✅ المهمة 6.2: Checkout API
**الملف**: `src/app/api/checkout/route.ts`

**اختبار:**
```bash
curl -X POST http://93.127.142.144:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_test"}'
```

**معيار القبول**: ✅ يرد بـ sessionId

---

#### ✅ المهمة 6.3: Webhook
**الملف**: `src/app/api/webhooks/route.ts`

**اختبار (على السيرفر):**
```bash
stripe listen --forward-to localhost:3000/api/webhooks
stripe trigger checkout.session.completed
```

**معيار القبول**: ✅ الحدث يُستقبل ويُسجّل

---

#### ✅ المهمة 6.4: تدفق كامل
1. زيارة /pricing
2. النقر على Subscribe
3. بطاقة اختبار: 4242 4242 4242 4242
4. إكمال الدفع

**معيار القبول**: ✅ التحويل لـ /success + تسجيل في DB

---

## 🚨 تذكيرات مهمة

### ⚠️ للوكيل الجديد:

1. **لا npm install في Replit!** 
   - استخدم السيرفر فقط

2. **كل شيء يُبنى على السيرفر**
   - `./deploy-to-server.sh` لرفع التحديثات

3. **اختبر على السيرفر**
   - `http://93.127.142.144`

4. **السجلات على السيرفر**
   - `ssh + pm2 logs rebuild-nextjs`

5. **المفاتيح على السيرفر فقط**
   - `.env.production` وليس في Replit

---

## 📞 مراجع

- **التفاصيل الكاملة**: `../SERVER_WORKFLOW.md`
- **الخطة الأصلية**: `rebuild_master_plan.md`
- **خطة الصفحات**: `pages_migration_plan.md`

---

**الآن: اختر مهمة وابدأ!** 🚀
