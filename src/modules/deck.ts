import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// デッキのユニークIDとして使う揮発的な数値
let currentDeckKey = 0;

interface DeckCardGeneralWithKey {
  key: number;
  generalIdx: number;
}

type DeckCardWithKey = DeckCardGeneralWithKey;

export type DeckCard = Omit<DeckCardGeneralWithKey, 'key'>;

export interface DeckState {
  deckCards: DeckCardWithKey[];
  deckConstraints: DeckConstraints;
}

// 同名武将の制約
// personal: 同名武将不可(通常ルール)
// personal-strategy: 同名武将かつ同計略不可
const sameCardConstraints = ['personal', 'personal-strategy'] as const;
type SameCardConstraint = typeof sameCardConstraints[number];

/**
 * デッキ成約
 */
interface DeckConstraints {
  /** コスト上限(×10) */
  limitCost: number;
  /** 武将カード上限枚数 */
  generalCardLimit: number;
  /** 同名武将制限 */
  sameCard: SameCardConstraint;
  /** 知勇一転 */
  exchange: boolean;
}

const initialState: DeckState = {
  deckCards: [],
  deckConstraints: {
    limitCost: 90,
    generalCardLimit: 8,
    sameCard: 'personal',
    exchange: false,
  },
};

const slice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    addDeckGeneral(state: DeckState, action: PayloadAction<DeckCard>) {
      const card = {
        ...action.payload,
        key: currentDeckKey++,
      };
      console.log(card);
      state.deckCards = [...state.deckCards, card];
    },
    setDecks(state: DeckState, action: PayloadAction<DeckCard[]>) {
      const deckCards = action.payload.map((deckCard) => ({
        ...deckCard,
        key: currentDeckKey++,
      }));
      state.deckCards = deckCards;
    },
    setDecksWithKey(
      state: DeckState,
      action: PayloadAction<DeckCardWithKey[]>
    ) {
      state.deckCards = action.payload;
    },
    removeDeckGeneral(state: DeckState, action: PayloadAction<number>) {
      const generalIdx = action.payload;
      const deckCards = state.deckCards.filter(
        (v) => v.generalIdx !== generalIdx
      );
      state.deckCards = deckCards;
    },
    clearDeck(state: DeckState) {
      state.deckCards = [];
    },
  },
});

export const deckReducer = slice.reducer;
export const deckActions = slice.actions;
