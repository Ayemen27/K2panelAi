# 🏗️ خطة إعادة البناء الشاملة - النظام الأصلي طبق الأصل

## 📋 نظرة عامة

**الهدف**: بناء نسخة مطابقة 100% للنظام الأصلي في الوظائف والواجهات

**المدة المقدرة**: 12-20 يوم عمل  
**حجم الفريق**: 2-3 مطورين  
**Boilerplate الأساسي**: NJS-Firebase-SaaS-Boilerplate + Apollo Extensions

---

## 🎯 المراحل والأولويات

### ✅ معايير القبول الشاملة:
- [ ] 13 متغير بيئة مُعد ويعمل
- [ ] GraphQL endpoints قابلة للوصول
- [ ] Firebase Auth flows تعمل (تسجيل دخول/إنشاء حساب)
- [ ] محتوى CMS يُعرض عبر GROQ
- [ ] أحداث Analytics تُرسل عبر GTM dataLayer
- [ ] مدفوعات Stripe تجريبية تعمل
- [ ] Datadog و LaunchDarkly SDKs تُرسل البيانات

---

## 📅 المرحلة 0: الإعداد والتحضير (يوم 1)

### المهام:
1. **إنشاء بيئة العمل**
   ```bash
   # استنساخ Boilerplate الموصى به
   git clone https://github.com/WHEREISDAN/NJS-Firebase-SaaS-Boilerplate rebuild-project
   cd rebuild-project
   npm install
   ```

2. **إعداد متغيرات البيئة (13 متغير)**
   - إنشاء ملف `.env.local`
   - استخراج المتغيرات من `analysis/bundled_data.json`
   - المتغيرات المطلوبة:
     ```env
     # Firebase (من 110 تكوين مكتشف)
     NEXT_PUBLIC_FIREBASE_API_KEY=
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
     NEXT_PUBLIC_FIREBASE_APP_ID=
     
     # GraphQL
     NEXT_PUBLIC_GRAPHQL_ENDPOINT=
     
     # GTM
     NEXT_PUBLIC_GTM_ID=
     
     # Analytics
     NEXT_PUBLIC_GA_MEASUREMENT_ID=
     NEXT_PUBLIC_AMPLITUDE_API_KEY=
     NEXT_PUBLIC_SEGMENT_WRITE_KEY=
     
     # Datadog
     NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=
     NEXT_PUBLIC_DATADOG_APPLICATION_ID=
     ```

3. **تحليل Next.js Data Instances (109 instance)**
   - مراجعة `analysis/bundled_data.json`
   - استخراج جميع الـ pages والـ routes
   - تحديد بنية الـ routing المطلوبة

### معايير القبول:
- [x] Boilerplate مستنسخ ويعمل محلياً
- [x] جميع المتغيرات موثقة في `.env.local`
- [x] قائمة بجميع الصفحات المطلوبة من Next.js data

---

## 📅 المرحلة 1: البنية الأساسية - Next.js SSR (أيام 2-3)

### الأولوية: 🔴 حرجة

### المهام:

#### 1.1 إعداد Next.js Routing
**المدخلات**: 109 Next.js data instances من التحليل

**المهام الفرعية**:
1. استخراج جميع الـ pages من `bundled_data.json`
2. إنشاء هيكل `pages/` بناءً على التحليل:
   ```
   pages/
   ├── index.js                    # الصفحة الرئيسية
   ├── [slug].js                   # صفحات ديناميكية
   ├── profile/
   │   └── [[...profile]].js       # ملفات المستخدمين
   ├── pricing/
   │   └── index.js
   ├── about/
   │   └── index.js
   └── api/
       └── graphql.js              # GraphQL endpoint
   ```

3. استنساخ بنية HTML من الملفات الثابتة:
   - نسخ الـ layouts من `index.html`, `about.html`, etc
   - استخراج الـ meta tags و SEO
   - نسخ الـ scripts الأساسية

#### 1.2 إعداد _app.js و _document.js
**الملفات المطلوبة**:

```javascript
// pages/_app.js
import { ApolloProvider } from '@apollo/client';
import { FirebaseProvider } from '../lib/firebase';
import apolloClient from '../lib/apollo-client';
import '../styles/globals.css';

// GTM Initialization
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtm from '../lib/gtm';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    gtm.initialize(process.env.NEXT_PUBLIC_GTM_ID);
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => gtm.pageview(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <FirebaseProvider>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </FirebaseProvider>
  );
}

export default MyApp;
```

