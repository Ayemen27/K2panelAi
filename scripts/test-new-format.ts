import { loadStaticDataForProvider } from '../src/lib/i18n/server-utils';

async function test() {
  console.log('🧪 Testing new staticData format...\n');
  
  const data = await loadStaticDataForProvider('en');
  
  console.log('Keys in staticData:');
  console.log(Object.keys(data));
  
  console.log('\nSample values:');
  console.log('en:layout keys (first 10):');
  if (data['en:layout']) {
    console.log(Object.keys(data['en:layout']).slice(0, 10));
    console.log('\nSample value from en:layout:');
    console.log('footer.product.title =', data['en:layout']['footer.product.title']);
  } else {
    console.log('❌ en:layout not found!');
  }
  
  console.log('\nen:common keys (first 5):');
  if (data['en:common']) {
    console.log(Object.keys(data['en:common']).slice(0, 5));
    console.log('\nSample value from en:common:');
    console.log('loading =', data['en:common']['loading']);
  } else {
    console.log('❌ en:common not found!');
  }
}

test().catch(console.error);
