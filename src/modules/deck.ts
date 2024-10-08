import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DECK_COST_LIMIT, DECK_GENERAL_CARD_COUNT } from '@/consts';

// デッキのユニークIDとして使う揮発的な数値
let currentDeckKey = 0;

// デッキタブのユニークIDとして使う揮発的な数値
let deckTabKey = 1;

interface DeckCardGeneralWithKey {
  key: number;
  generalIdx: number;
}

type DeckCardWithKey = DeckCardGeneralWithKey;

export type DeckCard = Omit<DeckCardGeneralWithKey, 'key'>;

export interface Deck {
  cards: DeckCardWithKey[];
  constraints: DeckConstraints;
}

interface DeckTab extends Deck {
  key: number;
  cardsSaved: boolean;
  cardsConstraints: boolean;
}

export interface DeckState {
  deckTabs: DeckTab[];
  activeTabIndex: number;
}

// 同名武将の制約
// personal: 同名武将不可(通常ルール)
// personal-strategy: 同名武将かつ同計略不可
const sameCardConstraints = ['personal', 'personal-strategy'] as const;
export type SameCardConstraint = (typeof sameCardConstraints)[number];

export const isSameCardConstraints = (
  value: string,
): value is SameCardConstraint =>
  sameCardConstraints.includes(value as SameCardConstraint);

/**
 * デッキ制約
 */
export interface DeckConstraints {
  /** コスト上限(×10) */
  costLimit: number;
  /** 武将カード上限枚数 */
  generalCardLimit: number;
  /** 同名武将制限 */
  sameCard: SameCardConstraint;
  /** 知勇一転 */
  exchange: boolean;
}

export type DeckConstraintNames = keyof DeckConstraints;

export const DEFAULT_DECK_CONSTRAINTS: Readonly<DeckConstraints> = {
  costLimit: DECK_COST_LIMIT.defaultValue,
  generalCardLimit: DECK_GENERAL_CARD_COUNT.defaultValue,
  sameCard: 'personal',
  exchange: false,
};

const initialState: DeckState = {
  activeTabIndex: 0,
  deckTabs: [
    {
      key: deckTabKey++,
      cards: [],
      constraints: {
        ...DEFAULT_DECK_CONSTRAINTS,
      },
      cardsSaved: true,
      cardsConstraints: true,
    },
  ],
};

const slice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    addDeckGeneral(
      state: DeckState,
      action: PayloadAction<{ card: DeckCard; tabIndex: number }>,
    ) {
      const current = state.deckTabs[action.payload.tabIndex];
      if (!current) {
        return;
      }
      current.cards = [
        ...current.cards,
        {
          ...action.payload.card,
          key: currentDeckKey++,
        },
      ];
      current.cardsSaved = false;
    },
    setCurrentDecks(state: DeckState, action: PayloadAction<DeckCard[]>) {
      const current = state.deckTabs[state.activeTabIndex];
      if (!current) {
        return;
      }
      const deckCards = action.payload.map((deckCard) => ({
        ...deckCard,
        key: currentDeckKey++,
      }));
      current.cards = deckCards;
      current.cardsSaved = false;
    },
    currentDeckToSaved(state: DeckState) {
      const current = state.deckTabs[state.activeTabIndex];
      if (!current) {
        return;
      }
      current.cardsSaved = true;
    },
    setDecksWithKey(
      state: DeckState,
      action: PayloadAction<{ cards: DeckCardWithKey[]; tabIndex: number }>,
    ) {
      const current = state.deckTabs[action.payload.tabIndex];
      if (!current) {
        return;
      }
      current.cards = action.payload.cards;
      current.cardsSaved = false;
    },
    removeDeckGeneral(
      state: DeckState,
      action: PayloadAction<{ generalIdx: number; tabIndex: number }>,
    ) {
      const current = state.deckTabs[action.payload.tabIndex];
      if (!current) {
        return;
      }
      const generalIdx = action.payload.generalIdx;
      const deckCards = current.cards.filter(
        (v) => v.generalIdx !== generalIdx,
      );
      current.cards = deckCards;
      current.cardsSaved = false;
    },
    changeDeckTab(state: DeckState, action: PayloadAction<number>) {
      const tabIndex = action.payload;
      state.activeTabIndex = state.deckTabs.length > tabIndex ? tabIndex : 0;
    },
    addDeckTab(state: DeckState, action: PayloadAction<boolean>) {
      const changeNewTab = action.payload;
      const current = state.deckTabs[state.activeTabIndex];
      // 現在の制約を引き継ぐ
      const constraints = current?.constraints || {
        ...DEFAULT_DECK_CONSTRAINTS,
      };
      state.deckTabs = [
        ...state.deckTabs,
        {
          key: currentDeckKey++,
          cards: [],
          constraints,
          cardsSaved: true,
          cardsConstraints: true,
        },
      ];
      if (changeNewTab) {
        state.activeTabIndex = state.deckTabs.length - 1;
      }
    },
    removeDeckTab(state: DeckState, action: PayloadAction<number>) {
      const tabIndex = action.payload;
      state.deckTabs = state.deckTabs.filter((_, i) => i !== tabIndex);
      state.activeTabIndex = 0;
    },
    clearDeck(state: DeckState, action: PayloadAction<number>) {
      const tabIndex = action.payload;
      const current = state.deckTabs[tabIndex];
      if (!current) {
        return;
      }
      current.cards = [];
    },
    setConstraintCostLimit(
      state: DeckState,
      { payload }: PayloadAction<number>,
    ) {
      const current = state.deckTabs[state.activeTabIndex];
      if (!current) {
        return;
      }
      current.constraints['costLimit'] = payload;
    },
    setConstraintSameCard(
      state: DeckState,
      { payload }: PayloadAction<SameCardConstraint>,
    ) {
      const current = state.deckTabs[state.activeTabIndex];
      if (!current) {
        return;
      }
      current.constraints['sameCard'] = payload;
    },
    resetConstraints(state: DeckState) {
      const current = state.deckTabs[state.activeTabIndex];
      if (!current) {
        return;
      }
      current.constraints = {
        ...DEFAULT_DECK_CONSTRAINTS,
      };
    },
  },
});

export const deckReducer = slice.reducer;
export const deckActions = slice.actions;
