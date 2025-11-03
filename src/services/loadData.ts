import type { EiketsuDeckData, EiketsuDeckDataKabuki } from 'eiketsu-deck';

import { baseDataKabukiUrl, baseDataUrl } from '@/consts';
import { cacheFetch } from '@/utils/cacheFetch';

export const loadEiketsuDeckData = async (): Promise<EiketsuDeckData> => {
  const data = await cacheFetch<EiketsuDeckData>(
    baseDataUrl,
    '/eiketsu-taisen-data/eiketsu_deck_data.json',
  );
  return data;
};

export const loadEiketsuDeckDataKabuki =
  async (): Promise<EiketsuDeckDataKabuki | null> => {
    // 傾奇は取れなくても良しとする
    try {
      const data = await cacheFetch<EiketsuDeckDataKabuki>(
        baseDataKabukiUrl,
        '/eiketsu-taisen-data/eiketsu_deck_data_kabuki.json',
      );
      return data;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };
