#!/usr/bin/env node
/**
 * 🔧 سكريبت تحديث NEXTAUTH_URL تلقائياً
 * 
 * يكتشف البيئة الحالية ويحدث NEXTAUTH_URL في .env.local:
 * - إذا كانت بيئة السيرفر → استخدام https://k2panel.online/
 * - إذا كانت بيئة Replit → استخدام REPLIT_DOMAINS
 * 
 * ⚠️ آمن 100%: يحدث السطر المحدد فقط ولا يحذف أي متغيرات أخرى
 * 
 * المتغيرات المدعومة:
 * - NEXTAUTH_URL_OVERRIDE: لتجاوز الكشف التلقائي
 * - SKIP_ENV_BACKUP: تعطيل النسخة الاحتياطية (قيمة: true)
 * - SERVER_ENV=production: للإشارة إلى بيئة السيرفر
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '..', '.env.local');
const SERVER_URL = 'https://k2panel.online';

/**
 * قراءة PORT من .env.local
 */
function readPortFromEnv() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
      const portMatch = envContent.match(/^PORT=(.+)$/m);
      if (portMatch) {
        return portMatch[1].trim();
      }
    }
  } catch (error) {
    console.warn('⚠️ تحذير: لم يتم قراءة PORT من .env.local');
  }
  return '5000'; // القيمة الافتراضية
}

/**
 * التحقق من صحة URL
 */
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.error(`❌ URL غير صحيح: ${url}`);
      console.error(`   البروتوكول يجب أن يكون http أو https`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`❌ URL غير صحيح: ${url}`);
    console.error(`   ${error.message}`);
    return false;
  }
}

/**
 * كشف البيئة الحالية
 */
function detectEnvironment() {
  // 1. إذا كان هناك NEXTAUTH_URL_OVERRIDE → استخدامه مباشرة
  if (process.env.NEXTAUTH_URL_OVERRIDE) {
    const url = process.env.NEXTAUTH_URL_OVERRIDE;
    if (!validateUrl(url)) {
      console.error('⚠️ NEXTAUTH_URL_OVERRIDE غير صحيح، سيتم استخدام الكشف التلقائي');
    } else {
      return {
        type: 'override',
        url: url
      };
    }
  }
  
  // 2. إذا كان REPLIT_DOMAINS موجود → بيئة Replit
  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    return {
      type: 'replit',
      url: `https://${domain}`
    };
  }
  
  // 3. إذا كان SERVER_ENV=production → بيئة السيرفر
  if (process.env.SERVER_ENV === 'production') {
    return {
      type: 'server',
      url: SERVER_URL
    };
  }
  
  // 4. تحقق من hostname
  const hostname = process.env.HOSTNAME || '';
  if (hostname.includes('k2panel') || hostname.includes('production')) {
    return {
      type: 'server',
      url: SERVER_URL
    };
  }
  
  // 5. Fallback: تحذير للمستخدم
  console.warn('⚠️ تحذير: لم يتم كشف البيئة بوضوح!');
  console.warn('   سيتم استخدام localhost. للإنتاج، استخدم:');
  console.warn('   - SERVER_ENV=production للسيرفر');
  console.warn('   - NEXTAUTH_URL_OVERRIDE=https://your-domain.com');
  
  const port = readPortFromEnv();
  return {
    type: 'local',
    url: `http://localhost:${port}`
  };
}

/**
 * إنشاء نسخة احتياطية من .env.local (اختياري)
 */
