# 🔐 دليل إعداد Firebase Admin SDK - بشكل آمن

## 📋 نظرة عامة
Firebase Admin SDK يسمح بالتحقق من Firebase tokens على الخادم (server-side). هذا ضروري لـ:
- ✅ Protected API routes
- ✅ Server-side user verification
- ✅ Secure backend operations

**المدة المتوقعة**: 5-10 دقائق

---

## 🔑 الخطوة 1: الحصول على Service Account Key

### 1.1 الذهاب إلى Project Settings
1. افتح Firebase Console: **https://console.firebase.google.com/**
2. اختر مشروعك: `pelagic-quanta-445416-c3`
3. اضغط على ⚙️ **Settings** (الإعدادات) بجانب "Project Overview"
4. اختر **"Project settings"** (إعدادات المشروع)

### 1.2 الذهاب إلى Service Accounts
1. في الأعلى، اختر تبويب **"Service accounts"** (حسابات الخدمة)
2. ستجد قسم **"Firebase Admin SDK"**

### 1.3 توليد Private Key
1. اضغط على زر **"Generate new private key"** (إنشاء مفتاح خاص جديد)
2. ستظهر نافذة تحذير - اضغط **"Generate key"** (إنشاء المفتاح)
3. سيتم تنزيل ملف JSON (مثال: `pelagic-quanta-445416-c3-firebase-adminsdk-xxxxx.json`)

⚠️ **مهم جداً**: هذا الملف **حساس للغاية** - لا تشاركه مع أحد ولا ترفعه على GitHub!

---

## 📝 الخطوة 2: استخراج المعلومات من الملف

### 2.1 فتح ملف JSON
افتح الملف المُنزّل في محرر نصوص. سيكون شكله:

```json
{
  "type": "service_account",
  "project_id": "pelagic-quanta-445416-c3",
  "private_key_id": "xxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...(طويل جداً)...==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@pelagic-quanta-445416-c3.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### 2.2 نسخ المعلومات المطلوبة
ستحتاج فقط هذين:
1. **`client_email`** - البريد الإلكتروني للخدمة
2. **`private_key`** - المفتاح الخاص (النص الطويل)

---

## 🔒 الخطوة 3: إضافة Secrets في Replit (الطريقة الآمنة)

### 3.1 فتح Secrets Panel
1. في Replit، اضغط على 🔒 **"Secrets"** في القائمة اليسرى
2. أو اضغط على **"Tools" > "Secrets"**

### 3.2 إضافة Client Email
1. اضغط **"+ Add new secret"** (إضافة سر جديد)
2. **Key**: `FIREBASE_ADMIN_CLIENT_EMAIL`
3. **Value**: انسخ قيمة `client_email` من الملف JSON
   - مثال: `firebase-adminsdk-xxxxx@pelagic-quanta-445416-c3.iam.gserviceaccount.com`
4. اضغط **"Save"** (حفظ)

### 3.3 إضافة Private Key
1. اضغط **"+ Add new secret"** مرة أخرى
2. **Key**: `FIREBASE_ADMIN_PRIVATE_KEY`
3. **Value**: انسخ قيمة `private_key` **بالكامل** من الملف JSON
   - ⚠️ **انسخ كل شيء** من `-----BEGIN PRIVATE KEY-----` إلى `-----END PRIVATE KEY-----\n`
   - يجب أن يحتوي على `\n` (newline characters)
4. اضغط **"Save"** (حفظ)

✅ **تم!** الـ Secrets محفوظة بشكل آمن في Replit.

---

## 🧪 الخطوة 4: التحقق من الإعداد

### 4.1 إعادة تشغيل الـ Dev Server
بعد إضافة Secrets، أعد تشغيل:

```bash
cd rebuild/source
npm run dev
```

### 4.2 اختبار Admin SDK
يمكنك اختبار أن Admin SDK يعمل بإنشاء API route بسيط:

```typescript
// rebuild/source/src/app/api/test-admin/route.ts
import { adminAuth } from '@/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test: List first user
    const listUsersResult = await adminAuth.listUsers(1);
    
    return NextResponse.json({ 
      success: true, 
      userCount: listUsersResult.users.length,
      message: 'Admin SDK works!' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

اذهب إلى: `http://localhost:5000/api/test-admin`

إذا رأيت `{"success": true}` - **تم الإعداد بنجاح!** 🎉

---

## ⚠️ تحذيرات الأمان

### ❌ لا تفعل:
- ❌ لا ترفع ملف JSON على GitHub أو مكان عام
- ❌ لا تضع private key في ملف `.env.local` العادي
- ❌ لا تشارك client_email أو private_key مع أي شخص

### ✅ افعل:
- ✅ استخدم Replit Secrets دائماً للبيانات الحساسة
- ✅ احفظ ملف JSON في مكان آمن (محلياً فقط)
- ✅ احذف ملف JSON بعد نسخ المعلومات إلى Secrets

---

## 🔄 الخطوة 5: استخدام Admin SDK في التطبيق

بعد الإعداد، يمكنك استخدام Admin SDK في أي API route:

```typescript
import { adminAuth } from '@/firebase/admin';

// التحقق من token
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // المستخدم مُصادق عليه - يمكنك الآن استخدام uid
    return Response.json({ 
      success: true, 
      userId: uid 
    });
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
```

---

## ✨ تم الإعداد بنجاح!

الآن لديك:
- ✅ Firebase Admin SDK جاهز للعمل
- ✅ Secrets محفوظة بشكل آمن في Replit
- ✅ إمكانية التحقق من tokens على الخادم

**الخطوة التالية**: أخبر الوكيل بأن الإعداد تم، وسيستكمل المهام! 🚀
