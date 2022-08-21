import reduxQuerySync, { ParamsOptions } from 'redux-query-sync';

import {
  DEFAULT_DECK_CONSTRAINTS,
  DeckCard,
  SameCardConstraint,
  deckActions,
  isSameCardConstraints,
} from './deck';
import { windowActions } from './window';

import { DECK_COST_LIMIT, DECK_GENERAL_CARD_COUNT } from '@/consts';
import { RootState, store } from '@/store';
import { excludeUndef } from '@/utils/excludeUndef';

// defaultValue と=== 比較で一致する場合にparameterがなくなるので空を同一インスタンスに
const emptyDecks: DeckCard[] = [];

const deckParam: ParamsOptions<RootState, DeckCard[]> = {
  action: deckActions.setCurrentDecks,
  selector: (state) => {
    const { deckTabs, activeTabIndex } = state.deck;
    const deckCards = deckTabs[activeTabIndex]?.cards || [];
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

const devModeParam: ParamsOptions<RootState, boolean> = {
  action: windowActions.changeDevMode,
  selector: (state) => {
    return state.window.devMode;
  },
  defaultValue: false,
  valueToString: (devMode) => {
    return devMode ? '1' : '';
  },
  stringToValue: (s) => {
    return !!s;
  },
};

function numberParamsOptions(
  options: Pick<ParamsOptions<RootState, number>, 'action' | 'selector'>,
  {
    min = 0,
    max,
    defaultValue,
    step = 1,
  }: {
    min?: number;
    max: number;
    defaultValue: number;
    step?: number;
  }
): ParamsOptions<RootState, number> {
  return {
    ...options,
    defaultValue,
    valueToString: (value) => `${value}`,
    stringToValue: (s) => {
      const v = parseInt(s);
      if (v >= min && v <= max && v % step === 0) {
        return v;
      }
      return defaultValue;
    },
  };
}

const costParam: ParamsOptions<RootState, number> = numberParamsOptions(
  {
    action: deckActions.setConstraintCostLimit,
    selector: (state) => {
      const { deckTabs, activeTabIndex } = state.deck;
      const constraints = deckTabs[activeTabIndex]?.constraints || {};
      return constraints.costLimit || DECK_COST_LIMIT.defaultValue;
    },
  },
  DECK_COST_LIMIT
);

const generalLimitParam: ParamsOptions<RootState, number> = numberParamsOptions(
  {
    action: deckActions.setConstraintGeneralCardLimit,
    selector: (state) => {
      const { deckTabs, activeTabIndex } = state.deck;
      const constraints = deckTabs[activeTabIndex]?.constraints || {};
      return (
        constraints.generalCardLimit || DECK_GENERAL_CARD_COUNT.defaultValue
      );
    },
  },
  DECK_GENERAL_CARD_COUNT
);

const sameCardParam: ParamsOptions<RootState, SameCardConstraint> = {
  action: deckActions.setConstraintSameCard,
  selector: (state) => {
    const { deckTabs, activeTabIndex } = state.deck;
    const constraints = deckTabs[activeTabIndex]?.constraints || {};
    return constraints.sameCard || DEFAULT_DECK_CONSTRAINTS.sameCard;
  },
  defaultValue: DEFAULT_DECK_CONSTRAINTS.sameCard,
  stringToValue: (s) =>
    isSameCardConstraints(s) ? s : DEFAULT_DECK_CONSTRAINTS.sameCard,
};

let init = false;

export const querySync = () => {
  if (init) {
    return;
  }
  reduxQuerySync<RootState>({
    store,
    params: {
      cost: costParam,
      deck: deckParam,
      dev: devModeParam,
      ['general_limit']: generalLimitParam,
      ['same_card']: sameCardParam,
    },
    initialTruth: 'location',
    replaceState: true,
  });
  init = true;
};
