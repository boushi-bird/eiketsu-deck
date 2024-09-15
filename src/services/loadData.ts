import type { EiketsuDeckData } from 'eiketsu-deck';

import { baseDataUrl } from '@/consts';
import { cacheFetch } from '@/utils/cacheFetch';

export const loadEiketsuDeckData = async (): Promise<EiketsuDeckData> => {
  const data = await cacheFetch<EiketsuDeckData>(
    baseDataUrl,
    '/eiketsu-taisen-data/eiketsu_deck_data.json',
  );
  return data;
};
