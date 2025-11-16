# 🔗 التكامل مع الأنظمة الأخرى

## كيفية التكامل


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

## التبعيات (Dependencies)


- Flask - إطار العمل الرئيسي
- SQLAlchemy - قاعدة البيانات
- Flask-JWT-Extended - المصادقة
- Flask-Bcrypt - تشفير كلمات المرور
- Flask-CORS - السماح بطلبات من مصادر مختلفة
