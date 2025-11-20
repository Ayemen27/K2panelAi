import { Tolgee } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { loadStaticDataForProvider } from '../src/lib/i18n/server-utils';
import { NAMESPACES } from '../src/lib/i18n/constants';

async function test() {
  console.log('🧪 Testing Tolgee with correct staticData format...\n');
  
  const staticData = await loadStaticDataForProvider('en');
  
  console.log('staticData structure:');
  console.log('- Keys:', Object.keys(staticData));
  console.log('- en namespaces:', Object.keys(staticData['en']));
  console.log('- Sample: en.layout["footer.product.title"] =', staticData['en']['layout']['footer.product.title']);
  
  // Wrap in async functions as Tolgee expects
  const wrappedStaticData: Record<string, () => Promise<any>> = {};
  Object.keys(staticData).forEach((key) => {
    wrappedStaticData[key] = async () => staticData[key];
  });
  
  const tolgee = Tolgee()
    .use(FormatIcu())
    .init({
      language: 'en',
      availableLanguages: ['ar', 'en'],
      defaultNs: 'common',
      ns: [...NAMESPACES],
      fallbackNs: 'common',
      staticData: wrappedStaticData,
    });
  
  await tolgee.run();
  
  console.log('\n✅ Tolgee initialized\n');
  console.log('Testing translations:');
  console.log('1. t("footer.product.title") =', tolgee.t('footer.product.title'));
  console.log('2. t("layout:footer.product.title") =', tolgee.t('layout:footer.product.title'));
  console.log('3. t("loading") =', tolgee.t('loading'));
  console.log('4. t("common:loading") =', tolgee.t('common:loading'));
  console.log('5. t("nav.pricing") =', tolgee.t('nav.pricing'));
}

test().catch(console.error);
