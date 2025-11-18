#!/bin/bash

# ==============================================
# 🚀 سكريبت رفع التحديثات للسيرفر الخارجي
# ==============================================
# الاستخدام: ./deploy-to-server.sh
# 
# يقوم هذا السكريبت بـ:
# 1. رفع ملفات المشروع للسيرفر (بدون node_modules)
# 2. تثبيت المكتبات على السيرفر
# 3. بناء التطبيق
# 4. إعادة تشغيل PM2
# ==============================================

set -e  # إيقاف السكريبت عند أي خطأ

# الألوان للرسائل
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # بدون لون

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}🚀 رفع التحديثات للسيرفر${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# التحقق من المتغيرات
if [ -z "$SSH_PASSWORD" ]; then
    echo -e "${RED}❌ خطأ: SSH_PASSWORD غير موجود${NC}"
    echo "يرجى التأكد من أن المتغير موجود في Replit Secrets"
    exit 1
fi

# معلومات الاتصال
SSH_HOST="${SSH_HOST:-93.127.142.144}"
SSH_USER="${SSH_USER:-administrator}"
SERVER_PATH="/srv/rebuild/app"

echo -e "${YELLOW}📡 معلومات الاتصال:${NC}"
echo "  السيرفر: $SSH_HOST"
echo "  المستخدم: $SSH_USER"
echo "  المسار: $SERVER_PATH"
echo ""

# التحقق من وجود sshpass
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}⚙️  تثبيت sshpass...${NC}"
    # في Replit لا نحتاج لتثبيته، عادة موجود
    echo -e "${RED}❌ sshpass غير متوفر${NC}"
    echo "سيتم استخدام طريقة بديلة..."
fi

# إنشاء ملف .deployignore إذا لم يكن موجوداً
if [ ! -f "rebuild/source/.deployignore" ]; then
    echo -e "${YELLOW}📝 إنشاء .deployignore...${NC}"
    cat > rebuild/source/.deployignore << 'EOF'
node_modules/
.next/
.env*
.git/
coverage/
*.log
.DS_Store
.idea/
.vscode/
.deployignore
EOF
    echo -e "${GREEN}✅ .deployignore تم إنشاؤه${NC}"
fi

# الخطوة 1: رفع الملفات
echo ""
echo -e "${YELLOW}📤 الخطوة 1/4: رفع الملفات...${NC}"

if command -v sshpass &> /dev/null; then
    # استخدام sshpass إذا كان متوفراً
    sshpass -p "$SSH_PASSWORD" rsync -avz --delete \
        --exclude-from=rebuild/source/.deployignore \
        rebuild/source/ \
        $SSH_USER@$SSH_HOST:$SERVER_PATH/
else
    # طريقة بديلة: استخدام SSH مع expect (إذا كان متوفراً)
    echo -e "${YELLOW}ℹ️  sshpass غير متوفر، يرجى إدخال كلمة المرور عند الطلب${NC}"
    rsync -avz --delete \
        --exclude-from=rebuild/source/.deployignore \
        rebuild/source/ \
        $SSH_USER@$SSH_HOST:$SERVER_PATH/
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم رفع الملفات بنجاح${NC}"
else
    echo -e "${RED}❌ فشل رفع الملفات${NC}"
    exit 1
fi

# الخطوة 2: تثبيت المكتبات على السيرفر
echo ""
echo -e "${YELLOW}📦 الخطوة 2/4: تثبيت المكتبات على السيرفر...${NC}"

if command -v sshpass &> /dev/null; then
    sshpass -p "$SSH_PASSWORD" ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
cd /srv/rebuild/app
echo "📦 تشغيل npm ci..."
npm ci --production=false
echo "✅ تم تثبيت المكتبات"
ENDSSH
else
    echo -e "${YELLOW}ℹ️  يرجى تشغيل الأوامر التالية على السيرفر يدوياً:${NC}"
    echo "  ssh $SSH_USER@$SSH_HOST"
    echo "  cd $SERVER_PATH"
    echo "  npm ci --production=false"
    echo ""
    read -p "اضغط Enter عند الانتهاء..."
fi

# الخطوة 3: بناء التطبيق
echo ""
echo -e "${YELLOW}🏗️  الخطوة 3/4: بناء التطبيق...${NC}"

if command -v sshpass &> /dev/null; then
    sshpass -p "$SSH_PASSWORD" ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
cd /srv/rebuild/app
echo "🏗️  تشغيل npm run build..."
npm run build
echo "✅ تم البناء بنجاح"
ENDSSH
else
    echo -e "${YELLOW}ℹ️  يرجى تشغيل الأمر التالي على السيرفر:${NC}"
    echo "  npm run build"
    echo ""
    read -p "اضغط Enter عند الانتهاء..."
fi

# الخطوة 4: إعادة تشغيل PM2
echo ""
echo -e "${YELLOW}🔄 الخطوة 4/4: إعادة تشغيل PM2...${NC}"

if command -v sshpass &> /dev/null; then
    sshpass -p "$SSH_PASSWORD" ssh $SSH_USER@$SSH_HOST << 'ENDSSH'
cd /srv/rebuild/app
echo "🔄 إعادة تشغيل rebuild-nextjs..."
pm2 restart rebuild-nextjs
pm2 save
echo "✅ تم إعادة التشغيل بنجاح"
echo ""
echo "📊 حالة PM2:"
pm2 status
ENDSSH
else
    echo -e "${YELLOW}ℹ️  يرجى تشغيل الأمر التالي على السيرفر:${NC}"
    echo "  pm2 restart rebuild-nextjs"
    echo "  pm2 save"
    echo ""
    read -p "اضغط Enter عند الانتهاء..."
fi

# النهاية
echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ تم النشر بنجاح!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}📋 الخطوات التالية:${NC}"
echo "  1. فحص السجلات:"
echo "     ssh $SSH_USER@$SSH_HOST 'pm2 logs rebuild-nextjs --lines 50'"
echo ""
echo "  2. اختبار التطبيق:"
echo "     curl http://$SSH_HOST:3000"
echo ""
echo "  3. فتح المتصفح:"
echo "     http://$SSH_HOST"
echo ""
