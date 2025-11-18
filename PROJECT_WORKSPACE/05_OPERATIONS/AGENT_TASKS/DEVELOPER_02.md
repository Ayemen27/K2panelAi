# 👤 مهام المطور 2 - إزالة الخدمات المدفوعة

> **📍 أنت هنا**: المطور الثاني - تنظيف الكود  
> **⬅️ السابق**: [`DEVELOPER_01.md`](DEVELOPER_01.md)  
> **➡️ التالي**: [`DEVELOPER_03.md`](DEVELOPER_03.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## 🎯 مهمتك الرئيسية

**أنت المطور الثاني** - مسؤوليتك:
- ✅ **إزالة جميع الخدمات المدفوعة** (Firebase, Stripe, Analytics)
- ✅ **تنظيف package.json** من Dependencies غير مستخدمة
- ✅ **تقليل حجم المشروع** بـ 60-80MB
- ✅ **التحقق من عدم تكرار الكود** الموجود
- ✅ **التسليم للمطور 3** بكود نظيف

**تقدير الجهد**: 2-3 أيام  
**الأولوية**: 🔴 حرج - يعتمد عليك Developer 3

---

## 📚 قبل أن تبدأ

### **1. اقرأ HANDOFF من Developer 1** ⏱️ 30 دقيقة:

- [ ] راجع [`../../06_TEMPLATES/HANDOFF.md`](../../06_TEMPLATES/HANDOFF.md) من Developer 1
- [ ] تأكد من:
  - ✅ Audit مكتمل
  - ✅ قائمة الحذف جاهزة
  - ✅ Bridge Tool يعمل
  - ✅ Git Tag: `dev1_complete` موجود

### **2. راجع هذه الملفات** ⏱️ 1 ساعة:

- [ ] [`../../02_INTEGRATION_PLAN/MERGE_STRATEGY.md`](../../02_INTEGRATION_PLAN/MERGE_STRATEGY.md) - استراتيجية الدمج
- [ ] [`../../05_OPERATIONS/SPACE_MANAGEMENT.md`](../SPACE_MANAGEMENT.md) - إدارة المساحة
- [ ] [`../../02_INTEGRATION_PLAN/BRIDGE_TOOL.md`](../../02_INTEGRATION_PLAN/BRIDGE_TOOL.md) - استخدام Bridge Tool

---

## ✅ قائمة التحقق من إعادة الاستخدام (إلزامية!)

### **قبل البدء**:
- [ ] ✅ بحثت في الكود الموجود عن خدمات Auth بديلة
- [ ] ✅ تأكدت من عدم وجود نظام Auth محلي بالفعل
- [ ] ✅ راجعت ServerAutomationAI - هل يحتوي على Auth؟
- [ ] ✅ حددت ما سأحذف وما سأُبقي

### **بعد الانتهاء**:
- [ ] ✅ راجعت أنني لم أحذف كود سيُستخدم لاحقاً
- [ ] ✅ تأكدت من عدم ترك ملفات مكررة
- [ ] ✅ وثّقت في HANDOFF ما حذفت ولماذا

---

## 📋 المهام التفصيلية

### **Phase 1: الفحص والتحضير** ⏱️ 4 ساعات

#### **1.1 Clone من Git Tag السابق**
```bash
# ابدأ من حيث انتهى Developer 1
git fetch --tags
git checkout dev1_complete

# تأكد أنك على الإصدار الصحيح
git describe --tags
# يجب أن يعرض: dev1_complete
```

#### **1.2 فحص الكود الموجود**
```bash
# 1. افحص Firebase usage
grep -r "firebase" src/ --exclude-dir=node_modules

# 2. افحص Stripe usage
grep -r "stripe" src/ --exclude-dir=node_modules

# 3. افحص Analytics usage
grep -r "@datadog" src/ --exclude-dir=node_modules
grep -r "segment" src/ --exclude-dir=node_modules
grep -r "amplitude" src/ --exclude-dir=node_modules

# 4. احفظ النتائج
grep -r "firebase\|stripe\|datadog\|segment\|amplitude" src/ > /tmp/paid_services_usage.txt
```

#### **1.3 إنشاء قائمة الحذف**
```markdown
# اصنع ملف: DELETION_LIST.md

## Firebase
- [ ] src/server/auth/firebase.ts
- [ ] src/lib/firebase/
- [ ] firebase-admin dependency
- [ ] firebase dependency

## Stripe
- [ ] src/lib/stripe/
- [ ] src/app/api/stripe/
- [ ] @stripe/stripe-js dependency
- [ ] stripe dependency

## Analytics
- [ ] src/lib/analytics/datadog.ts
- [ ] src/lib/analytics/segment.ts
- [ ] src/lib/analytics/amplitude.ts
- [ ] @datadog/browser-rum dependency
- [ ] @segment/analytics-next dependency
- [ ] @amplitude/analytics-browser dependency

## Sanity CMS (اختياري - راجع)
- [ ] ⚠️ قرار: إبقاء أو حذف؟
  - إذا حذف: سيوفر ~50MB
  - إذا أبقى: يمكن استخدامه للمحتوى المجاني
```

---

### **Phase 2: إزالة Firebase** ⏱️ 3 ساعات

#### **2.1 حذف ملفات Firebase**
```bash
# حذف مجلدات
rm -rf src/server/auth/firebase/
rm -rf src/lib/firebase/

# حذف ملفات فردية
find src/ -name "*firebase*" -type f -delete

# التحقق
find src/ -name "*firebase*"
# يجب ألا يعرض شيء
```

#### **2.2 إزالة Firebase من package.json**
```bash
# استخدم npm uninstall
npm uninstall firebase firebase-admin

# أو يدوياً في package.json:
# احذف:
# "firebase": "^10.x.x",
# "firebase-admin": "^11.x.x"
```

#### **2.3 تنظيف Imports**
```bash
# ابحث عن imports متبقية
grep -r "from.*firebase" src/
grep -r "import.*firebase" src/

# احذفها يدوياً من الملفات
```

**Commit:**
```bash
git add .
git commit -m "chore(cleanup): remove Firebase dependencies"
```

---

### **Phase 3: إزالة Stripe** ⏱️ 2 ساعات

#### **3.1 حذف ملفات Stripe**
```bash
rm -rf src/lib/stripe/
rm -rf src/app/api/stripe/
find src/ -name "*stripe*" -type f -delete
```

#### **3.2 إزالة من package.json**
```bash
npm uninstall stripe @stripe/stripe-js @stripe/react-stripe-js
```

**Commit:**
```bash
git add .
git commit -m "chore(cleanup): remove Stripe payment integration"
```

---

### **Phase 4: إزالة Analytics** ⏱️ 2 ساعات

#### **4.1 حذف ملفات Analytics**
```bash
rm -rf src/lib/analytics/
find src/ -name "*datadog*" -o -name "*segment*" -o -name "*amplitude*" -type f -delete
```

#### **4.2 إزالة من package.json**
```bash
npm uninstall @datadog/browser-rum
npm uninstall @segment/analytics-next
npm uninstall @amplitude/analytics-browser
```

**Commit:**
```bash
git add .
git commit -m "chore(cleanup): remove analytics services (Datadog, Segment, Amplitude)"
```

---

### **Phase 5: قرار Sanity CMS** ⏱️ 1 ساعة

#### **5.1 تقييم الحاجة**
```yaml
السؤال: هل نحتاج Sanity CMS؟

الإيجابيات:
  - Content management مجاني
  - API جاهز
  - Schemas موجودة (33 schema)

السلبيات:
  - حجم كبير (~30MB)
  - قد لا نحتاجه في MVP

القرار الموصى به:
  ✅ احتفظ به مؤقتاً
  ⏳ يمكن حذفه في Developer 12 (Final Cleanup)
```

---

### **Phase 6: تنظيف شامل** ⏱️ 3 ساعات

#### **6.1 تنظيف package.json**
```bash
# افتح package.json
# احذف dependencies غير المستخدمة:
# - أي library مرتبطة بـ Firebase
# - أي library مرتبطة بـ Stripe
# - أي library للـ Analytics

# مثال على ما يجب حذفه:
# "firebase-functions": "^x.x.x"  ← مرتبط بـ Firebase
# "stripe-event-types": "^x.x.x"  ← مرتبط بـ Stripe
```

#### **6.2 تنظيف Env Variables**
```bash
# افتح .env.example
# احذف:
# NEXT_PUBLIC_FIREBASE_*
# FIREBASE_ADMIN_*
# STRIPE_*
# NEXT_PUBLIC_STRIPE_*
# DATADOG_*
# SEGMENT_*
# AMPLITUDE_*

# أبقِ فقط:
# NEXT_PUBLIC_SANITY_*  (إذا قررت الإبقاء)
# DATABASE_URL  (سيُستخدم لاحقاً)
```

#### **6.3 فحص النتيجة**
```bash
# افحص الحجم
du -sh .
# يجب أن يكون أقل من 700MB

# افحص package.json
cat package.json | jq '.dependencies'
# تأكد من عدم وجود firebase, stripe, analytics

# افحص الملفات المتبقية
find src/ -name "*firebase*" -o -name "*stripe*"
# يجب ألا يعرض شيء
```

---

### **Phase 7: Push للسيرفر والاختبار** ⏱️ 2 ساعات

#### **7.1 Final Commit**
```bash
git add .
git commit -m "feat(dev2): remove all paid services - Firebase, Stripe, Analytics"

# إنشاء Tag
git tag -a dev2_complete -m "Developer 2 completed: removed paid services"
```

#### **7.2 Push عبر Bridge Tool**
```bash
cd ServerAutomationAI/bridge_tool
python3 cli.py push --message "Dev2: Clean codebase"

# انتظر النتيجة
python3 cli.py status
```

#### **7.3 راجع تقرير السيرفر**
```yaml
المتوقع من السيرفر:
  Build Status: ⚠️ قد يفشل (طبيعي - لأننا حذفنا imports)
  Size Reduction: ✅ ~60-80MB
  Conflicts: ⚠️ قد توجد (سنحلها في Developer 3)
  
الخطوة التالية:
  Developer 3 سيصلح الـ imports ويضيف NextAuth
```

---

## 📝 Deliverables النهائية

### **يجب إنشاء/تحديث هذه الملفات**:

- [ ] `DELETION_LIST.md` - قائمة تفصيلية بما حُذف
- [ ] `package.json` - نظيف من paid services
- [ ] `.env.example` - نظيف من متغيرات الخدمات المدفوعة
- [ ] [`../../06_TEMPLATES/HANDOFF.md`](../../06_TEMPLATES/HANDOFF.md) - ملأه بمعلوماتك للـ Developer 3

### **يجب Commit & Push**:

- [ ] Git Tag: `dev2_complete`
- [ ] جميع التغييرات في Git
- [ ] تقرير السيرفر مراجع

---

## ✅ معايير القبول (Acceptance Criteria)

### **يُقبل العمل عندما**:
- [x] ✅ جميع ملفات Firebase محذوفة (0 ملف)
- [x] ✅ جميع ملفات Stripe محذوفة (0 ملف)
- [x] ✅ جميع ملفات Analytics محذوفة (0 ملف)
- [x] ✅ package.json نظيف (0 dependency مدفوع)
- [x] ✅ .env.example نظيف (0 متغير مدفوع)
- [x] ✅ توفير مساحة: 60-80MB
- [x] ✅ Git Tag: `dev2_complete` موجود
- [x] ✅ HANDOFF مكتوب للمطور 3

### **يُرفض العمل عندما**:
- [ ] ❌ بقيت ملفات Firebase/Stripe
- [ ] ❌ بقيت dependencies في package.json
- [ ] ❌ لم يتم توفير مساحة كافية
- [ ] ❌ HANDOFF فارغ أو ناقص

---

## 📊 تقدير الوقت التفصيلي

| المرحلة | المهمة | الوقت |
|---------|--------|-------|
| **Phase 1** | الفحص والتحضير | 4 ساعات |
| **Phase 2** | إزالة Firebase | 3 ساعات |
| **Phase 3** | إزالة Stripe | 2 ساعات |
| **Phase 4** | إزالة Analytics | 2 ساعات |
| **Phase 5** | قرار Sanity | 1 ساعة |
| **Phase 6** | تنظيف شامل | 3 ساعات |
| **Phase 7** | Push واختبار | 2 ساعات |
| **المجموع** | | **17 ساعة (~2-3 أيام)** |

---

## 🚀 الخطوة الأخيرة: التسليم

### **إنشاء HANDOFF للمطور 3**:

```markdown
# HANDOFF من Developer 2 إلى Developer 3

## ما أنجزته:
✅ حذفت جميع الخدمات المدفوعة:
  - Firebase (Auth + Firestore)
  - Stripe (Payments)
  - Analytics (Datadog, Segment, Amplitude)

✅ نظّفت package.json من 15+ dependency

✅ وفّرت مساحة: 78MB

## الوضع الحالي:
- Build Status: ⚠️ فاشل (imports مكسورة - طبيعي)
- Size: 722MB (كان 800MB)
- Git Tag: dev2_complete

## ما يحتاج المطور 3 فعله:
1. تثبيت NextAuth بدلاً من Firebase
2. إصلاح broken imports
3. إنشاء SQLite database
4. اختبار Auth flow

## ملفات مهمة:
- DELETION_LIST.md - قائمة كاملة بما حذفت
- package.json - نظيف وجاهز
- .env.example - محدث

## ملاحظات:
- احتفظت بـ Sanity CMS مؤقتاً
- يمكن حذفه لاحقاً إذا لم يُستخدم
```

---

## 🔗 الروابط ذات الصلة

**اقرأ قبل البدء**:
- 📖 [`../../02_INTEGRATION_PLAN/MERGE_STRATEGY.md`](../../02_INTEGRATION_PLAN/MERGE_STRATEGY.md)
- 📖 [`../../02_INTEGRATION_PLAN/BRIDGE_TOOL.md`](../../02_INTEGRATION_PLAN/BRIDGE_TOOL.md)

**بعد الانتهاء**:
- ➡️ [`DEVELOPER_03.md`](DEVELOPER_03.md) - المطور التالي

**للرجوع**:
- 🏠 [`../../INDEX.md`](../../INDEX.md) - الدليل الرئيسي
- ⬅️ [`DEVELOPER_01.md`](DEVELOPER_01.md) - المطور السابق

---

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ جاهز للتنفيذ  
**الأولوية**: 🔴 حرج  
**تقدير الجهد**: 2-3 أيام (17 ساعة)