```javascript
// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar">
        <Head>
          {/* GTM Script - من التكوينات المكتشفة */}
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
          
          {/* Datadog RUM - من التكوينات المكتشفة */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.preloadErrorHandler = function (event) {
                  var xhr = new XMLHttpRequest();
                  xhr.open('POST', 'https://http-intake.logs.us5.datadoghq.com/api/v2/logs?dd-api-key=${process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN}', true);
                  xhr.setRequestHeader('Accept', 'application/json');
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.send(JSON.stringify({
                    message: event.message,
                    level: 'error',
                    timestamp: Date.now()
                  }));
                };
              `,
            }}
          />
          
          {/* Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          {/* GTM noscript */}
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

#### 1.3 استنساخ الأصول الثابتة
1. نسخ جميع الصور من `static_pages/` إلى `public/images/`
2. نسخ ملفات CSS إلى `styles/`
3. نسخ ملفات JavaScript الثابتة

### معايير القبول:
- [ ] جميع الصفحات (109) موجودة في `pages/`
- [ ] التنقل بين الصفحات يعمل
- [ ] GTM dataLayer يرسل أحداث pageview
- [ ] Datadog يستقبل الأخطاء

---

## 📅 المرحلة 2: طبقة البيانات - Apollo GraphQL (أيام 4-6)

### الأولوية: 🔴 حرجة

### المهام:

#### 2.1 إعداد Apollo Client
```bash
npm install @apollo/client graphql
```

**ملف**: `lib/apollo-client.js`
```javascript
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // استخراج من apolloState المكتشف
    }
  }),
  ssrMode: typeof window === 'undefined',
});

export default client;
```

#### 2.2 إنشاء GraphQL Server
**المدخلات**: 1,186 API endpoint من التحليل

**ملف**: `pages/api/graphql.js`
```javascript
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

export default startServerAndCreateNextHandler(server);
```

#### 2.3 استخراج GraphQL Schema من API Endpoints
1. مراجعة `bundled_data.json` - api_endpoints
2. تحليل أنماط الـ endpoints:
   - `/api/projects` → Query.projects
   - `/api/users` → Query.user
   - `/api/auth` → Mutation.login, Mutation.signup
3. إنشاء schema.graphql

**مثال Schema**:
```graphql
type Query {
  projects(
    featured: Boolean
    category: String
    page: Int
    perPage: Int
  ): ProjectConnection!
  
  project(slug: String!): Project
  user(id: ID!): User
  categories: [Category!]!
}

type Mutation {
  createProject(input: CreateProjectInput!): Project!
  updateProject(id: ID!, input: UpdateProjectInput!): Project!
  deleteProject(id: ID!): Boolean!
  
  signup(input: SignupInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
}

type Project {
  id: ID!
  title: String!
  slug: String!
  description: String
  imageUrl: String
  demoUrl: String
  replUrl: String
  userId: ID!
  user: User!
  category: Category
  isPublished: Boolean!
  isFeatured: Boolean!
  viewsCount: Int!
  likesCount: Int!
  createdAt: String!
}

type ProjectConnection {
  edges: [Project!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type User {
  id: ID!
  username: String!
  email: String!
  firstName: String
  lastName: String
  profileImageUrl: String
  projects: [Project!]!
}

type Category {
  id: ID!
  name: String!
  slug: String!
  description: String
  icon: String
}

type AuthPayload {
  token: String!
  user: User!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

input CreateProjectInput {
  title: String!
  description: String
  imageUrl: String
  categoryId: ID
}

input UpdateProjectInput {
  title: String
  description: String
  imageUrl: String
  categoryId: ID
  isPublished: Boolean
  isFeatured: Boolean
}

input SignupInput {
  username: String!
  email: String!
  password: String!
  firstName: String
  lastName: String
}

input LoginInput {
  email: String!
  password: String!
}
```

### معايير القبول:
- [ ] Apollo Client متصل بـ Server
- [ ] جميع الـ queries و mutations تعمل
- [ ] البيانات تُعرض في الصفحات
- [ ] SSR يعمل مع Apollo

---

## 📅 المرحلة 3: المصادقة والقاعدة - Firebase (أيام 7-8)

### الأولوية: 🔴 حرجة

### المهام:

#### 3.1 إعداد Firebase Project
1. إنشاء مشروع Firebase جديد
2. تفعيل Authentication:
   - Email/Password
   - Google OAuth
   - GitHub OAuth (إن وجد في التحليل)
3. إنشاء Firestore Database
4. تكوين Security Rules

