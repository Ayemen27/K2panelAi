import { Tolgee } from '@tolgee/web';
import { FormatIcu } from '@tolgee/format-icu';
import { loadAllNamespaces } from '../src/lib/i18n/namespace-loader';
import { NAMESPACES } from '../src/lib/i18n/constants';

async function test() {
  console.log('🧪 Testing Tolgee in offline mode (staticData only)...\n');
  
  const enData = await loadAllNamespaces('en', NAMESPACES);
  const arData = await loadAllNamespaces('ar', NAMESPACES);
  
  console.log('Data structure:');
  console.log('enData.layout["footer.product.title"] =', enData.layout['footer.product.title']);
  console.log('enData.common.loading =', enData.common.loading);
  
  const tolgee = Tolgee()
    .use(FormatIcu())
    .init({
      language: 'en',
      availableLanguages: ['ar', 'en'],
      defaultNs: 'layout',
      ns: [...NAMESPACES],
      fallbackNs: 'common',
      staticData: {
        en: enData,
        ar: arData,
      },
    });
  
  await tolgee.run();
  
  console.log('\n✅ Tolgee initialized\n');
  console.log('Testing translations:');
  console.log('t("footer.product.title") =', tolgee.t('footer.product.title'));
  console.log('t("layout:footer.product.title") =', tolgee.t('layout:footer.product.title'));
  console.log('t("loading", { ns: "common" }) =', tolgee.t('loading', { ns: 'common' }));
  console.log('t("common:loading") =', tolgee.t('common:loading'));
}

test().catch(console.error);
