# 👤 مهام المطور 6 - File Manager UI

> **📍 أنت هنا**: المطور السادس - مدير الملفات  
> **⬅️ السابق**: [`DEVELOPER_05.md`](DEVELOPER_05.md)  
> **➡️ التالي**: [`DEVELOPER_07.md`](DEVELOPER_07.md)  
> **🏠 العودة للدليل**: [`../../INDEX.md`](../../INDEX.md)

---

## 🎯 مهمتك الرئيسية

- ✅ **إنشاء File Manager Component** - tree view للملفات
- ✅ **CRUD operations** - Create, Read, Update, Delete files
- ✅ **File upload/download**
- ✅ **Search & filter**
- ✅ **التحقق من عدم تكرار** file manager موجود

**تقدير الجهد**: 4-5 أيام (32 ساعة)  
**الأولوية**: 🔴 حرج

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
