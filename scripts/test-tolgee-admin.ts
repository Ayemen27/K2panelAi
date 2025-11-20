#!/usr/bin/env tsx

async function testTolgeeAdmin() {
  const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL || process.env.TOLGEE_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY || process.env.TOLGEE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_TOLGEE_PROJECT_ID || process.env.TOLGEE_PROJECT_ID;

  console.log('\n🔧 بدء اختبار بيانات المسؤول في Tolgee...\n');

  if (!apiUrl || !apiKey) {
    console.error('❌ متغيرات البيئة غير موجودة');
    process.exit(1);
  }

  console.log('📋 معلومات الاتصال:');
  console.log(`  - API URL: ${apiUrl}`);
  console.log(`  - API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`  - Project ID: ${projectId || 'غير محدد'}`);
  console.log();

  try {
    console.log('🔍 1. جلب معلومات API Key الحالي...');
    const apiKeyResponse = await fetch(`${apiUrl}/v2/api-keys/current`, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (apiKeyResponse.ok) {
      const apiKeyData = await apiKeyResponse.json();
      console.log('✅ معلومات API Key:');
      console.log(JSON.stringify(apiKeyData, null, 2));
      console.log();
    } else {
      console.error(`❌ فشل جلب معلومات API Key: ${apiKeyResponse.status}`);
    }

    if (projectId) {
      console.log(`🔍 2. جلب معلومات المشروع ${projectId}...`);
      const projectResponse = await fetch(`${apiUrl}/v2/projects/${projectId}`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        console.log('✅ معلومات المشروع:');
        console.log(JSON.stringify(projectData, null, 2));
        console.log();
      } else {
        console.error(`❌ فشل جلب معلومات المشروع: ${projectResponse.status}`);
      }

      console.log(`🔍 3. جلب قائمة المستخدمين في المشروع...`);
      const usersResponse = await fetch(`${apiUrl}/v2/projects/${projectId}/users`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('✅ قائمة المستخدمين:');
        console.log(JSON.stringify(usersData, null, 2));
        console.log();
      } else {
        console.error(`❌ فشل جلب قائمة المستخدمين: ${usersResponse.status}`);
        const errorText = await usersResponse.text();
        console.error(`   التفاصيل: ${errorText.substring(0, 200)}`);
      }

      console.log(`🔍 4. جلب قائمة اللغات المدعومة...`);
      const languagesResponse = await fetch(`${apiUrl}/v2/projects/${projectId}/languages`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (languagesResponse.ok) {
        const languagesData = await languagesResponse.json();
        console.log('✅ اللغات المدعومة:');
        console.log(JSON.stringify(languagesData, null, 2));
        console.log();
      } else {
        console.error(`❌ فشل جلب اللغات: ${languagesResponse.status}`);
      }

      console.log(`🔍 5. جلب إحصائيات الترجمة...`);
      const statsResponse = await fetch(`${apiUrl}/v2/projects/${projectId}/stats`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('✅ إحصائيات الترجمة:');
        console.log(JSON.stringify(statsData, null, 2));
        console.log();
      } else {
        console.error(`❌ فشل جلب الإحصائيات: ${statsResponse.status}`);
      }
    }

    console.log('\n✨ اكتمل اختبار بيانات المسؤول!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال:');
    console.error(error);
    process.exit(1);
  }
}

testTolgeeAdmin();
