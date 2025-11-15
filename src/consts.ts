/** 範囲を持つ値 */
type RangeValue = Readonly<{
  /** 最小値 */
  min: number;
  /** 最大値 */
  max: number;
  /** 規定値 */
  defaultValue: number;
  /** 刻み値 */
  step?: number;
}>;

export const baseDataUrl = BASE_DATA_URL;
export const baseDataKabukiUrl = BASE_DATA_KABUKI_URL;

/** デッキ最大タブ数 */
export const MAX_DECK_TABS = 3 as const;

/** デッキ最大保存数 */
export const MAX_SAVED_DECK = 30 as const;

/** デッキのコスト */
export const DECK_COST_LIMIT: RangeValue = {
  min: 10,
  max: 360,
  defaultValue: 90,
  step: 5,
};

/** デッキに入れられる武将カード数 */
export const DECK_GENERAL_CARD_COUNT: RangeValue = {
  min: 1,
  max: 8,
  defaultValue: 8,
};

export const MAX_KABUKI_RANK = {
  label: 'Rank7',
  filterLabel: '7',
  rankValue: 6,
};
export const KABUKI_RANKS = [
  {
    label: 'Rank1',
    filterLabel: '1',
    rankValue: 0,
  },
  {
    label: 'Rank2',
    filterLabel: '2',
    rankValue: 1,
  },
  {
    label: 'Rank3',
    filterLabel: '3',
    rankValue: 2,
  },
  {
    label: 'Rank4',
    filterLabel: '4',
    rankValue: 3,
  },
  {
    label: 'Rank5',
    filterLabel: '5',
    rankValue: 4,
  },
  {
    label: 'Rank6',
    filterLabel: '6',
    rankValue: 5,
  },
  MAX_KABUKI_RANK,
];
