# 🚀 دليل نشر التطبيق على السيرفر

## 📋 نظرة عامة

هذا الدليل يشرح خطوات نشر تطبيق Next.js على سيرفر خارجي واستكمال المراحل المتبقية.

---

## 🔧 المتطلبات الأساسية على السيرفر

### 1. Node.js و npm
```bash
# تثبيت nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# تثبيت Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# التحقق من الإصدار
node --version  # يجب أن يكون v20.x.x
npm --version
```

### 2. PM2 لإدارة العمليات
```bash
npm install -g pm2
pm2 startup  # للتشغيل التلقائي عند إعادة التشغيل
```

### 3. إنشاء هيكل المجلدات
```bash
sudo mkdir -p /srv/rebuild/{app,current,shared/logs,shared/uploads}
sudo chown -R $USER:$USER /srv/rebuild
chmod -R 755 /srv/rebuild
```

---

## 📦 خطوات النشر

### المرحلة 1: رفع الملفات إلى السيرفر

#### الطريقة الموصى بها: rsync
```bash
# من بيئة Replit المحلية، قم بتشغيل:
rsync -avz --delete \
  --exclude-from=.deployignore \
  --exclude='.env*' \
  --exclude='node_modules' \
  --exclude='.next' \
  /path/to/rebuild/source/ \
  user@server:/srv/rebuild/app/
```

#### الطريقة البديلة: scp
```bash
# ضغط المشروع أولاً
tar -czf rebuild-source.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env*' \
  --exclude='coverage' \
  rebuild/source/

# رفع الأرشيف
scp rebuild-source.tar.gz user@server:/srv/rebuild/

# على السيرفر، فك الضغط
ssh user@server
cd /srv/rebuild/app
tar -xzf ../rebuild-source.tar.gz --strip-components=2
```

### المرحلة 2: إعداد البيئة

#### 1. إنشاء ملف البيئة
```bash
cd /srv/rebuild/app
cp .env.example .env.production

# تحرير الملف وإضافة القيم الحقيقية
nano .env.production
```

#### 2. إعداد متغيرات البيئة الحساسة
قم بنسخ القيم من `.env.example` وملء:

**Firebase** (6 متغيرات):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin** (للـ server-side):
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY` (احرص على الاحتفاظ بـ `\n` للأسطر الجديدة)

**Analytics**:
- `NEXT_PUBLIC_GTM_ID` (GTM-M3H3PQBG أو القيمة الخاصة بك)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_AMPLITUDE_API_KEY`
- `NEXT_PUBLIC_SEGMENT_WRITE_KEY`

**Datadog**:
- `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN`
- `NEXT_PUBLIC_DATADOG_APPLICATION_ID`

**Sanity CMS**:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01`
- `SANITY_API_READ_TOKEN`

**Stripe** (المرحلة 6):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**LaunchDarkly** (المرحلة 7):
- `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_SIDE_ID`
- `LAUNCHDARKLY_SDK_KEY`

**إعدادات عامة**:
- `NODE_ENV=production`
- `PORT=3000`
- `NEXT_PUBLIC_BASE_URL=https://your-domain.com`

#### 3. تثبيت المكتبات
```bash
cd /srv/rebuild/app

# تنظيف أي بقايا
rm -rf node_modules .next

# تثبيت المكتبات (production only)
npm ci --production=false

# أو للتطوير الكامل
npm install
```

### المرحلة 3: بناء التطبيق

```bash
# تحميل متغيرات البيئة
export $(cat .env.production | xargs)

# بناء التطبيق
npm run build

# التحقق من نجاح البناء
ls -la .next/
```

### المرحلة 4: تشغيل التطبيق

#### استخدام PM2 (موصى به)

```bash
# إنشاء ملف ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'rebuild-nextjs',
    script: 'npm',
    args: 'start',
    cwd: '/srv/rebuild/app',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production',
    error_file: '/srv/rebuild/shared/logs/err.log',
    out_file: '/srv/rebuild/shared/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
}
EOF

# تشغيل التطبيق
pm2 start ecosystem.config.js

# حفظ التكوين للتشغيل التلقائي
pm2 save

# التحقق من الحالة
pm2 status
pm2 logs rebuild-nextjs --lines 50
```

#### التشغيل المباشر (للاختبار)

