import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  CardType,
  CharacterVoice,
  General,
  GeneralAppearVersion,
  GeneralColor,
  GeneralCost,
  GeneralRarity,
  GeneralStrategy,
  GeneralStrategyCategory,
  GeneralStrategyRange,
  GeneralStrategyTime,
  Illust,
  Period,
  Skill,
  UnitType,
} from 'eiketsu-deck';

export interface DatalistState {
  generalColors: GeneralColor[];
  periods: Period[];
  cardTypes: CardType[];
  generalAppearVersions: GeneralAppearVersion[];
  generalCosts: GeneralCost[];
  generalRarities: GeneralRarity[];
  unitTypes: UnitType[];
  skills: Skill[];
  skillsCount: {
    max: number;
    min: number;
  };
  generalStrategies: GeneralStrategy[];
  generalStrategyCategories: GeneralStrategyCategory[];
  generalStrategyRanges: GeneralStrategyRange[];
  generalStrategyTimes: GeneralStrategyTime[];
  generalStrategyMp: {
    max: number;
    min: number;
  };
  illusts: Illust[];
  characterVoices: CharacterVoice[];
  generals: General[];
  strong: {
    max: number;
    min: number;
  };
  intelligence: {
    max: number;
    min: number;
  };
}

const initialState: DatalistState = {
  generalColors: [],
  periods: [],
  cardTypes: [],
  generalAppearVersions: [],
  generalCosts: [],
  generalRarities: [],
  unitTypes: [],
  skills: [],
  skillsCount: {
    max: 1,
    min: 0,
  },
  generalStrategies: [],
  generalStrategyCategories: [],
  generalStrategyRanges: [],
  generalStrategyTimes: [],
  generalStrategyMp: {
    max: 1,
    min: 1,
  },
  illusts: [],
  characterVoices: [],
  generals: [],
  strong: {
    max: 1,
    min: 1,
  },
  intelligence: {
    max: 1,
    min: 1,
  },
};

const slice = createSlice({
  name: 'datalist',
  initialState,
  reducers: {
    setDatalist(
      _: DatalistState,
      action: PayloadAction<DatalistState>,
    ): DatalistState {
      return {
        ...action.payload,
      };
    },
  },
});

export const datalistReducer = slice.reducer;
export const datalistActions = slice.actions;
