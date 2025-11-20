import { loadAllNamespaces } from '../src/lib/i18n/namespace-loader';
import { NAMESPACES } from '../src/lib/i18n/constants';

async function test() {
  console.log('🧪 Testing namespace loader...\n');
  
  const data = await loadAllNamespaces('en', NAMESPACES);
  
  console.log('Loaded data structure:');
  console.log(JSON.stringify(data, null, 2).substring(0, 1000));
  console.log('\n...(truncated)');
  
  console.log('\n\nChecking specific paths:');
  console.log('data.layout:', typeof data.layout);
  console.log('data.layout.footer:', typeof data.layout?.footer);
  console.log('data.layout.footer.product:', typeof data.layout?.footer?.product);
  console.log('data.layout.footer.product.title:', data.layout?.footer?.product?.title);
}

test().catch(console.error);
