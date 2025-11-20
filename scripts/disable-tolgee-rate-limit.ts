import fetch from 'node-fetch';

const TOLGEE_URL = process.env.NEXT_PUBLIC_TOLGEE_API_URL || 'https://tolgee.binarjoinanelytic.info';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

async function disableRateLimit() {
  console.log('🔐 تسجيل الدخول إلى Tolgee Admin Panel...\n');

  try {
    const loginResponse = await fetch(`${TOLGEE_URL}/api/public/authorize_oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        grant_type: 'password',
      }),
    });

    if (!loginResponse.ok) {
      console.log(`❌ فشل تسجيل الدخول: ${loginResponse.status}`);
      const errorText = await loginResponse.text();
      console.log(`Error: ${errorText}`);
      
      console.log('\n🔄 محاولة طريقة تسجيل دخول أخرى...');
      const altLoginResponse = await fetch(`${TOLGEE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${ADMIN_USERNAME}&password=${ADMIN_PASSWORD}`,
        redirect: 'manual',
      });
      
      console.log(`Status: ${altLoginResponse.status}`);
      const cookies = altLoginResponse.headers.get('set-cookie');
      console.log(`Cookies: ${cookies}\n`);
      
      if (cookies) {
        console.log('✅ تم الحصول على Session Cookie!\n');
        
        console.log('📊 محاولة الوصول إلى إعدادات Rate Limit...');
        const rateLimitResponse = await fetch(`${TOLGEE_URL}/v2/administration/rate-limits`, {
          headers: {
            'Cookie': cookies,
          },
        });
        
        console.log(`Status: ${rateLimitResponse.status}`);
        const data = await rateLimitResponse.text();
        console.log(`Response: ${data.substring(0, 500)}\n`);
      }
      
      return;
    }

    const authData = await loginResponse.json();
    console.log('✅ تم تسجيل الدخول بنجاح!\n');
    console.log(`Access Token: ${authData.access_token?.substring(0, 20)}...`);

    console.log('🔧 تعطيل Rate Limit...');
    const updateResponse = await fetch(`${TOLGEE_URL}/v2/administration/rate-limits`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: false,
      }),
    });

    if (updateResponse.ok) {
      console.log('✅ تم تعطيل Rate Limit بنجاح!');
      const result = await updateResponse.json();
      console.log(result);
    } else {
      console.log(`❌ فشل تعديل الإعدادات: ${updateResponse.status}`);
      const error = await updateResponse.text();
      console.log(error);
    }
  } catch (error) {
    console.log(`❌ خطأ: ${error}`);
  }
}

disableRateLimit();
