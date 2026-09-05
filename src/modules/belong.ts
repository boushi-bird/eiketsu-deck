import { PayloadAction, createSlice } from '@reduxjs/toolkit';

/**
 * 1武将カードの所持情報。
 *
 * 通常カードは所持boolean(`owned`)のみで管理し、枚数は持たない。
 * 絆・刻銘は所持フラグを持たず枚数のみで状態を表し、`undefined` と `0` は
 * どちらも未所持として扱う（区別しない）。
 */
export interface OwnedCardCounts {
  /** 通常カードの所持状態 */
  owned: boolean;
  /** 絆カードの枚数 */
  kizuna: number | undefined;
  /** 刻銘カードの枚数 */
  kokumei: number | undefined;
}

export interface BelongCards {
  [key: string]: OwnedCardCounts;
}

export interface BelongState {
  belongCards: BelongCards;
}

const initialState: BelongState = {
  belongCards: {},
};

/** 枚数で管理するカード種別のキー */
export type CardCountKey = keyof Omit<OwnedCardCounts, 'owned'>;

export interface UpdateBelong {
  generalUniqueId: string;
  /** 通常カードの所持状態。省略時は現在の状態を維持する */
  owned?: boolean;
  /** 絆・刻銘の枚数。指定したキーのみ更新する */
  cardCounts?: Partial<Pick<OwnedCardCounts, CardCountKey>>;
}

interface UpdateBelongCardCount {
  generalUniqueId: string;
  key: CardCountKey;
  value: number | undefined;
}

/** 通常カードを所持しているか */
export const isOwned = (cardCounts: OwnedCardCounts | undefined): boolean =>
  cardCounts?.owned === true;

/** 枚数として有効な値(1以上)に正規化する。0以下・非整数は未入力(undefined)扱い */
const normalizeCount = (value: number | undefined): number | undefined =>
  value != null && Number.isInteger(value) && value > 0 ? value : undefined;

/** 所持情報が空(通常未所持かつ絆・刻銘も未入力)であるか */
const isEmpty = ({ owned, kizuna, kokumei }: OwnedCardCounts): boolean =>
  !owned && kizuna == null && kokumei == null;

/**
 * 1武将分の所持情報を更新した結果を返す。
 * 更新後に空になった場合はキーごと削除するため `undefined` を返す。
 */
const mergeBelongCard = (
  current: OwnedCardCounts | undefined,
  { owned, cardCounts }: UpdateBelong,
): OwnedCardCounts | undefined => {
  const merged: OwnedCardCounts = {
    owned: owned ?? current?.owned ?? false,
    kizuna: normalizeCount(
      cardCounts && 'kizuna' in cardCounts
        ? cardCounts.kizuna
        : current?.kizuna,
    ),
    kokumei: normalizeCount(
      cardCounts && 'kokumei' in cardCounts
        ? cardCounts.kokumei
        : current?.kokumei,
    ),
  };
  return isEmpty(merged) ? undefined : merged;
};

const slice = createSlice({
  name: 'belong',
  initialState,
  reducers: {
    updateBelongCard: (
      state: BelongState,
      action: PayloadAction<UpdateBelong>,
    ) => {
      const updateBelong = action.payload;
      const { generalUniqueId } = updateBelong;
      const belongCards = { ...state.belongCards };
      const merged = mergeBelongCard(
        belongCards[generalUniqueId],
        updateBelong,
      );
      if (merged == null) {
        delete belongCards[generalUniqueId];
      } else {
        belongCards[generalUniqueId] = merged;
      }
      state.belongCards = belongCards;
    },
    updateBelongCardCount: (
      state: BelongState,
      action: PayloadAction<UpdateBelongCardCount>,
    ) => {
      const { generalUniqueId, key, value } = action.payload;
      const belongCards = { ...state.belongCards };
      const merged = mergeBelongCard(belongCards[generalUniqueId], {
        generalUniqueId,
        cardCounts: { [key]: value },
      });
      if (merged == null) {
        delete belongCards[generalUniqueId];
      } else {
        belongCards[generalUniqueId] = merged;
      }
      state.belongCards = belongCards;
    },
    updateBelongCards: (
      state: BelongState,
      action: PayloadAction<UpdateBelong[]>,
    ) => {
      const updateBelongs = action.payload;
      const belongCards = { ...state.belongCards };
      for (const updateBelong of updateBelongs) {
        const { generalUniqueId } = updateBelong;
        const merged = mergeBelongCard(
          belongCards[generalUniqueId],
          updateBelong,
        );
        if (merged == null) {
          delete belongCards[generalUniqueId];
        } else {
          belongCards[generalUniqueId] = merged;
        }
      }
      state.belongCards = belongCards;
    },
    setBelongCards: (
      state: BelongState,
      action: PayloadAction<BelongCards>,
    ) => {
      state.belongCards = action.payload;
    },
  },
});

export const belongReducer = slice.reducer;
export const belongActions = slice.actions;
