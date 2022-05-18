import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CardlistState {
  // 検索条件に合う武将のidx
  searchedGenerals: number[];
}

const initialState: CardlistState = {
  searchedGenerals: [],
};

const slice = createSlice({
  name: 'cardlist',
  initialState,
  reducers: {
    setSearchedGenerals(state: CardlistState, action: PayloadAction<number[]>) {
      state.searchedGenerals = action.payload;
    },
  },
});

export const cardlistReducer = slice.reducer;
export const cardlistActions = slice.actions;
