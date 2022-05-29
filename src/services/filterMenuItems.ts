import { General, GeneralStrategy } from 'eiketsu-deck';

import { BelongCards } from '@/modules/belong';
import { DatalistState } from '@/modules/datalist';
import { FilterItemName, FilterState } from '@/modules/filter';
import { NO_SKILL } from '@/services/createDatalist';
import { excludeUndef } from '@/utils/excludeUndef';

interface FilterMenuItem {
  name: string;
  filterItemName: FilterItemName;
  enabled: (args: { filter: FilterState; hasBelongCards: boolean }) => boolean;
  filter: (
    general: General,
    filter: FilterState,
    belong: { hasBelongCards: boolean; belongCards?: BelongCards }
  ) => boolean;
  label: (datalist: DatalistState, filter: FilterState) => string;
}

interface FilterMenuStratItem {
  name: string;
  filterItemName: FilterItemName;
  enabled: (args: { filter: FilterState }) => boolean;
  filter: (strat: GeneralStrategy, filter: FilterState) => boolean;
  label: (datalist: DatalistState, filter: FilterState) => string;
}

interface HasIdx {
  idx: number;
}

const sortByIdx = (a: HasIdx, b: HasIdx) => a.idx - b.idx;

export const filterMenuItems: FilterMenuItem[] = [
  {
    name: '勢力',
    filterItemName: 'generalColors',
    enabled: ({ filter }) => filter.generalColors.length > 0,
    filter: (general, filter) =>
      filter.generalColors.includes(general.color.idx),
    label: ({ generalColors }, filter) =>
      filter.generalColors
        .map((idx) => generalColors.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
    name: 'コスト',
    filterItemName: 'generalCosts',
    enabled: ({ filter }) => filter.generalCosts.length > 0,
    filter: (general, filter) => filter.generalCosts.includes(general.cost.idx),
    label: ({ generalCosts }, filter) =>
      filter.generalCosts
        .map((idx) => generalCosts.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
    name: '兵種',
    filterItemName: 'unitTypes',
    enabled: ({ filter }) => filter.unitTypes.length > 0,
    filter: (general, filter) =>
      filter.unitTypes.includes(general.unitType.idx),
    label: ({ unitTypes }, filter) =>
      filter.unitTypes
        .map((idx) => unitTypes.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
    name: '時代勢力',
    filterItemName: 'periods',
    enabled: ({ filter }) => filter.periods.length > 0,
    filter: (general, filter) => filter.periods.includes(general.period.idx),
    label: ({ periods }, filter) =>
      filter.periods
        .map((idx) => periods.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
    name: '武力',
    filterItemName: 'strong',
    enabled: ({ filter }) => filter.strong != null,
    filter: (general, filter) => {
      const max = filter.strong?.max;
      const min = filter.strong?.min;
      if (max != null && general.strong > max) {
        return false;
      }
      if (min != null && general.strong < min) {
        return false;
      }
      return true;
    },
    label: ({ strong }, filter) => {
      const max = filter.strong?.max ?? strong.max;
      const min = filter.strong?.min ?? strong.min;

      return `${min} - ${max}`;
    },
  },
  {
    name: '知力',
    filterItemName: 'intelligence',
    enabled: ({ filter }) => filter.intelligence != null,
    filter: (general, filter) => {
      const max = filter.intelligence?.max;
      const min = filter.intelligence?.min;
      if (max != null && general.intelligence > max) {
        return false;
      }
      if (min != null && general.intelligence < min) {
        return false;
      }
      return true;
    },
    label: ({ intelligence }, filter) => {
      const max = filter.intelligence?.max ?? intelligence.max;
      const min = filter.intelligence?.min ?? intelligence.min;

      return `${min} - ${max}`;
    },
  },
  {
    name: '特技',
    filterItemName: 'skills',
    enabled: ({ filter }) => filter.skills.length > 0,
    filter: (general, filter) => {
      const hasSkill = (idx: number) => {
        if (NO_SKILL.idx === idx) {
          return general.skills.length === 0;
        }
        return general.skills.some((v) => v.idx === idx);
      };
      return filter.skillsAnd
        ? filter.skills.every(hasSkill)
        : filter.skills.some(hasSkill);
    },
    label: ({ skills }, filter) => {
      const tmp = filter.skills
        .map((idx) => skills.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.shortName)
        .join(',');
      return filter.skillsAnd ? `And(${tmp})` : tmp;
    },
  },
  {
    name: '所持状態',
    filterItemName: 'belongFilter',
    enabled: ({ filter, hasBelongCards }) =>
      hasBelongCards && filter.belongFilter != null,
    filter: (general, filter, { hasBelongCards, belongCards }) => {
      if (!hasBelongCards || !belongCards) {
        return true;
      }
      if (filter.belongFilter == null || filter.belongFilter === 'all') {
        return true;
      }
      const value = belongCards[general.uniqueId];
      const belongGeneral = value !== null && value > 0;
      return filter.belongFilter === 'belong' ? belongGeneral : !belongGeneral;
    },
    label: (_, { belongFilter }) =>
      belongFilter === 'all'
        ? 'すべて'
        : belongFilter === 'belong'
        ? '所持'
        : '未所持',
  },
  {
    name: 'レアリティ',
    filterItemName: 'generalRarities',
    enabled: ({ filter }) => filter.generalRarities.length > 0,
    filter: (general, filter) =>
      filter.generalRarities.includes(general.rarity.idx),
    label: ({ generalRarities }, filter) =>
      filter.generalRarities
        .map((idx) => generalRarities.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.shortName)
        .join(','),
  },
  {
    name: 'カード種別',
    filterItemName: 'cardTypes',
    enabled: ({ filter }) => filter.cardTypes.length > 0,
    filter: (general, filter) =>
      filter.cardTypes.includes(general.cardType.idx),
    label: ({ cardTypes }, filter) =>
      filter.cardTypes
        .map((idx) => cardTypes.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.shortName)
        .join(','),
  },
];

export const filterMenuStratItems: FilterMenuStratItem[] = [
  {
    name: '必要士気',
    filterItemName: 'generalStrategyMp',
    enabled: ({ filter }) => filter.generalStrategyMp != null,
    filter: (strat, filter) => {
      const max = filter.generalStrategyMp?.max;
      const min = filter.generalStrategyMp?.min;
      if (max != null && strat.mp > max) {
        return false;
      }
      if (min != null && strat.mp < min) {
        return false;
      }
      return true;
    },
    label: ({ generalStrategyMp }, filter) => {
      const max = filter.generalStrategyMp?.max ?? generalStrategyMp.max;
      const min = filter.generalStrategyMp?.min ?? generalStrategyMp.min;

      return `${min} - ${max}`;
    },
  },
  {
    name: '計略カテゴリー',
    filterItemName: 'generalStrategyCategories',
    enabled: ({ filter }) => filter.generalStrategyCategories.length > 0,
    filter: (strat, filter) => {
      const has = (idx: number) => {
        return strat.categories.some((v) => v.idx === idx);
      };
      return filter.generalStrategyCategoriesAnd
        ? filter.generalStrategyCategories.every(has)
        : filter.generalStrategyCategories.some(has);
    },
    label: ({ generalStrategyCategories }, filter) => {
      const tmp = filter.generalStrategyCategories
        .map((idx) => generalStrategyCategories.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(',');
      return filter.generalStrategyCategoriesAnd ? `And(${tmp})` : tmp;
    },
  },
  {
    name: '計略効果時間',
    filterItemName: 'generalStrategyTimes',
    enabled: ({ filter }) => filter.generalStrategyTimes.length > 0,
    filter: (strat, filter) =>
      filter.generalStrategyTimes.includes(strat.time.idx),
    label: ({ generalStrategyTimes }, filter) =>
      filter.generalStrategyTimes
        .map((idx) => generalStrategyTimes.find((v) => v.idx === idx))
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
    name: '計略効果範囲',
    filterItemName: 'generalStrategyRanges',
    enabled: ({ filter }) => filter.generalStrategyRanges.length > 0,
    filter: (strat, filter) =>
      filter.generalStrategyRanges.includes(strat.range.idx),
    label: (_, filter) => `${filter.generalStrategyRanges.length}つ選択`,
  },
];
