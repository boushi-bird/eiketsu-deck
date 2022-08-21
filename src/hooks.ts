import { createSelector } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  shallowEqual,
  useDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import { DEFAULT_DECK_CONSTRAINTS } from './modules/deck';

import type { AppDispatch, RootState } from '@/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = (
  selector,
  equalityFn?
) => {
  return useReduxSelector(selector, equalityFn || shallowEqual);
};

export const belongSelector = (state: RootState) => state.belong;
export const cardlistSelector = (state: RootState) => state.cardlist;
export const datalistSelector = (state: RootState) => state.datalist;
export const deckSelector = (state: RootState) => state.deck;
export const filterSelector = (state: RootState) => state.filter;
export const windowSelector = (state: RootState) => state.window;

export const generalsSelector = createSelector(
  datalistSelector,
  (datalist) => datalist.generals
);

export const activeDeckTabIndexSelector = createSelector(
  deckSelector,
  ({ activeTabIndex }) => activeTabIndex
);

export const deckCurrentSelector = createSelector(
  deckSelector,
  ({ deckTabs, activeTabIndex }) =>
    deckTabs[activeTabIndex] || {
      name: '',
      cards: [],
      constraints: { ...DEFAULT_DECK_CONSTRAINTS },
    }
);

export const deckCardsSelector = createSelector(
  deckCurrentSelector,
  (current) => current.cards
);

export const editModeSelector = createSelector(
  windowSelector,
  ({ editMode }) => editMode
);

export const belongCardsSelector = createSelector(
  belongSelector,
  ({ belongCards }) => belongCards
);

export const searchedGeneralsSelector = createSelector(
  cardlistSelector,
  ({ searchedGenerals }) => searchedGenerals
);

export const hasBelongCardsSelector = createSelector(
  belongCardsSelector,
  (belongCards) => Object.keys(belongCards).length > 0
);
