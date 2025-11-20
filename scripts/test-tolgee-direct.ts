import { Tolgee } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { loadAllNamespaces } from '../src/lib/i18n/namespace-loader';
import { NAMESPACES, SUPPORTED_LOCALES } from '../src/lib/i18n/constants';

async function test() {
  console.log('🧪 Testing Tolgee directly...\n');
  
  // Load data for both locales
  const enData = await loadAllNamespaces('en', NAMESPACES);
  const arData = await loadAllNamespaces('ar', NAMESPACES);
  
  console.log('Sample keys from enData:');
  console.log(Object.keys(enData).slice(0, 10));
  console.log('\nSample value:');
  console.log('layout:footer.product.title =', enData['layout:footer.product.title']);
  
  // Create Tolgee instance
  const tolgee = Tolgee()
    .use(FormatIcu())
    .init({
      language: 'en',
      availableLanguages: ['ar', 'en'],
      defaultNs: 'common',
      ns: [...NAMESPACES],
      fallbackNs: 'common',
      staticData: {
        en: async () => enData,
        ar: async () => arData,
      },
    });
  
  await tolgee.run();
  
  console.log('\n✅ Tolgee initialized');
  console.log('\nTesting translations:');
  console.log('t("layout:footer.product.title") =', tolgee.t('layout:footer.product.title'));
  console.log('t("footer.product.title") =', tolgee.t('footer.product.title'));
  console.log('t("common:loading") =', tolgee.t('common:loading'));
}

test().catch(console.error);
