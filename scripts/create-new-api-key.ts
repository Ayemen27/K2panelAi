import fetch from 'node-fetch';

const TOLGEE_URL = 'https://tolgee.binarjoinanelytic.info';
const USERNAME = 'admin';
const PASSWORD = 'admin';
const PROJECT_ID = '2';

async function createNewAPIKey() {
  console.log('🔐 تسجيل الدخول إلى Tolgee...\n');

  try {
    // Step 1: Login to get JWT token
    const loginResponse = await fetch(`${TOLGEE_URL}/api/public/generatetoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });

    if (!loginResponse.ok) {
      console.log(`❌ فشل تسجيل الدخول: ${loginResponse.status}`);
      const error = await loginResponse.text();
      console.log(`Error: ${error.substring(0, 200)}`);
      return;
    }

    const authData = await loginResponse.json() as any;
    console.log('✅ تم تسجيل الدخول بنجاح!\n');
    const accessToken = authData.accessToken;

    // Step 2: Create new API key
    console.log('🔑 إنشاء API Key جديد...');
    const createKeyResponse = await fetch(`${TOLGEE_URL}/v2/projects/${PROJECT_ID}/api-keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'K2Panel AI - Unlimited Access',
        scopes: [
          'translations.view',
          'translations.edit',
          'keys.edit',
          'keys.create',
          'keys.delete',
          'screenshots.view',
          'screenshots.upload',
          'screenshots.delete',
        ],
        expiresAt: null, // No expiration
      }),
    });

    if (!createKeyResponse.ok) {
      console.log(`❌ فشل إنشاء API Key: ${createKeyResponse.status}`);
      const error = await createKeyResponse.text();
      console.log(`Error: ${error.substring(0, 300)}`);
      return;
    }

    const keyData = await createKeyResponse.json() as any;
    console.log('✅ تم إنشاء API Key بنجاح!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`API Key الجديد: ${keyData.key}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 قم بتحديث .env.local:');
    console.log(`NEXT_PUBLIC_TOLGEE_API_KEY=${keyData.key}`);
    console.log('\n');
  } catch (error) {
    console.log(`❌ خطأ: ${error}`);
  }
}

createNewAPIKey();
