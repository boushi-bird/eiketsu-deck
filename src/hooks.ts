import { createSelector } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  shallowEqual,
  useDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { AppDispatch, RootState } from '@/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = (
  selector,
  equalityFn?
) => {
  return useReduxSelector(selector, equalityFn || shallowEqual);
};

export const datalistSelector = (state: RootState) => state.datalist;
export const deckSelector = (state: RootState) => state.deck;
export const filterSelector = (state: RootState) => state.filter;
export const windowSelector = (state: RootState) => state.window;

export const generalsSelector = createSelector(
  datalistSelector,
  (datalist) => datalist.generals
);
export const deckCardsSelector = createSelector(
  deckSelector,
  ({ deckCards }) => deckCards
);
