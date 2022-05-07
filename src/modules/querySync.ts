import reduxQuerySync, { ParamsOptions } from 'redux-query-sync';

import { DeckCard, deckActions } from './deck';

import { RootState, store } from '@/store';
import { excludeUndef } from '@/utils/excludeUndef';

// defaultValue と=== 比較で一致する場合にparameterがなくなるので空を同一インスタンスに
const emptyDecks: DeckCard[] = [];

const deckParam: ParamsOptions<RootState, DeckCard[]> = {
  action: deckActions.setDecks,
  selector: (state) => {
    const deckCards = state.deck.deckCards;
    if (deckCards.length === 0) {
      return emptyDecks;
    }
    return deckCards;
  },
  defaultValue: emptyDecks,
  valueToString: (deckCards) => {
    const {
      datalist: { generals },
    } = store.getState();
    return deckCards
      .map((deckCard) => {
        const general = generals.find((g) => g.idx === deckCard.generalIdx);
        if (!general) {
          return '';
        }
        return general.uniqueId;
      })
      .filter((r) => r)
      .join('|');
  },
  stringToValue: (s) => {
    if (!s) {
      return emptyDecks;
    }
    const {
      datalist: { generals },
    } = store.getState();
    // 重複は排除する
    return [...new Set(s.split('|'))]
      .slice(0, 8) // 8枚以上は受け付けない
      .map((v) => {
        const general = generals.find((g) => g.uniqueId === v);
        if (!general) {
          return undefined;
        }
        return { generalIdx: general.idx };
      })
      .filter(excludeUndef);
  },
};

let init = false;

export const querySync = () => {
  if (init) {
    return;
  }
  reduxQuerySync<RootState>({
    store,
    params: {
      deck: deckParam,
    },
    initialTruth: 'location',
  });
  init = true;
};
