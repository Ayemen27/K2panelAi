# 🖥️ دليل العمل على السيرفر الخارجي

**آخر تحديث**: 18 نوفمبر 2025

---

## ⚠️ تحذير حرج - اقرأ هذا أولاً!

**🚫 لا تقم بتثبيت المكتبات في Replit!**

- ❌ **لا تشغل** `npm install` في Replit
- ❌ **لا تشغل** `npm ci` في Replit
- ❌ **لا تشغل** `npm run dev` في Replit (سيفشل بدون node_modules)
- ❌ **لا تثبت** أي مكتبات إضافية في Replit

**السبب**: الحساب المجاني لديه مساحة 2GB فقط، و node_modules سيستهلك 500MB-1GB

---

## ✅ طريقة العمل الصحيحة

### 🎯 استراتيجية العمل:

```
Replit (IDE) → تحرير الكود → rsync → السيرفر → البناء والتشغيل
```

### 📋 الخطوات:

1. **على Replit**: تحرير الملفات فقط
2. **رفع للسيرفر**: استخدام rsync أو scp
3. **على السيرفر**: تثبيت + بناء + تشغيل
4. **الاختبار**: على السيرفر عبر المتصفح

---

## 🔐 بيانات الاتصال

### معلومات السيرفر (من Replit Secrets):

```bash
SSH_HOST=93.127.142.144
SSH_USER=administrator
SSH_PASSWORD=[موجود في Secrets]
SSH_PORT=22
```

### قاعدة البيانات:

```bash
REMOTE_DB_HOST=93.127.142.144
REMOTE_DB_NAME=saasboiler_db
REMOTE_DB_USER=saasboiler_user
REMOTE_DB_PASSWORD=[موجود في Secrets]
REMOTE_DB_PORT=5432
```

### مسارات على السيرفر:

```bash
/srv/rebuild/app              # التطبيق الرئيسي
/srv/rebuild/shared/logs      # السجلات
/srv/rebuild/shared/uploads   # الملفات المرفوعة
```

### خدمات مثبتة على السيرفر:

