import { useMemo } from 'react';

import { General } from 'eiketsu-deck';

import { SameCardConstraint } from '@/modules/deck';
import { queryParamsOptions } from '@/modules/querySync';
import { excludeUndef } from '@/utils/excludeUndef';

const KEY_NAME = 'saved_decks';

export interface SavedDeckRecords {
  key: number;
  cards: General[];
  costLimit: number;
  sameCard: SameCardConstraint;
  query: string;
}

const queryToSavedDeckRecord =
  (generals: General[]) =>
  (query: string, index: number): SavedDeckRecords => {
    const search = new URLSearchParams(query);
    const deckCards = queryParamsOptions.deck.stringToValue(
      search.get('deck') || '',
    );
    const cards = deckCards
      .map((card) => generals.find((g) => g.idx === card.generalIdx))
      .filter(excludeUndef);
    const cost = search.get('cost');
    const sameCard = search.get('same_card');

    const costParamOptions = queryParamsOptions.cost;
    const sameCardParamOptions = queryParamsOptions['same_card'];
    return {
      key: index,
      cards,
      costLimit:
        (cost
          ? costParamOptions.stringToValue?.(cost)
          : costParamOptions.defaultValue) || 0,
      sameCard:
        (sameCard
          ? sameCardParamOptions.stringToValue?.(sameCard)
          : sameCardParamOptions.defaultValue) || 'personal',
      query: `?${search.toString()}`,
    };
  };

/**
 * LocalStorageから保存済みデッキを読み込むカスタムフック
 * @param generals 武将データ
 * @param storageVersion LocalStorage更新を検知するためのバージョン番号
 * @returns 保存済みデッキの配列
 */
export const useLocalStorageDecks = (
  generals: General[],
  storageVersion: number,
): SavedDeckRecords[] => {
  return useMemo(() => {
    const cached = localStorage.getItem(KEY_NAME);
    const queryStrings: string[] = cached ? JSON.parse(cached) : [];
    return queryStrings.map(queryToSavedDeckRecord(generals));
    // storageVersionはLocalStorage更新時に再計算をトリガーするために必要
    // カスタムフック内での使用なので、意図的にstorageVersionを依存配列に含める
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generals, storageVersion]);
};

export { KEY_NAME };
