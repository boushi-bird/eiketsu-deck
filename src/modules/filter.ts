import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RequireAtLeastOne } from 'type-fest';

export type FilterSelectionMode = 'single' | 'multiple';

export type BelongFilter = 'all' | 'belong' | 'not_belong';

export interface FilterState {
  selectionMode: FilterSelectionMode;
  belongFilter?: BelongFilter;
  strong?: RequireAtLeastOne<{ max?: number; min?: number }>;
  intelligence?: RequireAtLeastOne<{ max?: number; min?: number }>;
  generalColors: number[];
  periods: number[];
  appearDetailVersions: number[];
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
  illustrations: number[];
  characterVoices: number[];
  generalNameSearch: string[];
  generalNameSearchAnd: boolean;
  generalStrategyNameSearch: string[];
  generalStrategyNameSearchAnd: boolean;
  generalStrategyCaptionSearch: string[];
  generalStrategyCaptionSearchAnd: boolean;
}

const initialState: FilterState = {
  selectionMode: 'multiple',
  generalColors: [],
  periods: [],
  appearDetailVersions: [],
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
  illustrations: [],
  characterVoices: [],
  generalNameSearch: [],
  generalNameSearchAnd: true,
  generalStrategyNameSearch: [],
  generalStrategyNameSearchAnd: true,
  generalStrategyCaptionSearch: [],
  generalStrategyCaptionSearchAnd: true,
};

export type FilterItemName = keyof FilterState;

export type SelectionFilterItemName = Exclude<
  FilterItemName,
  | 'selectionMode'
  | 'belongFilter'
  | 'strong'
  | 'intelligence'
  | 'skillsAnd'
  | 'generalStrategyMp'
  | 'generalStrategyCategoriesAnd'
>;

const numberItemNames = [
  'strong',
  'intelligence',
  'generalStrategyMp',
] as const;
function isNumberItem(
  itemName: FilterItemName,
): itemName is (typeof numberItemNames)[number] {
  return numberItemNames.includes(itemName as (typeof numberItemNames)[number]);
}

const stringArrayItemNames = [
  'generalNameSearch',
  'generalStrategyNameSearch',
  'generalStrategyCaptionSearch',
] as const;
function isStringArrayItem(
  itemName: FilterItemName,
): itemName is (typeof stringArrayItemNames)[number] {
  return stringArrayItemNames.includes(
    itemName as (typeof stringArrayItemNames)[number],
  );
}

const booleanItemNames = [
  'skillsAnd',
  'generalStrategyCategoriesAnd',
  'generalNameSearchAnd',
  'generalStrategyNameSearchAnd',
  'generalStrategyCaptionSearchAnd',
] as const;
function isBooleanItem(
  itemName: FilterItemName,
): itemName is (typeof booleanItemNames)[number] {
  return booleanItemNames.includes(
    itemName as (typeof booleanItemNames)[number],
  );
}

export type FilterMenuItemName = Exclude<
  FilterItemName,
  'selectionMode' | (typeof booleanItemNames)[number]
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
      }>,
    ) => {
      state[itemName] = value;
    },
    resetCondition: (
      state: FilterState,
      { payload }: PayloadAction<FilterItemName>,
    ) => {
      const itemName = payload;
      // number
      if (isNumberItem(itemName)) {
        state[itemName] = undefined;
        return;
      }
      // union type
      if (itemName === 'selectionMode') {
        state[itemName] = initialState[itemName];
        return;
      }
      if (itemName === 'belongFilter') {
        state[itemName] = initialState[itemName];
        return;
      }
      // string[]
      if (isStringArrayItem(itemName)) {
        state[itemName] = initialState[itemName];
        return;
      }
      // boolean
      if (isBooleanItem(itemName)) {
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
