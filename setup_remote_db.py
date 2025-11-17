#!/usr/bin/env python3
"""
سكريبت لإنشاء قاعدة بيانات PostgreSQL على السيرفر البعيد
"""
import os
import subprocess
import sys

# قراءة بيانات SSH من المتغيرات البيئية
SSH_HOST = os.environ.get('SSH_HOST')
SSH_PORT = os.environ.get('SSH_PORT', '22')
SSH_USER = os.environ.get('SSH_USER')
SSH_PASSWORD = os.environ.get('SSH_PASSWORD')

# إعدادات قاعدة البيانات الجديدة
DB_NAME = 'saasboiler_db'
DB_USER = 'saasboiler_user'
DB_PASSWORD = 'SaaSBoiler2024SecurePassword!'  # سيتم تخزينها في Secrets لاحقاً

def check_ssh_credentials():
    """التحقق من وجود بيانات SSH"""
    if not all([SSH_HOST, SSH_PORT, SSH_USER, SSH_PASSWORD]):
        print("❌ خطأ: بيانات SSH غير مكتملة في المتغيرات البيئية")
        print(f"SSH_HOST: {'✓' if SSH_HOST else '✗'}")
        print(f"SSH_PORT: {'✓' if SSH_PORT else '✗'}")
        print(f"SSH_USER: {'✓' if SSH_USER else '✗'}")
        print(f"SSH_PASSWORD: {'✓' if SSH_PASSWORD else '✗'}")
        return False
    return True

def create_database():
    """إنشاء قاعدة البيانات على السيرفر البعيد"""
    print("🔗 الاتصال بالسيرفر...")
    
    # أوامر SQL لإنشاء قاعدة البيانات والمستخدم
    sql_commands = f"""
-- إنشاء المستخدم
CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}';

-- إنشاء قاعدة البيانات
CREATE DATABASE {DB_NAME} OWNER {DB_USER};

-- منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};
"""
    
    # تنفيذ الأوامر عبر SSH
    ssh_command = f"""
export PGPASSWORD='{SSH_PASSWORD}' && \
ssh -o StrictHostKeyChecking=no -p {SSH_PORT} {SSH_USER}@{SSH_HOST} \
"sudo -u postgres psql -c \\"CREATE USER {DB_USER} WITH PASSWORD '{DB_PASSWORD}';\\" 2>&1 || echo 'User may exist'; \
sudo -u postgres psql -c \\"CREATE DATABASE {DB_NAME} OWNER {DB_USER};\\" 2>&1 || echo 'DB may exist'; \
sudo -u postgres psql -c \\"GRANT ALL PRIVILEGES ON DATABASE {DB_NAME} TO {DB_USER};\\" "
"""
    
    try:
        # استخدام sshpass للاتصال
        cmd = f"sshpass -p '{SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no -p {SSH_PORT} {SSH_USER}@{SSH_HOST} \"sudo -u postgres psql << 'EOF'\n{sql_commands}\nEOF\""
        
        print(f"📊 إنشاء قاعدة البيانات: {DB_NAME}")
        print(f"👤 إنشاء مستخدم: {DB_USER}")
        
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        print("\n📝 النتيجة:")
        print(result.stdout)
        if result.stderr:
            print("⚠️ تحذيرات/أخطاء:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("\n✅ تم إنشاء قاعدة البيانات بنجاح!")
            return True
        else:
            print(f"\n⚠️ انتهى بكود: {result.returncode}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ انتهت مهلة الاتصال")
        return False
    except Exception as e:
        print(f"❌ خطأ: {e}")
        return False

def print_connection_info():
    """طباعة معلومات الاتصال"""
    print("\n" + "="*60)
    print("📋 معلومات قاعدة البيانات الجديدة:")
    print("="*60)
    print(f"Database Name: {DB_NAME}")
    print(f"Database User: {DB_USER}")
    print(f"Database Password: {DB_PASSWORD}")
    print(f"Database Host: {SSH_HOST}")
    print(f"Database Port: 5432")
    print("\n🔐 أضف هذه المتغيرات في Replit Secrets:")
    print(f"REMOTE_DB_NAME={DB_NAME}")
    print(f"REMOTE_DB_USER={DB_USER}")
    print(f"REMOTE_DB_PASSWORD={DB_PASSWORD}")
    print(f"REMOTE_DB_HOST={SSH_HOST}")
    print(f"REMOTE_DB_PORT=5432")
    print("\n🔗 DATABASE_URL:")
    print(f"postgresql://{DB_USER}:{DB_PASSWORD}@{SSH_HOST}:5432/{DB_NAME}")
    print("="*60)

if __name__ == '__main__':
    print("🚀 بدء إنشاء قاعدة البيانات على السيرفر البعيد...")
    print()
    
    if not check_ssh_credentials():
        sys.exit(1)
    
    if create_database():
        print_connection_info()
        print("\n✅ العملية اكتملت بنجاح!")
    else:
        print("\n❌ فشل إنشاء قاعدة البيانات")
        sys.exit(1)
