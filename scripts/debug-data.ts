import { loadAllNamespaces } from '../src/lib/i18n/namespace-loader';
import { NAMESPACES } from '../src/lib/i18n/constants';

async function test() {
  console.log('🧪 Debugging data structure...\n');
  
  const data = await loadAllNamespaces('en', NAMESPACES);
  
  console.log('Top level keys:', Object.keys(data));
  console.log('\nLayout namespace keys (first 10):');
  console.log(Object.keys(data.layout).slice(0, 10));
  console.log('\nSample values from layout:');
  console.log('footer.product.title =', data.layout['footer.product.title']);
  console.log('nav.pricing =', data.layout['nav.pricing']);
  console.log('\nCommon namespace keys:');
  console.log(Object.keys(data.common).slice(0, 5));
  console.log('\nSample value from common:');
  console.log('loading =', data.common['loading']);
}

test().catch(console.error);