function createBackup() {
  // تخطي النسخة الاحتياطية إذا طلب المستخدم
  if (process.env.SKIP_ENV_BACKUP === 'true') {
    console.log('⏭️ تخطي النسخة الاحتياطية (SKIP_ENV_BACKUP=true)');
    return true;
  }
  
  try {
    if (!fs.existsSync(ENV_FILE)) {
      return true; // لا يوجد ملف للنسخ
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFile = `${ENV_FILE}.backup.${timestamp}`;
    
    // فقط إنشاء نسخة واحدة في اليوم
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(ENV_FILE, backupFile);
      console.log(`💾 تم إنشاء نسخة احتياطية: ${path.basename(backupFile)}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ خطأ في إنشاء النسخة الاحتياطية:', error.message);
    return false;
  }
}

/**
 * تحديث NEXTAUTH_URL في .env.local - يحدث السطر المحدد فقط!
 */
function updateEnvFile(nextAuthUrl) {
  // التحقق من صحة URL قبل الكتابة
  if (!validateUrl(nextAuthUrl)) {
    return false;
  }
  
  try {
    let content = '';
    let lines = [];
    
    // قراءة الملف الحالي
    if (fs.existsSync(ENV_FILE)) {
      content = fs.readFileSync(ENV_FILE, 'utf8');
      lines = content.split('\n');
    } else {
      console.log('⚠️ ملف .env.local غير موجود، سيتم إنشاؤه');
    }
    
    let found = false;
    let needsUpdate = false;
    
    // البحث عن NEXTAUTH_URL وتحديثه فقط
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // إذا وجدنا السطر الذي يحتوي على NEXTAUTH_URL
      if (line.startsWith('NEXTAUTH_URL=') || line.startsWith('# NEXTAUTH_URL=')) {
        const currentValue = line.replace('# ', '').split('=')[1] || '';
        
        // تحديث السطر فقط إذا كانت القيمة مختلفة
        if (currentValue !== nextAuthUrl) {
          lines[i] = `NEXTAUTH_URL=${nextAuthUrl}`;
          needsUpdate = true;
          console.log(`✅ تم تحديث NEXTAUTH_URL`);
          console.log(`   من: ${currentValue || '(فارغ)'}`);
          console.log(`   إلى: ${nextAuthUrl}`);
        } else {
          console.log(`✅ NEXTAUTH_URL محدث بالفعل: ${nextAuthUrl}`);
        }
        found = true;
        break;
      }
    }
    
    // إذا لم نجد NEXTAUTH_URL، نضيفه في النهاية
    if (!found) {
      if (lines.length > 0 && lines[lines.length - 1] !== '') {
        lines.push(''); // سطر فارغ
      }
      lines.push('# ============================================');
      lines.push('# 🔐 NextAuth Configuration (Auto-Updated)');
      lines.push('# ============================================');
      lines.push('# يتم تحديث NEXTAUTH_URL تلقائياً حسب البيئة');
      lines.push(`NEXTAUTH_URL=${nextAuthUrl}`);
      lines.push('');
      needsUpdate = true;
      console.log(`✅ تمت إضافة NEXTAUTH_URL=${nextAuthUrl}`);
    }
    
    // كتابة التغييرات فقط إذا كان هناك تحديث
    if (needsUpdate) {
      fs.writeFileSync(ENV_FILE, lines.join('\n'), 'utf8');
      console.log('💾 تم حفظ التغييرات في .env.local');
    }
    
    return true;
  } catch (error) {
    console.error('❌ خطأ في تحديث .env.local:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('\n🔧 بدء تحديث NEXTAUTH_URL...\n');
  
  // إنشاء نسخة احتياطية (اختياري)
  if (!createBackup()) {
    console.error('❌ فشل إنشاء النسخة الاحتياطية\n');
    // نكمل حتى لو فشلت النسخة الاحتياطية
  }
  
  const env = detectEnvironment();
  
  console.log(`📍 البيئة المكتشفة: ${env.type}`);
  console.log(`🌐 NEXTAUTH_URL: ${env.url}\n`);
  
  const success = updateEnvFile(env.url);
  
  if (success) {
    console.log('✅ تم التحديث بنجاح!\n');
    process.exit(0);
  } else {
    console.error('❌ فشل التحديث!\n');
    process.exit(1);
  }
}

// تشغيل السكريبت
main();
