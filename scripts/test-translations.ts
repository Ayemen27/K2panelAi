import { getServerTranslations } from '../src/lib/i18n/server-utils';

async function test() {
  console.log('🧪 Testing translations...\n');
  
  const { t } = await getServerTranslations('en', ['layout']);
  
  console.log('Test 1: footer.product.title');
  console.log('Result:', t('footer.product.title'));
  console.log('Expected: Product\n');
  
  console.log('Test 2: layout:footer.product.title');
  console.log('Result:', t('layout:footer.product.title'));
  console.log('Expected: Product\n');
  
  console.log('Test 3: nav.pricing');
  console.log('Result:', t('nav.pricing'));
  console.log('Expected: Pricing\n');
  
  console.log('Test 4: layout:nav.pricing');
  console.log('Result:', t('layout:nav.pricing'));
  console.log('Expected: Pricing\n');
}

test().catch(console.error);