#### 3.2 إعداد Firebase في Next.js
```bash
npm install firebase firebase-admin
```

**ملف**: `lib/firebase/client.js`
```javascript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

#### 3.3 إنشاء Auth Flows
1. صفحة تسجيل الدخول `/login`
2. صفحة إنشاء حساب `/signup`
3. Auth Context Provider
4. Protected Routes

**ملف**: `contexts/AuthContext.js`
```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase/client';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loginWithGoogle,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### معايير القبول:
- [ ] تسجيل دخول Email/Password يعمل
- [ ] تسجيل دخول Google OAuth يعمل
- [ ] Firebase Auth متكامل مع Apollo
- [ ] Protected routes تعمل

---

## 📅 المرحلة 4: إدارة المحتوى - Sanity CMS (يوم 9)

### الأولوية: 🟡 متوسطة

### المهام:

#### 4.1 إعداد Sanity Project
```bash
npm install @sanity/client next-sanity
```

#### 4.2 إنشاء Schemas
بناءً على المحتوى المكتشف في الصور (cdn.sanity.io)

```javascript
// sanity/schemas/project.js
export default {
  name: 'project',
  type: 'document',
  title: 'Project',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title'
      }
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'category',
      type: 'reference',
      title: 'Category',
      to: [{ type: 'category' }]
    }
  ]
};
```

#### 4.3 تكوين Sanity Client
```javascript
// lib/sanity.js
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

### معايير القبول:
- [ ] Sanity Studio يعمل
- [ ] المحتوى يُعرض في الصفحات
- [ ] الصور تُحمل من Sanity CDN

---

## 📅 المرحلة 5: Analytics والتتبع (أيام 10-11)

### الأولوية: 🟡 متوسطة

### المهام:

#### 5.1 Google Tag Manager (مُعد من المرحلة 1)
- التأكد من أن dataLayer يعمل
- تكوين Tags في GTM Dashboard

#### 5.2 Google Analytics 4
```javascript
// lib/gtm.js
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const initialize = (gtmId) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
};

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

export const event = ({ action, category, label, value }) => {
  window.dataLayer.push({
    event: action,
    eventCategory: category,
    eventLabel: label,
    eventValue: value,
  });
};
```

#### 5.3 Segment
```bash
npm install @segment/analytics-next
```

```javascript
// lib/segment.js
import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
});

export const track = (event, properties) => {
  analytics.track(event, properties);
};

export const identify = (userId, traits) => {
  analytics.identify(userId, traits);
};
```

#### 5.4 Amplitude
```bash
npm install @amplitude/analytics-browser
```

```javascript
// lib/amplitude.js
import * as amplitude from '@amplitude/analytics-browser';

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);

export const logEvent = (eventName, eventProperties) => {
  amplitude.track(eventName, eventProperties);
};

export const setUserId = (userId) => {
  amplitude.setUserId(userId);
};
```

### معايير القبول:
- [ ] GTM dataLayer يرسل الأحداث
- [ ] GA4 يستقبل pageviews
- [ ] Segment يوزع البيانات
- [ ] Amplitude يتتبع الأحداث

---

## 📅 المرحلة 6: المدفوعات - Stripe (يوم 12)

### الأولوية: 🟢 منخفضة

### المهام:

#### 6.1 إعداد Stripe
```bash
npm install @stripe/stripe-js stripe
```

#### 6.2 إنشاء Checkout Session
```javascript
// pages/api/create-checkout-session.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.items,
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
      });
      res.json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
