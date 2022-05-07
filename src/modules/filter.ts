import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

export type FilterSelectionMode = 'single' | 'multiple';

export interface FilterState {
  selectionMode: FilterSelectionMode;
  strong?: RequireAtLeastOne<{ max?: number; min?: number }>;
  intelligence?: RequireAtLeastOne<{ max?: number; min?: number }>;
  generalColors: number[];
  periods: number[];
  cardTypes: number[];
  generalCosts: number[];
  generalRarities: number[];
  unitTypes: number[];
  skills: number[];
  skillsAnd: boolean;
  generalStrategyMp?: RequireAtLeastOne<{ max?: number; min?: number }>;
  generalStrategyCategories: number[];
  generalStrategyCategoriesAnd: boolean;
  generalStrategyTimes: number[];
  generalStrategyRanges: number[];
}

const initialState: FilterState = {
  selectionMode: 'multiple',
  generalColors: [],
  periods: [],
  cardTypes: [],
  generalCosts: [],
  generalRarities: [],
  unitTypes: [],
  skills: [],
  skillsAnd: false,
  generalStrategyCategories: [],
  generalStrategyCategoriesAnd: false,
  generalStrategyTimes: [],
  generalStrategyRanges: [],
};

export type FilterItemName = keyof FilterState;

export type SelectionFilterItemName = Exclude<
  FilterItemName,
  | 'selectionMode'
  | 'strong'
  | 'intelligence'
  | 'skillsAnd'
  | 'generalStrategyMp'
  | 'generalStrategyCategoriesAnd'
>;

const slice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCondition: <K extends FilterItemName>(
      state: FilterState,
      {
        payload: { itemName, value },
      }: PayloadAction<{
        itemName: K;
        value: FilterState[K];
      }>
    ) => {
      state[itemName] = value;
    },
    resetCondition: (
      state: FilterState,
      { payload }: PayloadAction<FilterItemName>
    ) => {
      const itemName = payload;
      // number
      if (
        itemName === 'strong' ||
        itemName === 'intelligence' ||
        itemName === 'generalStrategyMp'
      ) {
        state[itemName] = undefined;
        return;
      }
      // string
      if (itemName === 'selectionMode') {
        state[itemName] = initialState[itemName];
        return;
      }
      // boolean
      if (
        itemName === 'skillsAnd' ||
        itemName === 'generalStrategyCategoriesAnd'
      ) {
        state[itemName] = initialState[itemName];
        return;
      }
      // number[]
      state[itemName] = initialState[itemName];
    },
    resetConditions: (state: FilterState): FilterState => {
      return {
        ...initialState,
        selectionMode: state.selectionMode,
      };
    },
  },
});

export const filterReducer = slice.reducer;
export const filterActions = slice.actions;
