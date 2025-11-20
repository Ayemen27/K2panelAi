#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';

const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL || process.env.TOLGEE_API_URL;
const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY || process.env.TOLGEE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_TOLGEE_PROJECT_ID || process.env.TOLGEE_PROJECT_ID;

interface TolgeeKey {
  id: number;
  name: string;
}

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

async function getAllKeysFromTolgee(): Promise<Map<string, number>> {
  const keyMap = new Map<string, number>();
  let page = 0;
  let hasMore = true;
  
  console.log('📥 جلب المفاتيح من Tolgee...\n');
  
  while (hasMore) {
    try {
      const response = await fetch(`${apiUrl}/v2/projects/${projectId}/keys?page=${page}&size=1000`, {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey!,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`❌ فشل جلب المفاتيح: ${response.status}`);
        break;
      }
      
      const data = await response.json();
      const keys = data._embedded?.keys || [];
      
      for (const key of keys) {
        keyMap.set(key.name, key.id);
      }
      
      console.log(`   ✅ صفحة ${page + 1}: ${keys.length} مفتاح`);
      
      hasMore = data.page && data.page.number < data.page.totalPages - 1;
      page++;
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('❌ خطأ في جلب المفاتيح:', error);
      hasMore = false;
    }
  }
  
  console.log(`\n✅ تم جلب ${keyMap.size} مفتاح بنجاح\n`);
  return keyMap;
}

async function uploadTranslationsBatch(
  translations: Array<{ keyId: number; languageTag: string; text: string }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${apiUrl}/v2/projects/${projectId}/translations`, {
      method: 'PUT',
      headers: {
        'X-API-Key': apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ translations }),
    });

    if (response.ok || response.status === 200) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: `${response.status}: ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function uploadTranslationsFinal() {
  console.log('\n🚀 بدء رفع الترجمات النهائي إلى Tolgee...\n');
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

  const keyMap = await getAllKeysFromTolgee();
  
  if (keyMap.size === 0) {
    console.error('❌ لم يتم العثور على أي مفاتيح في Tolgee');
    process.exit(1);
  }

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
  console.log(`  - عدد المفاتيح في Tolgee: ${keyMap.size}`);
  console.log(`  - عدد المفاتيح المحلية: ${translationsMap.size}`);
  console.log(`  - عدد اللغات: ${languages.length}`);
  console.log();

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let batchNumber = 0;

  console.log('='.repeat(60));
  console.log('📤 رفع الترجمات (Batch Mode)...\n');

  const batchSize = 50;
  const translationsBatch: Array<{ keyId: number; languageTag: string; text: string }> = [];

  for (const [fullKey, translations] of translationsMap.entries()) {
    const keyId = keyMap.get(fullKey);
    
    if (!keyId) {
      console.log(`   ⚠️  تخطي: ${fullKey} (غير موجود في Tolgee)`);
      skippedCount++;
      continue;
    }
    
    for (const lang of languages) {
      if (translations[lang]) {
        translationsBatch.push({
          keyId: keyId,
          languageTag: lang,
          text: translations[lang],
        });
      }
    }

    if (translationsBatch.length >= batchSize) {
      batchNumber++;
      console.log(`   📦 Batch ${batchNumber}: رفع ${translationsBatch.length} ترجمة...`);
      
      const result = await uploadTranslationsBatch(translationsBatch);
      
      if (result.success) {
        console.log(`      ✅ نجح رفع ${translationsBatch.length} ترجمة`);
        successCount += translationsBatch.length;
      } else {
        console.error(`      ❌ فشل: ${result.error}`);
        failedCount += translationsBatch.length;
      }
      
      translationsBatch.length = 0;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  if (translationsBatch.length > 0) {
    batchNumber++;
    console.log(`   📦 Batch ${batchNumber} (Final): رفع ${translationsBatch.length} ترجمة...`);
    
    const result = await uploadTranslationsBatch(translationsBatch);
    
    if (result.success) {
      console.log(`      ✅ نجح رفع ${translationsBatch.length} ترجمة`);
      successCount += translationsBatch.length;
    } else {
      console.error(`      ❌ فشل: ${result.error}`);
      failedCount += translationsBatch.length;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 النتائج النهائية:');
  console.log('='.repeat(60));
  console.log(`✅ الترجمات المرفوعة بنجاح: ${successCount}`);
  console.log(`❌ الفشل: ${failedCount}`);
  if (skippedCount > 0) {
    console.log(`⚠️  المتخطاة: ${skippedCount}`);
  }
  const total = successCount + failedCount;
  if (total > 0) {
    console.log(`📈 نسبة النجاح: ${((successCount / total) * 100).toFixed(2)}%`);
  }
  console.log('='.repeat(60));
  console.log('\n✨ اكتملت العملية بنجاح!\n');
}

uploadTranslationsFinal();
