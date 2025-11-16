# 🎨 دليل تخصيص Boilerplate

## 📋 نظرة عامة

هذا الدليل يوضح كيفية تخصيص **NJS-Firebase-SaaS-Boilerplate** ليطابق النظام الأصلي تماماً.

---

## 🔧 التخصيصات المطلوبة

### 1. إضافة Apollo GraphQL

**الملفات الجديدة**:
```
lib/
├── apollo-client.js       # Apollo Client configuration
├── apollo-server.js       # Apollo Server setup
graphql/
├── schema.graphql         # GraphQL schema
├── resolvers/
│   ├── index.js
│   ├── queries.js
│   └── mutations.js
pages/api/
└── graphql.js            # GraphQL endpoint
```

**Dependencies الإضافية**:
```bash
npm install @apollo/client graphql @apollo/server @as-integrations/next
```

**التعديلات على `pages/_app.js`**:
```javascript
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apollo-client';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      {/* ... باقي الكود */}
    </ApolloProvider>
  );
}
```

---

### 2. إضافة Google Tag Manager

**التعديل على `pages/_document.js`**:
```javascript
// إضافة GTM script في <Head>
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
    `,
  }}
/>
```

**ملف جديد `lib/gtm.js`**:
```javascript
export const initialize = (gtmId) => {
  window.dataLayer = window.dataLayer || [];
};

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};
```

---

### 3. إضافة Segment Analytics

**Dependencies**:
```bash
npm install @segment/analytics-next
```

**ملف جديد `lib/segment.js`**:
```javascript
import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
});
```

---

### 4. إضافة Amplitude

**Dependencies**:
```bash
npm install @amplitude/analytics-browser
```

**ملف جديد `lib/amplitude.js`**:
```javascript
import * as amplitude from '@amplitude/analytics-browser';

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export const logEvent = (eventName, eventProperties) => {
  amplitude.track(eventName, eventProperties);
};
```

---

### 5. إضافة Datadog RUM

**Dependencies**:
```bash
npm install @datadog/browser-rum
```

**التعديل على `pages/_document.js`**:
```javascript
// إضافة Datadog error handler
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.preloadErrorHandler = function (event) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-api-key=${process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN}', true);
        xhr.send(JSON.stringify({
          message: event.message,
          level: 'error'
        }));
      };
    `,
  }}
/>
```

---

### 6. إضافة Sanity CMS

**Dependencies**:
```bash
npm install @sanity/client next-sanity @sanity/image-url
```

**ملف جديد `lib/sanity.js`**:
```javascript
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}
```

**مجلد جديد `sanity/schemas/`**:
```
sanity/
├── schemas/
│   ├── project.js
│   ├── category.js
│   └── index.js
└── sanity.config.js
```

---

### 7. إضافة LaunchDarkly Feature Flags

**Dependencies**:
```bash
npm install launchdarkly-react-client-sdk
```

**ملف جديد `lib/launchdarkly.js`**:
```javascript
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

export async function initLaunchDarkly() {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID,
  });
  return LDProvider;
}
```

---

### 8. تعديل Routing Structure

**الصفحات المطلوبة** (من تحليل 109 Next.js instances):

```
pages/
├── index.js                  # الصفحة الرئيسية
├── [slug].js                 # صفحات ديناميكية عامة
├── profile/
│   └── [[...profile]].js     # ملفات المستخدمين @username
├── pricing/
│   └── index.js              # صفحة الأسعار
├── about/
│   └── index.js              # عن Replit
├── gallery/
│   └── index.js              # معرض المشاريع
├── news/
│   └── [slug].js             # الأخبار
├── products/
│   └── [slug].js             # صفحات المنتجات
├── customers/
│   └── [slug].js             # صفحات العملاء
├── login.js                  # تسجيل الدخول
├── signup.js                 # إنشاء حساب
└── api/
    ├── graphql.js            # GraphQL endpoint
    └── webhooks/
        └── stripe.js         # Stripe webhooks
```

---

### 9. مطابقة التصاميم

**استخراج الأصول من الملفات الثابتة**:

```bash
# نسخ الصور
cp -r static_pages/_next/static/media/* rebuild-project/public/images/

# نسخ CSS
cp static_pages/_next/static/css/* rebuild-project/styles/

# استخراج fonts
cp -r static_pages/_next/static/fonts/* rebuild-project/public/fonts/
```

**تعديل `tailwind.config.js`**:
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // استخراج من CSS الأصلي
        primary: '#...',
        secondary: '#...',
      },
      fontFamily: {
        // استخراج من الملفات
        sans: ['...', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

### 10. إعداد Stripe (إذا لزم الأمر)

الـ Boilerplate يحتوي على Stripe بالفعل، لكن قد تحتاج:

**تعديل Products**:
```javascript
// lib/stripe/products.js
export const products = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['...']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    features: ['...']
  },
  // ... حسب صفحة pricing الأصلية
];
```

---

## 📦 ملخص Dependencies الإضافية

```json
{
  "dependencies": {
    "@apollo/client": "^3.8.0",
    "@apollo/server": "^4.9.0",
    "@as-integrations/next": "^3.0.0",
    "graphql": "^16.8.0",
    "@segment/analytics-next": "^1.68.0",
    "@amplitude/analytics-browser": "^2.3.0",
    "@datadog/browser-rum": "^5.0.0",
    "@sanity/client": "^6.10.0",
    "next-sanity": "^7.0.0",
    "@sanity/image-url": "^1.0.2",
    "launchdarkly-react-client-sdk": "^3.0.0"
  }
}
```

---

## ✅ Checklist التخصيص

- [ ] Apollo GraphQL مُضاف
- [ ] Google Tag Manager مُضاف
- [ ] Segment Analytics مُضاف
- [ ] Amplitude مُضاف
- [ ] Datadog RUM مُضاف
- [ ] Sanity CMS مُضاف
- [ ] LaunchDarkly مُضاف
- [ ] Routing structure محدّث
- [ ] الأصول الثابتة منسوخة
- [ ] Tailwind config محدّث
- [ ] Stripe products محدّثة

---

## 🚀 الأمر الكامل للإعداد

```bash
# 1. استنساخ
git clone https://github.com/WHEREISDAN/NJS-Firebase-SaaS-Boilerplate rebuild-project
cd rebuild-project

# 2. تثبيت dependencies الأساسية
npm install

# 3. تثبيت dependencies الإضافية
npm install @apollo/client graphql @apollo/server @as-integrations/next
npm install @segment/analytics-next @amplitude/analytics-browser
npm install @datadog/browser-rum @sanity/client next-sanity
npm install @sanity/image-url launchdarkly-react-client-sdk

# 4. إنشاء المجلدات المطلوبة
mkdir -p lib graphql/resolvers sanity/schemas public/images public/fonts

# 5. نسخ .env.example
cp .env.example .env.local

# 6. تشغيل dev server
npm run dev
```
