import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-CHANGE-ME-IN-PRODUCTION')
    
    # بناء DATABASE_URL من المتغيرات
    REMOTE_DB_HOST = os.environ.get('REMOTE_DB_HOST', '93.127.142.144')
    REMOTE_DB_PORT = os.environ.get('REMOTE_DB_PORT', '5432')
    REMOTE_DB_NAME = os.environ.get('REMOTE_DB_NAME', 'saasboiler_db')
    REMOTE_DB_USER = os.environ.get('REMOTE_DB_USER', 'saasboiler_user')
    REMOTE_DB_PASSWORD = os.environ.get('REMOTE_DB_PASSWORD', 'SaaSBoiler2024SecurePassword!')
    
    # استخدام قاعدة البيانات البعيدة
    SQLALCHEMY_DATABASE_URI = f"postgresql://{REMOTE_DB_USER}:{REMOTE_DB_PASSWORD}@{REMOTE_DB_HOST}:{REMOTE_DB_PORT}/{REMOTE_DB_NAME}"
    print(f"✅ الاتصال بقاعدة البيانات: {REMOTE_DB_HOST}/{REMOTE_DB_NAME}")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 5,
        'max_overflow': 10,
    }
    
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-CHANGE-ME-IN-PRODUCTION')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    BCRYPT_LOG_ROUNDS = 12
    
    CORS_HEADERS = 'Content-Type'
    
    TEMPLATES_AUTO_RELOAD = True
    SEND_FILE_MAX_AGE_DEFAULT = 31536000