- ✅ Node.js 20 LTS
- ✅ PM2 (إدارة العمليات)
- ✅ Nginx (Reverse Proxy)
- ✅ PostgreSQL
- ✅ SSL/HTTPS (Let's Encrypt)

---

## 📝 سيناريوهات العمل التفصيلية

### السيناريو 1: تحرير ملف واحد

#### الخطوات:

```bash
# 1. على Replit
# تحرير الملف المطلوب (مثلاً: src/app/(marketing)/page.tsx)
# حفظ التغييرات (Ctrl+S)

# 2. رفع الملف للسيرفر
sshpass -p "$SSH_PASSWORD" scp \
  rebuild/source/src/app/(marketing)/page.tsx \
  administrator@93.127.142.144:/srv/rebuild/app/src/app/(marketing)/page.tsx

# 3. على السيرفر: إعادة البناء
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144 << 'ENDSSH'
cd /srv/rebuild/app
npm run build
pm2 restart rebuild-nextjs
ENDSSH

# 4. فحص السجلات
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144 \
  "pm2 logs rebuild-nextjs --lines 50"
```

#### ⚠️ ملاحظات:
- ✅ **معيار القبول**: البناء ينجح بدون أخطاء
- ✅ **التحقق**: `pm2 logs` يظهر "ready" أو "compiled successfully"
- ❌ **خطأ شائع**: نسيان مسار الملف الكامل

---

### السيناريو 2: رفع المشروع بالكامل

#### الخطوات:

```bash
# 1. على Replit: إنشاء ملف .deployignore (إذا لم يكن موجوداً)
cat > rebuild/source/.deployignore << 'EOF'
node_modules/
.next/
.env*
.git/
coverage/
*.log
.DS_Store
.idea/
.vscode/
EOF

# 2. رفع المشروع بالكامل
rsync -avz --delete \
  --exclude-from=rebuild/source/.deployignore \
  rebuild/source/ \
  administrator@93.127.142.144:/srv/rebuild/app/

# إذا طلب كلمة المرور، استخدم:
sshpass -p "$SSH_PASSWORD" rsync -avz --delete \
  --exclude-from=rebuild/source/.deployignore \
  rebuild/source/ \
  administrator@93.127.142.144:/srv/rebuild/app/

# 3. على السيرفر: التثبيت والبناء
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144 << 'ENDSSH'
cd /srv/rebuild/app
npm ci --production=false
npm run build
pm2 restart rebuild-nextjs
pm2 save
ENDSSH
```

#### ⚠️ ملاحظات:
- ✅ **معيار القبول**: rsync ينقل الملفات بنجاح + البناء ينجح
- ✅ **التحقق**: `pm2 status` يظهر "online"
- ❌ **خطأ شائع**: نسيان `--delete` يترك ملفات قديمة
- 📊 **الوقت المتوقع**: 2-5 دقائق حسب سرعة الإنترنت

---

### السيناريو 3: إضافة مكتبة جديدة

#### ⚠️ ملاحظة هامة:
**لا تضف المكتبة في Replit!** أضفها مباشرة على السيرفر.

#### الخطوات:

```bash
# 1. على السيرفر: إضافة المكتبة
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144 << 'ENDSSH'
cd /srv/rebuild/app
npm install <package-name>
npm run build
pm2 restart rebuild-nextjs
ENDSSH

# 2. تنزيل package.json المحدث
sshpass -p "$SSH_PASSWORD" scp \
  administrator@93.127.142.144:/srv/rebuild/app/package.json \
  rebuild/source/package.json

sshpass -p "$SSH_PASSWORD" scp \
  administrator@93.127.142.144:/srv/rebuild/app/package-lock.json \
  rebuild/source/package-lock.json

# 3. على Replit: commit التغييرات (اختياري)
git add package.json package-lock.json
git commit -m "Add <package-name> dependency"
```

#### ⚠️ ملاحظات:
- ✅ **معيار القبول**: المكتبة تُثبّت + package.json يُحدّث
- ✅ **التحقق**: الكود يستورد المكتبة بدون أخطاء
- ❌ **خطأ شائع**: تثبيت المكتبة في Replit (سيفشل)

---

### السيناريو 4: الاتصال بالسيرفر والعمل المباشر

#### الخطوات:

```bash
# 1. الاتصال بالسيرفر
sshpass -p "$SSH_PASSWORD" ssh administrator@93.127.142.144

# 2. الانتقال لمجلد التطبيق
cd /srv/rebuild/app

# 3. أوامر مفيدة:

# فحص حالة PM2
pm2 status

# عرض السجلات المباشرة
pm2 logs rebuild-nextjs

# عرض آخر 100 سطر من السجلات
pm2 logs rebuild-nextjs --lines 100

# إعادة تشغيل التطبيق
pm2 restart rebuild-nextjs

# إيقاف التطبيق
pm2 stop rebuild-nextjs

# بدء التطبيق
pm2 start rebuild-nextjs

# فحص استخدام الموارد
pm2 monit

# اختبار التطبيق محلياً
curl http://localhost:3000

# فحص العمليات
ps aux | grep node

# فحص المساحة
df -h

# فحص حجم المجلدات
du -sh *
```

#### ⚠️ ملاحظات:
- ✅ **معيار القبول**: الاتصال ناجح + الأوامر تعمل
- ✅ **التحقق**: `pm2 status` يظهر المعلومات
- 🔒 **أمان**: لا تشارك كلمة المرور مع أحد

---

## 🎯 المراحل المتبقية - خطة العمل التفصيلية

### المرحلة 5: Analytics والتتبع ⏳

#### 📋 المهام:

##### المهمة 5.1: إصلاح GTM Readiness Gate
**الملف**: `rebuild/source/src/providers/AnalyticsProvider.tsx`

**الهدف**: التأكد من تحميل GTM قبل إرسال الأحداث

**التنفيذ**:
```typescript
// إضافة ready check قبل إرسال الأحداث
const isGTMReady = () => {
  return typeof window !== 'undefined' && 
         window.dataLayer !== undefined;
};

// الانتظار حتى يصبح GTM جاهزاً
const waitForGTM = async (maxWait = 2000) => {
  const start = Date.now();
  while (!isGTMReady() && Date.now() - start < maxWait) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return isGTMReady();
};
```

**معايير القبول**:
- ✅ `window.dataLayer` موجود قبل إرسال الأحداث
- ✅ لا توجد أخطاء `dataLayer is undefined` في console
- ✅ الأحداث تصل لـ GTM Dashboard خلال 2 ثانية

**التحقق**:
```bash
# على السيرفر
pm2 logs rebuild-nextjs | grep -i "dataLayer"
# يجب ألا يظهر أخطاء
```

**ملاحظة**: ⚠️ **اعمل على السيرفر!** تحرير الملف في Replit ← رفع ← بناء على السيرفر

---

##### المهمة 5.2: إضافة Retry Mechanism
**الملف**: `rebuild/source/src/providers/AnalyticsProvider.tsx`

**الهدف**: إعادة محاولة إرسال الأحداث عند الفشل

**التنفيذ**:
```typescript
const sendEventWithRetry = async (
  sendFn: () => Promise<void>, 
  maxRetries = 3
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sendFn();
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('Failed to send event after retries:', error);
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

**معايير القبول**:
- ✅ الأحداث تُعاد محاولتها 3 مرات عند الفشل
- ✅ فترة انتظار متزايدة بين المحاولات (1s, 2s, 3s)
- ✅ تُسجّل الأخطاء النهائية في console

**التحقق**:
```bash
# على السيرفر: قطع الإنترنت مؤقتاً واختبار
# يجب أن ترى محاولات إعادة في السجلات
```

**ملاحظة**: ⚠️ اختبر على السيرفر في بيئة production

---

##### المهمة 5.3: إعادة هيكلة Segment/Amplitude
**الملف**: `rebuild/source/src/lib/analytics/segment.ts`

**الهدف**: تحميل Segment و Amplitude بشكل ديناميكي

**التنفيذ**:
```typescript
// تحميل ديناميكي فقط عند الحاجة
let segmentClient: any = null;

export const initSegment = async () => {
  if (segmentClient) return segmentClient;
  
  const { AnalyticsBrowser } = await import('@segment/analytics-next');
  segmentClient = AnalyticsBrowser.load({
    writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
  });
  
  return segmentClient;
};
```

**معايير القبول**:
- ✅ Segment و Amplitude يُحمّلان فقط عند الاستخدام الفعلي
- ✅ تقليل حجم bundle الأولي
- ✅ لا أخطاء تحميل في console

**التحقق**:
```bash
# فحص حجم bundle
npm run build
# تحقق من تقرير الحجم في .next/
```

**ملاحظة**: ⚠️ البناء يجب أن يتم على السيرفر

---

##### المهمة 5.4: اختبار شامل للـ Analytics
**المكان**: السيرفر + متصفح

**الخطوات**:
```bash
# 1. بناء ونشر على السيرفر
cd /srv/rebuild/app
npm run build
pm2 restart rebuild-nextjs

# 2. فتح المتصفح وزيارة الموقع
# افتح Developer Tools → Console

# 3. التحقق من:
# - GTM يُحمّل بدون أخطاء
# - dataLayer يستقبل الأحداث
# - Segment يرسل البيانات
# - Amplitude يسجل الأحداث
```

**معايير القبول**:
- ✅ أحداث `pageview` تُرسل خلال ≤2 ثانية من تحميل الصفحة
- ✅ أحداث `identify` تُرسل عند تسجيل الدخول
- ✅ console نظيف بدون أخطاء analytics
- ✅ GTM Dashboard يعرض الأحداث
- ✅ Segment Dashboard يعرض البيانات

**التحقق النهائي**:
```bash
# فحص السجلات
pm2 logs rebuild-nextjs --lines 200 | grep -i "analytics\|gtm\|segment"
```

**الوقت المتوقع**: 3-4 ساعات

---

### المرحلة 6: المدفوعات - Stripe ⏳

#### 📋 المهام:

##### المهمة 6.1: إعداد Stripe Test Account
**المكان**: https://dashboard.stripe.com

**الخطوات**:
1. إنشاء حساب Stripe (أو استخدام الموجود)
2. تفعيل Test Mode
3. الحصول على المفاتيح:
   - Publishable Key (pk_test_...)
   - Secret Key (sk_test_...)

**معايير القبول**:
- ✅ حساب Stripe Test نشط
- ✅ المفاتيح محفوظة في `.env.production` على السيرفر

**إضافة المفاتيح على السيرفر**:
```bash
# على السيرفر
ssh administrator@93.127.142.144
cd /srv/rebuild/app
nano .env.production

# أضف:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

**ملاحظة**: ⚠️ **لا تضع المفاتيح في Replit!** فقط على السيرفر في `.env.production`

---

##### المهمة 6.2: إنشاء Checkout Session API
**الملف**: `rebuild/source/src/app/api/checkout/route.ts`

**الهدف**: إنشاء API endpoint لإنشاء جلسة دفع Stripe

**التنفيذ**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

**معايير القبول**:
- ✅ API يُنشئ session بنجاح
- ✅ يرد بـ sessionId
- ✅ يتعامل مع الأخطاء بشكل صحيح

**التحقق**:
```bash
# على السيرفر: اختبار API
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_xxxxx"}'

# يجب أن يرد بـ: {"sessionId":"cs_test_xxxxx"}
```

**ملاحظة**: ⚠️ الملف يُحرّر في Replit ← يُرفع للسيرفر ← يُبنى ويُختبر

---

##### المهمة 6.3: إنشاء Webhook Handler
**الملف**: `rebuild/source/src/app/api/webhooks/route.ts`

**الهدف**: استقبال أحداث Stripe (payment success, subscription created, etc.)

**التنفيذ**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // معالجة الأحداث
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: تحديث قاعدة البيانات
      console.log('Payment successful:', session.id);
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: إنشاء اشتراك في قاعدة البيانات
      console.log('Subscription created:', subscription.id);
      break;
  }

  return NextResponse.json({ received: true });
}
```

**معايير القبول**:
- ✅ Webhook يستقبل الأحداث من Stripe
- ✅ يتحقق من التوقيع (signature verification)
- ✅ يعالج الأحداث المهمة (checkout.session.completed, subscription.created)
- ✅ يسجل الأحداث في السجلات

**التحقق**:
```bash
# على السيرفر: استخدام Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks
stripe trigger checkout.session.completed

