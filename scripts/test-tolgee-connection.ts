#!/usr/bin/env tsx

async function testTolgeeConnection() {
  const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL || process.env.TOLGEE_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY || process.env.TOLGEE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_TOLGEE_PROJECT_ID || process.env.TOLGEE_PROJECT_ID;

  console.log('\n🔧 بدء اختبار الاتصال بـ Tolgee...\n');

  if (!apiUrl || !apiKey) {
    console.error('❌ متغيرات البيئة غير موجودة:');
    if (!apiUrl) console.error('  - NEXT_PUBLIC_TOLGEE_API_URL مفقود');
    if (!apiKey) console.error('  - NEXT_PUBLIC_TOLGEE_API_KEY مفقود');
    process.exit(1);
  }

  console.log('📋 معلومات الاتصال:');
  console.log(`  - API URL: ${apiUrl}`);
  console.log(`  - API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`  - Project ID: ${projectId || 'غير محدد'}`);
  console.log();

  try {
    console.log('🌐 جاري الاتصال بـ Tolgee API...');
    
    const translationsUrl = projectId 
      ? `${apiUrl}/v2/projects/${projectId}/translations/ar`
      : `${apiUrl}/v2/api-keys/current`;
    
    const response = await fetch(translationsUrl, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ الاتصال بـ Tolgee ناجح!\n');
      
      if (projectId) {
        console.log(`📊 تم جلب الترجمات للمشروع ${projectId} بنجاح`);
        console.log(`📝 عدد المفاتيح المتاحة: ${Object.keys(data).length || 'unknown'}`);
      } else {
        console.log('📋 معلومات المفتاح:');
        console.log(JSON.stringify(data, null, 2).substring(0, 500));
      }
      
      console.log('\n✨ جميع الفحوصات نجحت!\n');
      process.exit(0);
    } else {
      const errorText = await response.text();
      console.error(`\n❌ فشل الاتصال:`);
      console.error(`  - Status: ${response.status}`);
      console.error(`  - Response: ${errorText.substring(0, 200)}`);
      console.log('\n💡 نصيحة: تحقق من:');
      console.log('  1. صحة API Key');
      console.log('  2. صلاحيات المفتاح في لوحة تحكم Tolgee');
      console.log('  3. أن Project ID صحيح');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال:');
    console.error(error);
    console.log('\n💡 تحقق من أن السيرفر يعمل وأن الرابط صحيح');
    process.exit(1);
  }
}

testTolgeeConnection();
