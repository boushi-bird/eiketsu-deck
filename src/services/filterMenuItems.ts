import { General, GeneralStrategy } from 'eiketsu-deck';

import { BelongCards } from '@/modules/belong';
import { DatalistState } from '@/modules/datalist';
import { FilterMenuItemName, FilterState } from '@/modules/filter';
import { NO_SKILL } from '@/services/createDatalist';
import { excludeUndef } from '@/utils/excludeUndef';

interface FilterMenuItem {
  filterItemName: FilterMenuItemName;
  enabled: (args: { filter: FilterState; hasBelongCards: boolean }) => boolean;
  filter: (
    general: General,
    filter: FilterState,
    belong: { hasBelongCards: boolean; belongCards?: BelongCards }
  ) => boolean;
  label: (datalist: DatalistState, filter: FilterState) => string;
}

interface FilterMenuStratItem {
  filterItemName: FilterMenuItemName;
  enabled: (args: { filter: FilterState }) => boolean;
  filter: (strat: GeneralStrategy, filter: FilterState) => boolean;
  label: (datalist: DatalistState, filter: FilterState) => string;
}

interface HasIdx {
  idx: number;
}

export const filterMenuItemNames: { [key in FilterMenuItemName]: string } = {
  generalColors: '勢力',
  generalCosts: 'コスト',
  unitTypes: '兵種',
  periods: '時代勢力',
  strong: '武力',
  intelligence: '知力',
  skills: '特技',
  belongFilter: '所持状態',
  generalRarities: 'レアリティ',
  appearDetailVersions: '登場弾',
  cardTypes: 'カード種別',
  illustrations: 'イラストレーター',
  characterVoices: '声優',
  generalStrategyMp: '必要士気',
  generalStrategyCategories: '計略カテゴリー',
  generalStrategyTimes: '計略効果時間',
  generalStrategyRanges: '計略効果範囲',
  generalNameSearch: '武将名検索',
  generalStrategyNameSearch: '計略名検索',
  generalStrategyCaptionSearch: '計略説明検索',
} as const;

const sortByIdx = (a: HasIdx, b: HasIdx) => a.idx - b.idx;

export const filterMenuItems: Readonly<FilterMenuItem[]> = [
  {
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
    filterItemName: 'generalNameSearch',
    enabled: ({ filter }) => filter.generalNameSearch.length > 0,
    filter: (general, filter) => {
      const valid = (search: string) =>
        general.name.includes(search) || general.kana.includes(search);
      return filter.generalNameSearchAnd
        ? filter.generalNameSearch.every(valid)
        : filter.generalNameSearch.some(valid);
    },
    label: (_, filter) => {
      if (filter.generalNameSearch.length == 1) {
        return filter.generalNameSearch[0];
      }
      const tmp = filter.generalNameSearch.join(' ');
      return filter.generalNameSearchAnd ? `And(${tmp})` : `Or(${tmp})`;
    },
  },
  {
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
    filterItemName: 'appearDetailVersions',
    enabled: ({ filter }) => filter.appearDetailVersions.length > 0,
    filter: (general, filter) =>
      filter.appearDetailVersions.includes(general.appearDetailVersion.idx),
    label: ({ generalAppearVersions }, filter) =>
      filter.appearDetailVersions
        .map((idx) =>
          generalAppearVersions
            .flatMap((v) => v.details)
            .find((v) => v.idx === idx)
        )
        .filter(excludeUndef)
        .sort(sortByIdx)
        .map((v) => v.name)
        .join(','),
  },
  {
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
  {
    filterItemName: 'illustrations',
    enabled: ({ filter }) => filter.illustrations.length > 0,
    filter: (general, filter) =>
      filter.illustrations.includes(general.illust.idx),
    label: (_, filter) => `${filter.illustrations.length}名 選択`,
  },
  {
    filterItemName: 'characterVoices',
    enabled: ({ filter }) => filter.characterVoices.length > 0,
    filter: (general, filter) =>
      filter.characterVoices.includes(general.cv.idx),
    label: (_, filter) => `${filter.characterVoices.length}名 選択`,
  },
];

export const filterMenuStratItems: Readonly<FilterMenuStratItem[]> = [
  {
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
    filterItemName: 'generalStrategyNameSearch',
    enabled: ({ filter }) => filter.generalStrategyNameSearch.length > 0,
    filter: (strat, filter) => {
      const valid = (search: string) =>
        strat.name.includes(search) || strat.kana.includes(search);
      return filter.generalStrategyNameSearchAnd
        ? filter.generalStrategyNameSearch.every(valid)
        : filter.generalStrategyNameSearch.some(valid);
    },
    label: (_, filter) => {
      if (filter.generalStrategyNameSearch.length == 1) {
        return filter.generalStrategyNameSearch[0];
      }
      const tmp = filter.generalStrategyNameSearch.join(' ');
      return filter.generalStrategyNameSearchAnd ? `And(${tmp})` : `Or(${tmp})`;
    },
  },
  {
    filterItemName: 'generalStrategyCaptionSearch',
    enabled: ({ filter }) => filter.generalStrategyCaptionSearch.length > 0,
    filter: (strat, filter) => {
      const valid = (search: string) => strat.caption.includes(search);
      return filter.generalStrategyCaptionSearchAnd
        ? filter.generalStrategyCaptionSearch.every(valid)
        : filter.generalStrategyCaptionSearch.some(valid);
    },
    label: (_, filter) => {
      if (filter.generalStrategyCaptionSearch.length == 1) {
        return filter.generalStrategyCaptionSearch[0];
      }
      const tmp = filter.generalStrategyCaptionSearch.join(' ');
      return filter.generalStrategyCaptionSearchAnd
        ? `And(${tmp})`
        : `Or(${tmp})`;
    },
  },
  {
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
    filterItemName: 'generalStrategyRanges',
    enabled: ({ filter }) => filter.generalStrategyRanges.length > 0,
    filter: (strat, filter) =>
      filter.generalStrategyRanges.includes(strat.range.idx),
    label: (_, filter) => `${filter.generalStrategyRanges.length}つ選択`,
  },
];

export const normalizeFilterValue = (value: string) =>
  value
    .replace(/[ァ-ン]/g, (v) => String.fromCharCode(v.charCodeAt(0) - 0x60))
    .replace(/[０-９ａ-ｚＡ-Ｚ]/g, (v) =>
      String.fromCharCode(v.charCodeAt(0) - 0xfee0)
    )
    .toLowerCase();
