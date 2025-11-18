# 👤 مهام المطور 6 - File Manager UI

> **📍 أنت هنا**: المطور السادس - مدير الملفات  
> **⬅️ السابق**: [`DEVELOPER_05.md`](DEVELOPER_05.md)  
> **➡️ التالي**: [`DEVELOPER_07.md`](DEVELOPER_07.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## ⚠️ تحديث هام - لا بناء مطلوب!

**❌ هذه المهمة لم تعد مطلوبة!**

**السبب**:
- ✅ نستخدم **code-server v4.22** الذي يوفر File Manager جاهز ومتكامل
- ✅ لا حاجة لبناء File Manager من الصفر
- ✅ code-server يوفر tree view + CRUD + drag & drop جاهز

**الخطة المعتمدة**:
➡️ راجع [`../../RAPID_MVP_PLAN.md`](../../RAPID_MVP_PLAN.md) ⬅️

**للمطور**:
- ❌ لا تبني File Manager Component
- ✅ استخدم code-server مباشرة
- ✅ ركز على دمج code-server مع Control Plane

---

## 📋 المحتوى التاريخي (للمرجع فقط)

**تنبيه**: المحتوى أدناه من الخطة القديمة - للمرجع فقط!

### 🎯 مهمتك الرئيسية (قديم - لا تتبع)

- ❌ **إنشاء File Manager Component** (code-server يوفره)
- ❌ **CRUD operations** (code-server يوفره)
- ❌ **File upload/download** (code-server يوفره)
- ❌ **Search & filter** (code-server يوفره)

**تقدير الجهد السابق**: 4-5 أيام (32 ساعة)  
**التقدير الجديد**: 0 أيام - نستخدم الجاهز! ✅

---

## ✅ قائمة التحقق من إعادة الاستخدام

- [ ] ✅ بحثت عن file manager component موجود
- [ ] ✅ راجعت المكتبات: react-arborist, react-complex-tree
- [ ] ✅ حددت ما سأعيد استخدامه
- [ ] ✅ وثّقت القرارات

---

## 📋 المهام الرئيسية

### 1. File Tree Component (12 ساعات)
```typescript
// المكونات:
- FileTree (tree view)
- FileItem (folder/file)
- ContextMenu (right click)
- DragDrop support
```

### 2. File Operations API (8 ساعات)
```typescript
// API endpoints:
- GET /api/files/list
- POST /api/files/create
- PUT /api/files/update
- DELETE /api/files/delete
- POST /api/files/upload
```

### 3. File Preview (6 ساعات)
```typescript
// Preview للملفات:
- Text files (.txt, .md)
- Code files (.js, .ts, .py)
- Images (.png, .jpg)
- PDFs (اختياري)
```

### 4. Search & Filter (4 ساعات)
```typescript
// ميزات البحث:
- بحث بالاسم
- فلترة حسب النوع
- Recent files
```

### 5. الاختبار (2 ساعات)
```yaml
اختبارات:
- ✓ Create folder/file
- ✓ Rename
- ✓ Delete
- ✓ Upload
- ✓ Download
```

---

## ✅ معايير القبول

**يُقبل عندما**:
- [x] ✅ File tree يعرض بشكل صحيح
- [x] ✅ جميع CRUD operations تعمل
- [x] ✅ Upload/Download يعملان
- [x] ✅ UI سريع و responsive
- [x] ✅ Git Tag: `dev6_complete`

---

## 📊 تقدير الوقت: 32 ساعة (4-5 أيام)

**آخر تحديث**: 2025-11-18  
**الحالة**: ✅ جاهز للتنفيذ
