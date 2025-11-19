'use client';

import { useTranslate as useTolgeeTranslate, useTolgee } from '@tolgee/react';
import type { Namespace } from './constants';

export function useTranslate(namespace?: Namespace) {
  const { t, ...rest } = useTolgeeTranslate(namespace);
  
  return {
    t,
    ...rest,
  };
}

export function useLanguage() {
  const tolgee = useTolgee(['language']);
  
  const changeLanguage = (language: string) => {
    tolgee.changeLanguage(language);
  };
  
  return {
    currentLanguage: tolgee.getLanguage(),
    changeLanguage,
    isLoading: tolgee.isLoading(),
  };
}

export { useTolgee };
