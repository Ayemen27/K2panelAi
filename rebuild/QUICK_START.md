# ⚡ البدء السريع - 5 دقائق

## 🎯 ما تحتاجه الآن

1. **اقرأ هذا الملف** (دقيقتان)
2. **نفذ الأوامر** (3 دقائق)
3. **ابدأ العمل!**

---

## 📋 الأوامر السريعة

### الخطوة 1: استنساخ Boilerplate
```bash
git clone https://github.com/WHEREISDAN/NJS-Firebase-SaaS-Boilerplate rebuild-project
cd rebuild-project
npm install
```

### الخطوة 2: إضافة Dependencies الإضافية
```bash
npm install @apollo/client graphql @apollo/server @as-integrations/next
npm install @segment/analytics-next @amplitude/analytics-browser
npm install @datadog/browser-rum @sanity/client next-sanity
npm install @sanity/image-url launchdarkly-react-client-sdk
```

### الخطوة 3: إنشاء .env.local
```bash
cp .env.example .env.local
```

ثم عبئ المتغيرات التالية (استخرجها من `analysis/bundled_data.json`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GRAPHQL_ENDPOINT=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_AMPLITUDE_API_KEY=
NEXT_PUBLIC_SEGMENT_WRITE_KEY=
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=
NEXT_PUBLIC_DATADOG_APPLICATION_ID=
```

### الخطوة 4: تشغيل Dev Server
```bash
npm run dev
```

---

## 📚 ماذا بعد؟

1. **راجع الخطة الرئيسية**: `rebuild/planning/rebuild_master_plan.md`
2. **اتبع المراحل**: ابدأ من المرحلة 1
3. **استخدم الأدلة**: `rebuild/planning/` يحتوي على كل شيء

---

## ✅ Checklist الإعداد

- [ ] Boilerplate مستنسخ
- [ ] Dependencies مثبتة
- [ ] .env.local معبأ
- [ ] npm run dev يعمل

**مستعد؟ ابدأ المرحلة 1!**
