#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import pool from '../src/lib/db/postgres';

interface TranslationStats {
  language: string;
  namespace: string;
  totalKeys: number;
  translatedKeys: number;
  emptyKeys: number;
  errorKeys: number;
}

async function syncTranslationStats() {
  console.log('\n📊 مسح الترجمات المحلية وتحديث قاعدة البيانات...\n');

  const localesDir = path.join(process.cwd(), 'public', 'locales');
  const languages = ['ar', 'en'];
  const namespaces = ['admin', 'auth', 'cms', 'common', 'dashboard', 'errors', 'layout', 'marketing', 'validation'];
  
  const allStats: TranslationStats[] = [];

  try {
    // مسح كل لغة و namespace
    for (const language of languages) {
      console.log(`\n🌐 مسح ${language === 'ar' ? 'العربية' : 'English'} (${language}):`);
      
      for (const namespace of namespaces) {
        const filePath = path.join(localesDir, language, `${namespace}.json`);
        
        if (!fs.existsSync(filePath)) {
          console.log(`   ⏭️  ${namespace}: ملف غير موجود`);
          continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const translations = JSON.parse(content);
        
        const stats = analyzeTranslations(translations, language, namespace);
        allStats.push(stats);
        
        console.log(`   ✅ ${namespace}: ${stats.totalKeys} مفاتيح (${stats.translatedKeys} مترجمة, ${stats.emptyKeys} فارغة)`);
      }
    }

    // حفظ الإحصائيات في قاعدة البيانات
    console.log('\n💾 حفظ الإحصائيات في قاعدة البيانات...');
    
    const client = await pool.connect();
    
    try {
      for (const stats of allStats) {
        await client.query(`
          INSERT INTO translation_keys_stats 
            (language, namespace, total_keys, translated_keys, empty_keys, error_keys, last_sync_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
          ON CONFLICT (language, namespace) 
          DO UPDATE SET 
            total_keys = $3,
            translated_keys = $4,
            empty_keys = $5,
            error_keys = $6,
            last_sync_at = NOW(),
            updated_at = NOW()
        `, [
          stats.language,
          stats.namespace,
          stats.totalKeys,
          stats.translatedKeys,
          stats.emptyKeys,
          stats.errorKeys
        ]);
      }
      
      console.log(`✅ تم حفظ ${allStats.length} إحصائية في قاعدة البيانات`);
      
      // عرض الملخص
      console.log('\n📈 ملخص الإحصائيات:');
      const totalKeys = allStats.reduce((sum, s) => sum + s.totalKeys, 0);
      const totalTranslated = allStats.reduce((sum, s) => sum + s.translatedKeys, 0);
      const totalEmpty = allStats.reduce((sum, s) => sum + s.emptyKeys, 0);
      
      console.log(`   - إجمالي المفاتيح: ${totalKeys}`);
      console.log(`   - مفاتيح مترجمة: ${totalTranslated}`);
      console.log(`   - مفاتيح فارغة: ${totalEmpty}`);
      console.log(`   - نسبة الترجمة: ${((totalTranslated / totalKeys) * 100).toFixed(1)}%`);
      
    } finally {
      client.release();
    }

    console.log('\n✨ اكتمل المسح والتحديث!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ خطأ:', error);
    process.exit(1);
  }
}

function analyzeTranslations(obj: any, language: string, namespace: string, prefix: string = ''): TranslationStats {
  const stats: TranslationStats = {
    language,
    namespace,
    totalKeys: 0,
    translatedKeys: 0,
    emptyKeys: 0,
    errorKeys: 0,
  };

  function traverse(current: any, path: string = '') {
    if (typeof current === 'string') {
      stats.totalKeys++;
      if (current.trim() === '') {
        stats.emptyKeys++;
      } else {
        stats.translatedKeys++;
      }
    } else if (typeof current === 'object' && current !== null) {
      for (const key in current) {
        const newPath = path ? `${path}.${key}` : key;
        traverse(current[key], newPath);
      }
    }
  }

  traverse(obj);
  return stats;
}

syncTranslationStats();
