#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL || process.env.TOLGEE_API_URL;
const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY || process.env.TOLGEE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_TOLGEE_PROJECT_ID || process.env.TOLGEE_PROJECT_ID;

interface FlatTranslations {
  [key: string]: string;
}

function flattenObject(obj: any, prefix = ''): FlatTranslations {
  const flattened: FlatTranslations = {};
  
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = String(value);
    }
  }
  
  return flattened;
}

function readLocaleFiles(localePath: string): { [namespace: string]: FlatTranslations } {
  const namespaces: { [namespace: string]: FlatTranslations } = {};
  const files = fs.readdirSync(localePath).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const namespace = path.basename(file, '.json');
    const content = JSON.parse(fs.readFileSync(path.join(localePath, file), 'utf-8'));
    namespaces[namespace] = flattenObject(content);
  }
  
  return namespaces;
}

async function uploadKeysWithImportAPI() {
  console.log('\n🚀 رفع الترجمات باستخدام Import API...\n');
  console.log('='.repeat(60));

  if (!apiUrl || !apiKey || !projectId) {
    console.error('❌ متغيرات البيئة غير موجودة');
    process.exit(1);
  }

  console.log('📋 معلومات الاتصال:');
  console.log(`  - API URL: ${apiUrl}`);
  console.log(`  - Project ID: ${projectId}`);
  console.log('='.repeat(60));
  console.log();

  const localesPath = path.join(process.cwd(), 'public', 'locales');
  const languages = ['ar', 'en'];
  
  const allTranslations: { [lang: string]: { [namespace: string]: FlatTranslations } } = {};
  
  console.log('📖 قراءة ملفات الترجمة المحلية...\n');
  
  for (const lang of languages) {
    const langPath = path.join(localesPath, lang);
    if (fs.existsSync(langPath)) {
      allTranslations[lang] = readLocaleFiles(langPath);
      console.log(`   ✅ ${lang}: تم القراءة`);
    }
  }

  console.log();

  const translationsMap = new Map<string, { [lang: string]: string }>();

  for (const lang of languages) {
    for (const namespace in allTranslations[lang]) {
      for (const key in allTranslations[lang][namespace]) {
        const fullKey = `${namespace}.${key}`;
        
        if (!translationsMap.has(fullKey)) {
          translationsMap.set(fullKey, {});
        }
        translationsMap.get(fullKey)![lang] = allTranslations[lang][namespace][key];
      }
    }
  }

  console.log('📊 إحصائيات:');
  console.log(`  - عدد المفاتيح: ${translationsMap.size}`);
  console.log(`  - عدد اللغات: ${languages.length}`);
  console.log();

  const keys = [];
  
  for (const [fullKey, translations] of translationsMap.entries()) {
    keys.push({
      name: fullKey,
      namespace: '',
      translations: translations,
    });
  }

  console.log('='.repeat(60));
  console.log('📤 رفع الترجمات...\n');

  const batchSize = 100;
  let successCount = 0;
  let failedCount = 0;
  let batchNumber = 0;

  for (let i = 0; i < keys.length; i += batchSize) {
    const batch = keys.slice(i, i + batchSize);
    batchNumber++;
    
    console.log(`   📦 Batch ${batchNumber}: رفع ${batch.length} مفتاح مع ترجماتهم...`);
    
    try {
      const response = await fetch(`${apiUrl}/v2/projects/import/keys`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys: batch }),
      });

      if (response.ok) {
        console.log(`      ✅ نجح رفع ${batch.length} مفتاح`);
        successCount += batch.length;
      } else {
        const errorText = await response.text();
        console.error(`      ❌ فشل: ${response.status}`);
        console.error(`      📄 التفاصيل: ${errorText.substring(0, 200)}`);
        failedCount += batch.length;
      }
    } catch (error) {
      console.error(`      ❌ خطأ:`, error);
      failedCount += batch.length;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 النتائج النهائية:');
  console.log('='.repeat(60));
  console.log(`✅ المفاتيح المرفوعة بنجاح: ${successCount}`);
  console.log(`❌ الفشل: ${failedCount}`);
  const total = successCount + failedCount;
  if (total > 0) {
    console.log(`📈 نسبة النجاح: ${((successCount / total) * 100).toFixed(2)}%`);
  }
  console.log(`📊 إجمالي الترجمات: ${successCount * languages.length}`);
  console.log('='.repeat(60));
  console.log('\n✨ اكتملت العملية بنجاح!\n');
}

uploadKeysWithImportAPI();
