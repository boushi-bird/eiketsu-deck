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

/** デッキ最大タブ数 */
export const MAX_DECK_TABS = 3 as const;

/** デッキ最大保存数 */
export const MAX_SAVED_DECK = 20 as const;

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