```

### معايير القبول:
- [ ] Stripe Checkout يعمل
- [ ] الاشتراكات تُنشأ
- [ ] Webhooks تعمل

---

## 📅 المرحلة 7: المراقبة والتحسين (أيام 13-15)

### الأولوية: 🟡 متوسطة

### المهام:

#### 7.1 Datadog RUM
```bash
npm install @datadog/browser-rum
```

```javascript
// lib/datadog.js
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.com',
  service: 'replit-rebuild',
  env: process.env.NODE_ENV,
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();
```

#### 7.2 LaunchDarkly Feature Flags
```bash
npm install launchdarkly-react-client-sdk
```

### معايير القبول:
- [ ] Datadog يستقبل البيانات
- [ ] Feature flags تعمل
- [ ] الأخطاء تُرصد

---

## 📅 المرحلة 8: مطابقة الواجهات (أيام 16-18)

### الأولوية: 🔴 حرجة

### المهام:

#### 8.1 استنساخ التصاميم
1. **استخراج CSS من الملفات الثابتة**:
   - نسخ جميع ملفات CSS
   - استخراج Tailwind classes
   - نسخ animations و transitions

2. **إعادة بناء Components**:
   - Header/Navigation
   - Footer
   - Hero Sections
   - Cards
   - Forms
   - Modals

3. **مطابقة الألوان والخطوط**:
   ```css
   /* استخراج من main.css */
   :root {
     --primary-color: #...;
     --secondary-color: #...;
     --font-family: ...;
   }
   ```

#### 8.2 Responsive Design
- مطابقة breakpoints
- اختبار على جميع الأحجام
- مطابقة mobile navigation

#### 8.3 Animations و Interactions
- نسخ جميع animations من JavaScript
- مطابقة hover effects
- مطابقة scroll animations

### معايير القبول:
- [ ] الواجهات مطابقة 100% للأصلية
- [ ] Responsive design يعمل
- [ ] جميع Animations تعمل

---

## 📅 المرحلة 9: الاختبار والتحسين (أيام 19-20)

### الأولوية: 🔴 حرجة

### المهام:

#### 9.1 اختبارات الوظائف
- [ ] جميع الصفحات تفتح
- [ ] التنقل يعمل
- [ ] Forms تُرسل البيانات
- [ ] Auth flows تعمل
- [ ] GraphQL queries تعمل

#### 9.2 اختبارات الأداء
- [ ] Lighthouse Score > 90
- [ ] Core Web Vitals جيدة
- [ ] Images محسّنة
- [ ] Code splitting يعمل

#### 9.3 اختبارات Analytics
- [ ] جميع الأحداث تُرسل
- [ ] GTM tags تعمل
- [ ] Datadog يستقبل البيانات

### معايير القبول:
- [ ] جميع الاختبارات تنجح
- [ ] الأداء ممتاز
- [ ] لا توجد أخطاء

---

## 📊 تتبع التقدم

### Checklist شامل:

#### البنية التحتية ✅
- [ ] Next.js مُعد
- [ ] Environment variables
- [ ] Routing structure
- [ ] Static assets

#### البيانات ✅
- [ ] Apollo Client
- [ ] Apollo Server
- [ ] GraphQL Schema
- [ ] Resolvers

#### المصادقة ✅
- [ ] Firebase Auth
- [ ] Login/Signup flows
- [ ] Protected routes
- [ ] Auth Context

#### المحتوى ✅
- [ ] Sanity CMS
- [ ] Content schemas
- [ ] Image optimization

#### Analytics ✅
- [ ] GTM
- [ ] GA4
- [ ] Segment
- [ ] Amplitude
- [ ] Datadog

#### الواجهات ✅
- [ ] Components
- [ ] Styling
- [ ] Responsive
- [ ] Animations

#### الاختبار ✅
- [ ] Functional tests
- [ ] Performance tests
- [ ] Analytics tests

---

## 🔧 الأدوات والموارد

### Boilerplates:
1. **الأساسي**: https://github.com/WHEREISDAN/NJS-Firebase-SaaS-Boilerplate
2. **GraphQL**: https://github.com/nateq314/graphql-nextjs-apollo-boilerplate
3. **Apollo Hooks**: https://github.com/atherosai/next-react-graphql-apollo-hooks

### المراجع:
- Next.js Docs: https://nextjs.org/docs
- Apollo Docs: https://www.apollographql.com/docs/
- Firebase Docs: https://firebase.google.com/docs
- Sanity Docs: https://www.sanity.io/docs

---

## 🚀 البدء الفوري

### الأوامر الأولى:
```bash
# 1. استنساخ Boilerplate
git clone https://github.com/WHEREISDAN/NJS-Firebase-SaaS-Boilerplate rebuild-project
cd rebuild-project

# 2. تثبيت Dependencies
npm install

# 3. إضافة Apollo
npm install @apollo/client graphql @apollo/server @as-integrations/next

# 4. إنشاء .env.local
cp .env.example .env.local
# ثم تعبئة المتغيرات من analysis/bundled_data.json

# 5. تشغيل Dev Server
npm run dev
```

---

## ✅ النجاح النهائي

عند اكتمال جميع المراحل، سيكون لديك:
- ✅ نظام مطابق 100% للأصلي
- ✅ جميع الوظائف تعمل
- ✅ الواجهات مطابقة تماماً
- ✅ Analytics و Monitoring يعملان
- ✅ كود نظيف وموثق
- ✅ جاهز للإطلاق
