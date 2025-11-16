
import os
import json
from pathlib import Path

def analyze_project():
    """تحليل المشروع وتحديد الأنظمة"""
    
    analysis = {
        "cloned_static_pages": [],
        "backend_systems": [],
        "external_assets": {},
        "custom_code": []
    }
    
    # فحص الصفحات الثابتة
    for html_file in Path('.').glob('*.html'):
        analysis["cloned_static_pages"].append(str(html_file))
    
    for html_file in Path('.').rglob('**/*.html'):
        if 'templates' not in str(html_file):
            analysis["cloned_static_pages"].append(str(html_file))
    
    # فحص الأنظمة الخلفية
    backend_files = ['app.py', 'models.py', 'routes.py', 'auth.py', 'config.py', 'seed_data.py']
    for file in backend_files:
        if os.path.exists(file):
            analysis["backend_systems"].append(file)
    
    # فحص الموارد الخارجية
    external_paths = {
        'js': 'static/js/external/',
        'css': 'static/css/external/',
        'images': 'static/images/bj34pdbp/'
    }
    
    for asset_type, path in external_paths.items():
        if os.path.exists(path):
            count = len(list(Path(path).rglob('*.*')))
            analysis["external_assets"][asset_type] = {
                'path': path,
                'count': count
            }
    
    # الكود المخصص
    custom_files = [
        'static/js/dynamic-content.js',
        'static/js/main.js',
        'static/css/main.css'
    ]
    for file in custom_files:
        if os.path.exists(file):
            analysis["custom_code"].append(file)
    
    # طباعة النتائج
    print("=" * 50)
    print("📊 تحليل الأنظمة والملفات")
    print("=" * 50)
    
    print(f"\n✅ الصفحات الثابتة المستنسخة: {len(analysis['cloned_static_pages'])}")
    print(f"   أمثلة: {analysis['cloned_static_pages'][:5]}")
    
    print(f"\n✅ أنظمة Backend: {len(analysis['backend_systems'])}")
    for sys in analysis['backend_systems']:
        print(f"   - {sys}")
    
    print(f"\n✅ الموارد الخارجية:")
    for asset_type, info in analysis['external_assets'].items():
        print(f"   - {asset_type}: {info['count']} ملف في {info['path']}")
    
    print(f"\n✅ الكود المخصص:")
    for file in analysis['custom_code']:
        print(f"   - {file}")
    
    # حفظ التحليل
    with open('project_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)
    
    print(f"\n💾 تم حفظ التحليل الكامل في: project_analysis.json")
    
    return analysis

if __name__ == '__main__':
    analyze_project()