# فحص السجلات
pm2 logs rebuild-nextjs | grep -i "payment\|subscription"
```

**ملاحظة**: ⚠️ يجب تثبيت Stripe CLI على السيرفر للاختبار

---

##### المهمة 6.4: اختبار تدفق الدفع الكامل
**المكان**: السيرفر + متصفح

**الخطوات**:
```bash
# 1. على السيرفر: التأكد من الإعدادات
cd /srv/rebuild/app
cat .env.production | grep STRIPE

# 2. إعادة البناء والتشغيل
npm run build
pm2 restart rebuild-nextjs

# 3. في المتصفح:
# - زيارة صفحة Pricing
# - النقر على زر Subscribe
# - يجب أن يفتح Stripe Checkout
# - استخدام بطاقة اختبار: 4242 4242 4242 4242
# - إكمال الدفع
# - التحقق من redirect لصفحة Success
```

**معايير القبول**:
- ✅ Checkout يفتح بدون أخطاء
- ✅ بطاقة الاختبار تُقبل
- ✅ Webhook يستقبل الحدث
- ✅ المستخدم يُحوّل لصفحة Success
- ✅ الاشتراك يُسجّل في قاعدة البيانات

**التحقق النهائي**:
```bash
# فحص قاعدة البيانات
psql -h 93.127.142.144 -U saasboiler_user -d saasboiler_db
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;
```

**الوقت المتوقع**: 2-3 ساعات

---

### المرحلة 7: المراقبة والـ Feature Flags ⏳

#### 📋 المهام:

##### المهمة 7.1: تفعيل Datadog RUM الكامل
**الملف**: `rebuild/source/src/app/layout.tsx`

**الهدف**: مراقبة الأداء وتسجيل الأخطاء في production

**معايير القبول**:
- ✅ Datadog يعمل فقط في production (ليس في development)
- ✅ Session replay مفعّل
- ✅ User actions تُسجّل
- ✅ الأخطاء تظهر في Datadog Dashboard

**ملاحظة**: ⚠️ تحتاج Datadog account وإضافة `DATADOG_CLIENT_TOKEN` في `.env.production`

---

##### المهمة 7.2: إعداد LaunchDarkly Feature Flags
**الملف**: `rebuild/source/src/lib/launchdarkly.ts`

**الهدف**: تمكين/تعطيل الميزات بدون إعادة نشر

**معايير القبول**:
- ✅ LaunchDarkly SDK مثبت
- ✅ Feature flags تعمل في middleware
- ✅ تبديل flag يؤثر فوراً

**ملاحظة**: ⚠️ تحتاج LaunchDarkly account

**الوقت المتوقع**: 2 ساعة

---

### المرحلة 8: مطابقة الواجهات (الأهم!) 🔴

#### 📋 المهام:

##### المهمة 8.1: إنشاء محتوى Sanity CMS
**المكان**: Sanity Studio

**الخطوات**:
```bash
# 1. تشغيل Sanity Studio على السيرفر
cd /srv/rebuild/app
npm run sanity

