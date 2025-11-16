
#!/usr/bin/env python3
"""
نظام توليد التوثيق الشامل للمشروع
يقوم بإنشاء مجلدات وملفات توثيق لكل نظام
"""

import os
import json
from pathlib import Path
from datetime import datetime

class SystemsDocumentationGenerator:
    def __init__(self):
        self.base_docs_dir = Path('docs/systems')
        self.systems = {
            'backend': {
                'name': 'نظام Backend (الخادم)',
                'description': 'النظام الخلفي المسؤول عن معالجة البيانات والـ APIs',
                'files': ['app.py', 'main.py', 'config.py'],
                'subsystems': {
                    'database': {
                        'name': 'نظام قاعدة البيانات',
                        'files': ['models.py'],
                        'description': 'إدارة البيانات والجداول'
                    },
                    'authentication': {
                        'name': 'نظام المصادقة',
                        'files': ['auth.py'],
                        'description': 'تسجيل الدخول والحماية'
                    },
                    'routing': {
                        'name': 'نظام التوجيه والـ APIs',
                        'files': ['routes.py'],
                        'description': 'نقاط النهاية والمسارات'
                    },
                    'seeding': {
                        'name': 'نظام البيانات التجريبية',
                        'files': ['seed_data.py'],
                        'description': 'إضافة بيانات للاختبار'
                    }
                }
            },
            'frontend': {
                'name': 'نظام Frontend (الواجهة)',
                'description': 'الواجهة الأمامية والصفحات المرئية',
                'files': ['index.html', 'gallery.html', 'login.html', 'signup.html'],
                'subsystems': {
                    'static_pages': {
                        'name': 'الصفحات الثابتة',
                        'files': ['*.html'],
                        'description': 'صفحات HTML المستنسخة'
                    },
                    'templates': {
                        'name': 'قوالب Jinja2',
                        'files': ['templates/'],
                        'description': 'قوالب ديناميكية'
                    },
                    'javascript': {
                        'name': 'نظام JavaScript',
                        'files': ['static/js/'],
                        'description': 'الوظائف التفاعلية'
                    },
                    'styles': {
                        'name': 'نظام التنسيقات',
                        'files': ['static/css/'],
                        'description': 'ملفات CSS'
                    }
                }
            },
            'dynamic_loading': {
                'name': 'نظام التحميل الديناميكي',
                'description': 'ربط الصفحات الثابتة بالـ Backend',
                'files': ['static/js/dynamic-content.js', 'convert_static_to_dynamic.py'],
                'subsystems': {
                    'content_loader': {
                        'name': 'محمل المحتوى',
                        'files': ['static/js/dynamic-content.js'],
                        'description': 'تحميل البيانات من APIs'
                    },
                    'converter': {
                        'name': 'محول الصفحات',
                        'files': ['convert_static_to_dynamic.py'],
                        'description': 'تحويل الصفحات الثابتة'
                    }
                }
            },
            'utilities': {
                'name': 'الأدوات المساعدة',
                'description': 'سكربتات وأدوات إضافية',
                'files': ['check_systems.py', 'download_images.py'],
                'subsystems': {
                    'analysis': {
                        'name': 'أدوات التحليل',
                        'files': ['check_systems.py'],
                        'description': 'فحص وتحليل المشروع'
                    },
                    'downloads': {
                        'name': 'أدوات التنزيل',
                        'files': ['download_images.py', 'download_all_assets.py'],
                        'description': 'تنزيل الموارد'
                    }
                }
            }
        }
    
    def create_system_docs(self, system_key, system_info, parent_path=''):
        """إنشاء توثيق لنظام معين"""
        system_path = self.base_docs_dir / parent_path / system_key
        system_path.mkdir(parents=True, exist_ok=True)
        
        # إنشاء README.md للنظام
        readme_content = self._generate_system_readme(system_key, system_info)
        with open(system_path / 'README.md', 'w', encoding='utf-8') as f:
            f.write(readme_content)
        
        # إنشاء ملف الهيكل
        structure_content = self._generate_structure_doc(system_info)
        with open(system_path / 'STRUCTURE.md', 'w', encoding='utf-8') as f:
            f.write(structure_content)
        
        # إنشاء ملف المسارات
        routes_content = self._generate_routes_doc(system_key, system_info)
        with open(system_path / 'ROUTES.md', 'w', encoding='utf-8') as f:
            f.write(routes_content)
        
        # إنشاء ملف التكامل
        integration_content = self._generate_integration_doc(system_key, system_info)
        with open(system_path / 'INTEGRATION.md', 'w', encoding='utf-8') as f:
            f.write(integration_content)
        
        # إنشاء ملف الدور
        role_content = self._generate_role_doc(system_key, system_info)
        with open(system_path / 'ROLE.md', 'w', encoding='utf-8') as f:
            f.write(role_content)
        
        # معالجة الأنظمة الفرعية
        if 'subsystems' in system_info:
            for subsys_key, subsys_info in system_info['subsystems'].items():
                subsys_path = system_path / subsys_key
                subsys_path.mkdir(parents=True, exist_ok=True)
                
                subsys_readme = self._generate_subsystem_readme(subsys_key, subsys_info, system_key)
                with open(subsys_path / 'README.md', 'w', encoding='utf-8') as f:
                    f.write(subsys_readme)
        
        return system_path
    
    def _generate_system_readme(self, system_key, system_info):
        """توليد ملف README.md الرئيسي للنظام"""
        content = f"""# {system_info['name']}

## 📋 الوصف
{system_info['description']}

## 📁 الملفات الرئيسية
"""
        for file in system_info.get('files', []):
            content += f"- `{file}`\n"
        
        content += f"""
## 🕒 تاريخ التوثيق
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 📖 محتويات التوثيق
- [الهيكل](STRUCTURE.md) - بنية النظام والملفات
- [المسارات](ROUTES.md) - نقاط النهاية والمسارات
- [التكامل](INTEGRATION.md) - كيفية التكامل مع الأنظمة الأخرى
- [الدور](ROLE.md) - دور النظام في المشروع

"""
        
        if 'subsystems' in system_info:
            content += "## 🔧 الأنظمة الفرعية\n\n"
            for subsys_key, subsys_info in system_info['subsystems'].items():
                content += f"### [{subsys_info['name']}]({subsys_key}/README.md)\n"
                content += f"{subsys_info['description']}\n\n"
        
        return content
    
    def _generate_structure_doc(self, system_info):
        """توليد ملف الهيكل"""
        content = f"""# 📐 هيكل النظام

## البنية العامة

"""
        if 'files' in system_info:
            content += "```\n"
            for file in system_info['files']:
                content += f"{file}\n"
            content += "```\n\n"
        
        content += """## المكونات الرئيسية

### الملفات
"""
        for file in system_info.get('files', []):
            content += f"""
#### `{file}`
- **الوظيفة**: [وصف الملف]
- **التبعيات**: [الملفات المرتبطة]
- **الاستخدام**: [كيفية الاستخدام]
"""
        
        return content
    
    def _generate_routes_doc(self, system_key, system_info):
        """توليد ملف المسارات"""
        content = f"""# 🛣️ المسارات والـ APIs

## نقاط النهاية (Endpoints)

"""
        
        if system_key == 'backend':
            content += """
### مسارات المصادقة
- `POST /auth/signup` - إنشاء حساب جديد
- `POST /auth/login` - تسجيل الدخول
- `GET /auth/me` - بيانات المستخدم الحالي

### مسارات المشاريع
- `GET /api/projects` - جلب قائمة المشاريع
- `GET /api/projects/<slug>` - جلب مشروع معين
- `POST /api/projects` - إنشاء مشروع جديد (مصادقة مطلوبة)

### مسارات الفئات
- `GET /api/categories` - جلب جميع الفئات

### مسارات النماذج
- `POST /api/forms/submit` - إرسال نموذج
"""
        elif system_key == 'frontend':
            content += """
### الصفحات الرئيسية
- `/` - الصفحة الرئيسية
- `/login` - صفحة تسجيل الدخول
- `/signup` - صفحة إنشاء حساب
- `/dashboard` - لوحة التحكم
- `/gallery` - معرض المشاريع
- `/projects/create` - إنشاء مشروع جديد

### الصفحات الثابتة
- `/<path>.html` - الصفحات المستنسخة (140 صفحة)
"""
        
        content += """
## معاملات الطلبات (Query Parameters)

| المعامل | الوصف | مثال |
|---------|-------|------|
| `page` | رقم الصفحة | `?page=1` |
| `per_page` | عدد العناصر | `?per_page=12` |
| `category` | الفئة | `?category=education` |
| `featured` | المشاريع المميزة | `?featured=true` |
"""
        
        return content
    
    def _generate_integration_doc(self, system_key, system_info):
        """توليد ملف التكامل"""
        content = f"""# 🔗 التكامل مع الأنظمة الأخرى

## كيفية التكامل

"""
        
        if system_key == 'backend':
            content += """
### التكامل مع Frontend
يوفر Backend مجموعة من الـ APIs التي يستخدمها Frontend:

```javascript
// مثال: جلب المشاريع
const response = await fetch('/api/projects?featured=true');
const data = await response.json();
```

### التكامل مع قاعدة البيانات
يستخدم SQLAlchemy للتواصل مع قاعدة البيانات:

```python
from models import db, Project
projects = Project.query.filter_by(is_published=True).all()
```

### التكامل مع نظام المصادقة
يستخدم JWT للمصادقة:

```python
from flask_jwt_extended import jwt_required
@jwt_required()
def protected_route():
    # ...
```
"""
        elif system_key == 'frontend':
            content += """
### التكامل مع Backend APIs
يستخدم Frontend سكربت `dynamic-content.js` للتواصل مع Backend:

```javascript
// تحميل المشاريع المميزة
ReplitDynamic.loadFeaturedProjects('[data-featured-projects]');
```

### التكامل مع الصفحات الثابتة
السكربت الديناميكي محقون في جميع الصفحات الثابتة:

```html
<script src="/static/js/dynamic-content.js"></script>
```
"""
        elif system_key == 'dynamic_loading':
            content += """
### التكامل بين الصفحات الثابتة والـ Backend
يستخدم علامات البيانات (data attributes):

```html
<div data-featured-projects></div>
<div data-all-projects></div>
<div data-categories></div>
```

### آلية العمل
1. السكربت يكتشف علامات البيانات تلقائياً
2. يقوم بطلب البيانات من الـ API المناسب
3. يعرض البيانات في العنصر المحدد
"""
        
        content += """
## التبعيات (Dependencies)

"""
        
        if system_key == 'backend':
            content += """
- Flask - إطار العمل الرئيسي
- SQLAlchemy - قاعدة البيانات
- Flask-JWT-Extended - المصادقة
- Flask-Bcrypt - تشفير كلمات المرور
- Flask-CORS - السماح بطلبات من مصادر مختلفة
"""
        
        return content
    
    def _generate_role_doc(self, system_key, system_info):
        """توليد ملف الدور"""
        content = f"""# 🎯 دور النظام في المشروع

## الوظيفة الرئيسية

"""
        
        roles = {
            'backend': """
يعتبر Backend العمود الفقري للمشروع، حيث:
- يدير جميع البيانات في قاعدة البيانات
- يوفر APIs للواجهة الأمامية
- يتعامل مع المصادقة والحماية
- يعالج طلبات المستخدمين ويرد عليها

## الأهمية
بدون Backend، لن تتمكن الصفحات من عرض البيانات الديناميكية أو حفظ معلومات المستخدمين.
""",
            'frontend': """
يمثل Frontend الواجهة المرئية للمستخدم، حيث:
- يعرض البيانات بشكل جذاب
- يوفر تجربة مستخدم سلسة
- يتفاعل مع إدخالات المستخدم
- يتواصل مع Backend لجلب وحفظ البيانات

## الأهمية
Frontend هو ما يراه المستخدم النهائي ويتفاعل معه مباشرة.
""",
            'dynamic_loading': """
يعمل كجسر بين الصفحات الثابتة والـ Backend، حيث:
- يحول الصفحات الثابتة إلى ديناميكية
- يحقن البيانات الحية في الصفحات
- يحافظ على التصميم الأصلي
- يوفر تجربة سلسة بدون إعادة بناء الصفحات

## الأهمية
يسمح باستخدام الصفحات المستنسخة مع بيانات حقيقية من قاعدة البيانات.
""",
            'utilities': """
توفر أدوات مساعدة لتسهيل التطوير والصيانة، حيث:
- تحلل بنية المشروع
- تنزل الموارد الخارجية
- تولد التقارير
- تساعد في التوثيق

## الأهمية
تسرع عملية التطوير وتساعد في فهم المشروع بشكل أفضل.
"""
        }
        
        content += roles.get(system_key, "دور النظام في المشروع...")
        
        content += """

## الاعتمادات (المستخدمون لهذا النظام)

"""
        
        if system_key == 'backend':
            content += "- Frontend (يستخدم الـ APIs)\n- نظام التحميل الديناميكي\n"
        elif system_key == 'frontend':
            content += "- المستخدم النهائي\n- نظام التحميل الديناميكي\n"
        
        return content
    
    def _generate_subsystem_readme(self, subsys_key, subsys_info, parent_key):
        """توليد README.md للنظام الفرعي"""
        content = f"""# {subsys_info['name']}

## النظام الأب
[{self.systems[parent_key]['name']}](../README.md)

## 📋 الوصف
{subsys_info['description']}

## 📁 الملفات
"""
        for file in subsys_info.get('files', []):
            content += f"- `{file}`\n"
        
        content += f"""
## 🔧 كيفية العمل

"""
        
        # إضافة تفاصيل خاصة بكل نظام فرعي
        if subsys_key == 'database':
            content += """
### النماذج (Models)
- `User` - نموذج المستخدم
- `Project` - نموذج المشروع
- `Category` - نموذج الفئة
- `FormSubmission` - نموذج النماذج المرسلة

### العلاقات
- User لديه many Projects
- Project ينتمي إلى Category واحدة
- User لديه many FormSubmissions
"""
        elif subsys_key == 'authentication':
            content += """
### آلية العمل
1. المستخدم يرسل email/username وpassword
2. النظام يتحقق من البيانات
3. إذا صحيحة، يُنشئ JWT token
4. المستخدم يستخدم الـ token للطلبات المحمية

### الحماية
- كلمات المرور مشفرة ببcrypt
- JWT tokens محمية وموقتة
- التحقق من الصلاحيات قبل كل عملية
"""
        
        return content
    
    def generate_all_docs(self):
        """توليد جميع الوثائق"""
        print("\n" + "="*60)
        print("📚 بدء توليد التوثيق الشامل")
        print("="*60 + "\n")
        
        # حذف المجلد القديم إذا كان موجوداً
        if self.base_docs_dir.exists():
            import shutil
            shutil.rmtree(self.base_docs_dir)
        
        # إنشاء توثيق لكل نظام
        created_docs = []
        for system_key, system_info in self.systems.items():
            print(f"📝 إنشاء توثيق: {system_info['name']}")
            doc_path = self.create_system_docs(system_key, system_info)
            created_docs.append(doc_path)
            print(f"   ✅ تم الحفظ في: {doc_path}")
        
        # إنشاء ملف index رئيسي
        self._create_main_index()
        
        print("\n" + "="*60)
        print("✅ اكتمل توليد التوثيق!")
        print("="*60)
        print(f"\n📂 الموقع: {self.base_docs_dir.absolute()}")
        print(f"📄 عدد الأنظمة: {len(self.systems)}")
        
        # إحصائيات
        total_subsystems = sum(
            len(s.get('subsystems', {})) for s in self.systems.values()
        )
        print(f"📄 عدد الأنظمة الفرعية: {total_subsystems}")
        
        return created_docs
    
    def _create_main_index(self):
        """إنشاء ملف index رئيسي"""
        content = f"""# 📚 توثيق الأنظمة - Replit Clone Project

## 🎯 نظرة عامة
هذا التوثيق الشامل يغطي جميع أنظمة المشروع، بنيتها، مساراتها، تكاملها، وأدوارها.

## 📅 تاريخ التوليد
{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 🗂️ الأنظمة الرئيسية

"""
        
        for system_key, system_info in self.systems.items():
            content += f"### [{system_info['name']}]({system_key}/README.md)\n"
            content += f"{system_info['description']}\n"
            
            if 'subsystems' in system_info:
                content += f"\n**الأنظمة الفرعية ({len(system_info['subsystems'])}):**\n"
                for subsys_key, subsys_info in system_info['subsystems'].items():
                    content += f"- [{subsys_info['name']}]({system_key}/{subsys_key}/README.md)\n"
            content += "\n"
        
        content += """
## 📖 كيفية استخدام هذا التوثيق

1. **للمطورين الجدد**: ابدأ بقراءة README.md لكل نظام رئيسي
2. **للفهم العميق**: اقرأ ملفات STRUCTURE.md و INTEGRATION.md
3. **للعمل على نظام معين**: اقرأ ROLE.md لفهم دوره في المشروع
4. **للتطوير**: راجع ROUTES.md لمعرفة المسارات المتاحة

## 🔧 الصيانة

هذا التوثيق تم توليده تلقائياً بواسطة `generate_systems_documentation.py`.
لتحديثه، قم بتشغيل:

```bash
python generate_systems_documentation.py
```

## 📊 إحصائيات المشروع

- **عدد الأنظمة الرئيسية**: """ + str(len(self.systems)) + """
- **عدد الأنظمة الفرعية**: """ + str(sum(len(s.get('subsystems', {})) for s in self.systems.values())) + """
- **عدد الصفحات الثابتة**: 112
- **عدد ملفات JavaScript**: 257+
- **عدد ملفات CSS**: 11+
- **عدد الصور**: 265+
"""
        
        with open(self.base_docs_dir / 'README.md', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"   ✅ تم إنشاء الملف الرئيسي: {self.base_docs_dir / 'README.md'}")

if __name__ == '__main__':
    generator = SystemsDocumentationGenerator()
    generator.generate_all_docs()
    
    print("\n🎉 تم إنشاء التوثيق الشامل بنجاح!")
    print("\n📂 يمكنك الآن استعراض التوثيق في:")
    print(f"   {generator.base_docs_dir.absolute()}")
