
import os
import re
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote

def download_image(url, save_path):
    """تحميل صورة من URL وحفظها"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # إنشاء المجلد إذا لم يكن موجوداً
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"✓ تم تحميل: {save_path}")
        return True
    except Exception as e:
        print(f"✗ خطأ في تحميل {url}: {e}")
        return False

def extract_image_urls(html_content):
    """استخراج روابط الصور من HTML"""
    # البحث عن روابط cdnimg.replit.com
    pattern = r'https://cdnimg\.replit\.com/images/[^"\'>\s]+'
    urls = re.findall(pattern, html_content)
    return list(set(urls))  # إزالة التكرار

def get_local_path(url):
    """تحويل URL إلى مسار محلي"""
    # استخراج المسار بعد /images/
    match = re.search(r'/images/(.+)', url)
    if match:
        image_path = match.group(1)
        # إزالة معاملات الاستعلام
        image_path = image_path.split('?')[0]
        return f"static/images/{image_path}"
    return None

def scan_html_files(directory='.'):
    """فحص ملفات HTML لاستخراج روابط الصور"""
    all_urls = set()
    
    for root, dirs, files in os.walk(directory):
        # تجاهل بعض المجلدات
        dirs[:] = [d for d in dirs if d not in ['instance', '__pycache__', '.git', 'node_modules']]
        
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        urls = extract_image_urls(content)
                        all_urls.update(urls)
                except Exception as e:
                    print(f"خطأ في قراءة {file_path}: {e}")
    
    return all_urls

def main():
    print("جاري فحص ملفات HTML...")
    image_urls = scan_html_files()
    
    print(f"\nتم العثور على {len(image_urls)} صورة فريدة")
    
    if not image_urls:
        print("لم يتم العثور على صور للتحميل")
        return
    
    print("\nجاري التحميل...")
    downloaded = 0
    failed = 0
    
    for url in image_urls:
        local_path = get_local_path(url)
        if local_path:
            if download_image(url, local_path):
                downloaded += 1
            else:
                failed += 1
    
    print(f"\n{'='*50}")
    print(f"النتائج:")
    print(f"✓ تم التحميل: {downloaded}")
    print(f"✗ فشل: {failed}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
