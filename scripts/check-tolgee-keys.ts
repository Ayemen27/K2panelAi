import { NAMESPACES } from '../src/lib/i18n/constants';

const TOLGEE_API_URL = process.env.NEXT_PUBLIC_TOLGEE_API_URL || 'https://tolgee.binarjoinanelytic.info';
const TOLGEE_API_KEY = process.env.NEXT_PUBLIC_TOLGEE_API_KEY || process.env.TOLGEE_API_KEY;
const TOLGEE_PROJECT_ID = process.env.NEXT_PUBLIC_TOLGEE_PROJECT_ID || '2';

async function checkTolgeeKeys() {
  console.log('🔍 Checking Tolgee server for translation keys...\n');
  console.log('📋 Config:');
  console.log(`  - API URL: ${TOLGEE_API_URL}`);
  console.log(`  - API Key: ${TOLGEE_API_KEY?.substring(0, 10)}...`);
  console.log(`  - Project ID: ${TOLGEE_PROJECT_ID}\n`);
  
  try {
    // Test API connection first
    const testUrl = `${TOLGEE_API_URL}/v2/api-keys/current`;
    console.log('🔗 Testing API connection...');
    const testResponse = await fetch(testUrl, {
      headers: {
        'X-API-Key': TOLGEE_API_KEY || '',
      },
    });
    
    if (!testResponse.ok) {
      console.error('❌ API connection failed:', testResponse.status, testResponse.statusText);
      const errorText = await testResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    console.log('✅ API connection successful\n');
    
    // Fetch all keys from Tolgee
    const keysUrl = `${TOLGEE_API_URL}/v2/projects/${TOLGEE_PROJECT_ID}/keys?size=1000`;
    console.log('📥 Fetching keys from Tolgee...');
    console.log(`URL: ${keysUrl}\n`);
    
    const response = await fetch(keysUrl, {
      headers: {
        'X-API-Key': TOLGEE_API_KEY || '',
      },
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch keys:', response.status, response.statusText);
      const errorText = await testResponse.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Keys fetched successfully\n');
    
    // Extract key names
    const serverKeys = data._embedded?.keys || [];
    console.log(`📊 Total keys on server: ${serverKeys.length}\n`);
    
    if (serverKeys.length === 0) {
      console.log('⚠️  No keys found on Tolgee server!');
      console.log('This means you need to:');
      console.log('1. Upload your local JSON files to Tolgee');
      console.log('2. Or create keys manually in the Tolgee UI');
      console.log('3. Or use Tolgee CLI to push keys\n');
      return;
    }
    
    // Show sample keys
    console.log('📝 Sample keys from server (first 20):');
    serverKeys.slice(0, 20).forEach((key: any) => {
      console.log(`  - ${key.name}`);
    });
    
    if (serverKeys.length > 20) {
      console.log(`  ... and ${serverKeys.length - 20} more keys`);
    }
    
    console.log('\n🔍 Analyzing namespaces...');
    const namespaceStats: Record<string, number> = {};
    
    serverKeys.forEach((key: any) => {
      const keyName = key.name;
      // Check if key has namespace prefix (e.g., "layout:footer.title")
      const parts = keyName.split(':');
      if (parts.length > 1) {
        const namespace = parts[0];
        namespaceStats[namespace] = (namespaceStats[namespace] || 0) + 1;
      } else {
        // Check if key starts with known namespace names
        for (const ns of NAMESPACES) {
          if (keyName.startsWith(ns + '.')) {
            namespaceStats[ns] = (namespaceStats[ns] || 0) + 1;
            break;
          }
        }
      }
    });
    
    console.log('\n📊 Keys per namespace:');
    Object.entries(namespaceStats).forEach(([ns, count]) => {
      console.log(`  ${ns}: ${count} keys`);
    });
    
    console.log('\n✅ Tolgee server check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTolgeeKeys();
