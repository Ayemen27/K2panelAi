import { loadStaticDataForProvider } from '../src/lib/i18n/server-utils';

async function test() {
  console.log('🧪 Debugging staticData structure...\n');
  
  const data = await loadStaticDataForProvider('en');
  
  console.log('Top level keys:', Object.keys(data));
  console.log('\ndata["en"] type:', typeof data['en']);
  console.log('data["en"] keys:', data['en'] ? Object.keys(data['en']) : 'undefined');
  
  if (data['en']) {
    console.log('\ndata["en"]["layout"] type:', typeof data['en']['layout']);
    if (data['en']['layout']) {
      console.log('data["en"]["layout"] keys (first 10):', Object.keys(data['en']['layout']).slice(0, 10));
      console.log('\nSample value:');
      console.log('data["en"]["layout"]["footer.product.title"] =', data['en']['layout']['footer.product.title']);
    }
    
    console.log('\ndata["en"]["common"] type:', typeof data['en']['common']);
    if (data['en']['common']) {
      console.log('data["en"]["common"]["loading"] =', data['en']['common']['loading']);
    }
  }
}

test().catch(console.error);