# 2. فتح المتصفح: http://93.127.142.144:3333
# (أو المنفذ المحدد)

# 3. إنشاء محتوى لصفحات P0:
# - Home page sections
# - Pricing tiers
# - About page content
# - Customer stories
# - Gallery projects
# - Help articles
```

**معايير القبول**:
- ✅ محتوى كامل لجميع صفحات P0
- ✅ الصور مرفوعة في Sanity
- ✅ البيانات منظمة بشكل صحيح

**ملاحظة**: ⚠️ هذه أهم خطوة! بدون محتوى، الموقع فارغ

**الوقت المتوقع**: 4-6 ساعات

---

##### المهمة 8.2: ربط الصفحات بـ Sanity
**الملفات**: 
- `src/app/(marketing)/page.tsx` (Home)
- `src/app/(marketing)/pricing/page.tsx` (Pricing)
- إلخ...

**مثال للتنفيذ**:
```typescript
// src/app/(marketing)/page.tsx
import { client } from '@/lib/sanity';

async function getHomeData() {
  const query = `*[_type == "page" && slug.current == "home"][0]{
    title,
    sections[]{
      _type,
      _type == "heroSection" => {
        heading,
        subheading,
        ctaButton
      },
      _type == "valuePropGridSection" => {
        heading,
        items[]
      }
    }
  }`;
  
  return await client.fetch(query);
}