```bash
# تحميل المتغيرات
export $(cat .env.production | xargs)

# تشغيل التطبيق
npm start

# أو على بورت مخصص
PORT=3000 npm start
```

### المرحلة 5: إعداد Nginx (Reverse Proxy)

```bash
# تثبيت Nginx
sudo apt update
sudo apt install nginx -y

# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/rebuild
```

**محتوى ملف Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration (استخدم Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images caching
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

**تفعيل التكوين:**
```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/rebuild /etc/nginx/sites-enabled/

# اختبار التكوين
sudo nginx -t

# إعادة تشغيل Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### المرحلة 6: إعداد SSL (Let's Encrypt)

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx -y

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# التحقق من التجديد التلقائي
sudo certbot renew --dry-run
```

---

## 🔍 التحقق من التطبيق

### 1. اختبار الاتصال
```bash
# من السيرفر
curl http://localhost:3000

# من الإنترنت
curl https://your-domain.com
```

### 2. فحص السجلات
```bash
# سجلات PM2
pm2 logs rebuild-nextjs --lines 100

# سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. اختبار المسارات الأساسية
- ✅ الصفحة الرئيسية: `https://your-domain.com/`
- ✅ صفحة تسجيل الدخول: `https://your-domain.com/login`
- ✅ صفحة التسجيل: `https://your-domain.com/signup`
- ✅ GraphQL API: `https://your-domain.com/api/graphql`
- ✅ الـ Gallery: `https://your-domain.com/gallery`

---

## 🛠️ المهام المتبقية (على السيرفر)

### المرحلة 5: Analytics والتتبع ✅
- [ ] إصلاح GTM ready gate
- [ ] إضافة retry mechanism
- [ ] إعادة هيكلة Segment/Amplitude clients

### المرحلة 6: المدفوعات - Stripe
- [ ] تفعيل Stripe test account
- [ ] إنشاء webhooks endpoint
- [ ] اختبار checkout flow

### المرحلة 7: المراقبة
- [ ] تفعيل Datadog RUM
- [ ] إعداد LaunchDarkly feature flags

### المرحلة 8: مطابقة الواجهات
- [ ] مقارنة بصرية مع التصميم الأصلي
- [ ] اختبار responsive design

---

## 📊 الصيانة والمراقبة

### أوامر PM2 المفيدة
```bash
# إعادة تشغيل التطبيق
pm2 restart rebuild-nextjs

# إيقاف التطبيق
pm2 stop rebuild-nextjs

# حذف التطبيق
pm2 delete rebuild-nextjs

# عرض معلومات مفصلة
pm2 show rebuild-nextjs

# مراقبة الموارد
pm2 monit
```

### النسخ الاحتياطي
```bash
# نسخ احتياطي للملفات
tar -czf /backup/rebuild-$(date +%Y%m%d).tar.gz /srv/rebuild/app

# نسخ احتياطي لقاعدة البيانات (إذا كانت محلية)
# pg_dump database_name > /backup/db-$(date +%Y%m%d).sql
```

### التحديثات
```bash
cd /srv/rebuild/app

# سحب التحديثات
git pull  # إذا كنت تستخدم git

# أو رفع ملفات جديدة عبر rsync
# rsync -avz --delete ...

# إعادة البناء
npm install
npm run build

# إعادة تشغيل PM2
pm2 restart rebuild-nextjs
```

---

## 🚨 استكشاف الأخطاء

### التطبيق لا يعمل
```bash
# فحص السجلات
pm2 logs rebuild-nextjs

# التحقق من البورت
netstat -tulpn | grep 3000

# فحص العمليات
ps aux | grep node
```

### مشاكل البناء
```bash
# حذف cache
rm -rf .next node_modules
npm install
npm run build
```

### مشاكل الذاكرة
```bash
# زيادة حد الذاكرة لـ Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📞 الدعم

للمساعدة والدعم، راجع:
- **الخطة الرئيسية**: `/rebuild/planning/rebuild_master_plan.md`
- **دليل البيئة**: `/rebuild/planning/ENV_SETUP_GUIDE.md`
- **دليل Firebase**: `/rebuild/docs/FIREBASE_SETUP_GUIDE.md`

---

**آخر تحديث**: 17 نوفمبر 2025
