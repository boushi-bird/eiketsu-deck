import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface BelongCards {
  [key: string]: number;
}

export interface BelongState {
  belongCards: BelongCards;
}

const initialState: BelongState = {
  belongCards: {},
};

interface UpdateBelong {
  generalUniqueId: string;
  count: number;
}

const slice = createSlice({
  name: 'belong',
  initialState,
  reducers: {
    updateBelongCard: (
      state: BelongState,
      action: PayloadAction<UpdateBelong>
    ) => {
      const { generalUniqueId, count } = action.payload;
      const belongCards = { ...state.belongCards };
      if (count <= 0) {
        delete belongCards[generalUniqueId];
      } else {
        belongCards[generalUniqueId] = count;
      }
      state.belongCards = belongCards;
    },
    updateBelongCards: (
      state: BelongState,
      action: PayloadAction<UpdateBelong[]>
    ) => {
      const updateBelongs = action.payload;
      const belongCards = { ...state.belongCards };
      for (const { generalUniqueId, count } of updateBelongs) {
        if (count <= 0) {
          delete belongCards[generalUniqueId];
        } else {
          belongCards[generalUniqueId] = count;
        }
      }
      state.belongCards = belongCards;
    },
    setBelongCards: (
      state: BelongState,
      action: PayloadAction<{ [key: string]: number }>
    ) => {
      state.belongCards = action.payload;
    },
  },
});

export const belongReducer = slice.reducer;
export const belongActions = slice.actions;