export default async function HomePage() {
  const data = await getHomeData();
  
  return (
    <main>
      {data.sections.map((section: any) => {
        if (section._type === 'heroSection') {
          return <HeroSection key={section._key} {...section} />;
        }
        // ... المزيد من الـ sections
      })}
    </main>
  );
}
```

**معايير القبول**:
- ✅ جميع صفحات P0 تعرض البيانات من Sanity
- ✅ الصور تُحمّل من Sanity CDN
- ✅ لا أخطاء في console
- ✅ SSR يعمل بشكل صحيح

**التحقق**:
```bash
# على السيرفر
curl http://localhost:3000 | grep -i "sanity"
# يجب أن يعرض المحتوى
```

**ملاحظة**: ⚠️ تحرير في Replit ← رفع ← بناء على السيرفر ← اختبار

**الوقت المتوقع**: 6-8 ساعات

---

##### المهمة 8.3: مطابقة CSS والتصميم
**الملفات**: `src/app/globals.css` + ملفات component

**الخطوات**:
1. فتح HTML الأصلي في متصفح
2. فتح النسخة الجديدة في متصفح آخر
3. المقارنة البصرية
4. تعديل CSS لتطابق الأصل

**معايير القبول**:
- ✅ الألوان متطابقة 100%
- ✅ الخطوط متطابقة
- ✅ التباعد والهوامش متطابقة
- ✅ Animations تعمل

**أدوات مساعدة**:
- Chrome DevTools للمقارنة
- Lighthouse للأداء
- Screenshot comparison

**الوقت المتوقع**: 4-6 ساعات

---

##### المهمة 8.4: اختبار Responsive Design
**الأجهزة المطلوبة**:
- 📱 Mobile (375px)
- 📱 Tablet (768px)
- 💻 Desktop (1440px)
- 🖥️ Large Desktop (1920px)

**معايير القبول**:
- ✅ التصميم يعمل على جميع الأحجام
- ✅ Navigation متوافق مع Mobile
- ✅ الصور responsive
- ✅ لا overflow أو scroll أفقي

**التحقق**:
```bash
# استخدام Chrome DevTools
# F12 → Toggle Device Toolbar
# اختبار جميع الأحجام
```

**الوقت المتوقع**: 2-3 ساعات

---

##### المهمة 8.5: اختبار Lighthouse
**الهدف**: Performance ≥90

**الخطوات**:
```bash
# في Chrome: F12 → Lighthouse
# Run audit على:
# - Home page
# - Pricing page
# - Gallery page
```

**معايير القبول**:
- ✅ Performance: ≥90
- ✅ Accessibility: ≥90
- ✅ Best Practices: ≥90
- ✅ SEO: ≥90

**ملاحظة**: إذا كان الأداء أقل من 90، راجع:
- حجم الصور (استخدم Next/Image)
- حجم JavaScript bundle
- Unused CSS

**الوقت المتوقع**: 2-3 ساعات للتحسينات

---

## 🚨 أخطاء شائعة وحلولها

### ❌ الخطأ: `npm install` يفشل في Replit
**السبب**: المساحة ممتلئة (2GB)
**الحل**: لا تشغله في Replit! استخدم السيرفر

### ❌ الخطأ: rsync يطلب كلمة مرور
**الحل**: استخدم `sshpass -p "$SSH_PASSWORD" rsync ...`

### ❌ الخطأ: البناء يفشل على السيرفر
**السبب**: متغيرات البيئة مفقودة
**الحل**: تحقق من `.env.production`:
```bash
ssh administrator@93.127.142.144
cat /srv/rebuild/app/.env.production
```

### ❌ الخطأ: PM2 يظهر "errored"
**الحل**: فحص السجلات:
```bash
pm2 logs rebuild-nextjs --lines 200
# ابحث عن الخطأ الفعلي
```

### ❌ الخطأ: التطبيق لا يظهر في المتصفح
**الحل**: تحقق من Nginx:
```bash
sudo systemctl status nginx
sudo nginx -t
```

---

## 📊 متابعة التقدم

### قائمة التحقق النهائية:

**المرحلة 5 - Analytics**:
- [ ] GTM readiness gate يعمل
- [ ] Retry mechanism مُضاف
- [ ] Segment/Amplitude مُحسّن
- [ ] الأحداث تصل خلال ≤2 ثانية

**المرحلة 6 - Stripe**:
- [ ] Stripe account جاهز
- [ ] Checkout API يعمل
- [ ] Webhook handler يستقبل الأحداث
- [ ] الدفع التجريبي ناجح

**المرحلة 7 - Monitoring**:
- [ ] Datadog RUM نشط
- [ ] LaunchDarkly يعمل
- [ ] Feature flags قابلة للتبديل

**المرحلة 8 - UI/UX**:
- [ ] محتوى Sanity كامل
- [ ] صفحات P0 مربوطة بالبيانات
- [ ] CSS متطابق 100%
- [ ] Responsive على جميع الأجهزة
- [ ] Lighthouse ≥90

---

## 📞 الدعم والمراجع

- **replit.md**: نظرة عامة والتحديثات
- **rebuild_master_plan.md**: الخطة الأصلية الكاملة
- **DEPLOY_README.md**: تفاصيل النشر
- **pages_migration_plan.md**: خطة هجرة الصفحات

---

**آخر تحديث**: 18 نوفمبر 2025  
**الحالة**: المراحل 1-4 مكتملة | المراحل 5-8 جاهزة للتنفيذ على السيرفر
