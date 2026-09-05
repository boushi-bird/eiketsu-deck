import { ChangeEvent, memo, useCallback } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { CheckBox } from '@/components/parts/CheckBox';
import {
  activeDeckTabIndexSelector,
  belongCardsSelector,
  deckCardsSelector,
  deckCurrentSelector,
  editModeSelector,
  generalsSelector,
  hasBelongCardsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { CardCountKey, belongActions, isOwned } from '@/modules/belong';
import { deckActions } from '@/modules/deck';
import { canHaveKizuna, canHaveKokumei } from '@/utils/ownedCardRules';

interface Props {
  general: General;
}

const selectorDeckConstraints = createSelector(
  deckCurrentSelector,
  ({ constraints: { sameCard, generalCardLimit } }) => ({
    sameCard,
    generalCardLimit,
  }),
);

// デッキに含まれている武将名idxと計略idxの配列を返す
const selectorDeckPersonals = createSelector(
  generalsSelector,
  deckCardsSelector,
  (generals, deckCards) => {
    const deckGeneralIdxs = deckCards.map((v) => v.generalIdx);

    return generals
      .filter((general) => {
        return deckGeneralIdxs.includes(general.idx);
      })
      .map(({ personalIdx, strat }) => {
        return { personalIdx, stratIdx: strat.idx };
      });
  },
);

/** 枚数入力欄の定義。表示可否は canHave 判定で出し分ける */
const CARD_COUNT_ITEMS = [
  { key: 'kizuna', label: '絆', canHave: canHaveKizuna },
  { key: 'kokumei', label: '刻銘', canHave: canHaveKokumei },
] as const satisfies {
  key: CardCountKey;
  label: string;
  canHave: (general: General) => boolean;
}[];

/** 枚数入力欄の最大値 */
const MAX_CARD_COUNT = 9999;

export const CardListCtrl = memo(function Component({ general }: Props) {
  const dispatch = useAppDispatch();

  const generalIdx = general.idx;

  const { sameCard, generalCardLimit } = useAppSelector(
    selectorDeckConstraints,
  );
  const activeDeckTabIndex = useAppSelector(activeDeckTabIndexSelector);
  const deckCards = useAppSelector(deckCardsSelector);
  const editMode = useAppSelector(editModeSelector);
  const belongCards = useAppSelector(belongCardsSelector);
  const hasBelongCards = useAppSelector(hasBelongCardsSelector);
  const belongDisabled = editMode !== 'belong';
  const showBelongCards = hasBelongCards || !belongDisabled;

  const deckPersonals = useAppSelector(selectorDeckPersonals);

  const deckCardCount = deckCards.length;
  const deckChecked = deckCards.some((d) => d.generalIdx === general.idx);

  const belongValue = belongCards[general.uniqueId];
  const belongChecked = isOwned(belongValue);

  // 所持編集モード中のみ枚数入力欄を表示する
  // 絆・刻銘は所持フラグとは独立しているため、所持チェックの有無では出し分けない
  const showCardCounts = editMode === 'belong';

  // クリック可能であるか判別
  const clickable =
    deckChecked ||
    (() => {
      // 武将カード上限枚数判別
      if (deckCardCount >= generalCardLimit) {
        return '';
      }
      // 武将カードの同名カード判別
      if (sameCard === 'personal-strategy') {
        // 武将と計略が一致したときに同名カード扱い
        return (
          !deckPersonals.some(
            (r) =>
              r.personalIdx === general.personalIdx &&
              r.stratIdx === general.strat.idx,
          ) || '同名同計略武将 追加済み'
        );
      }
      // 武将が一致したときに同名カード扱い
      return (
        !deckPersonals.some((r) => r.personalIdx === general.personalIdx) ||
        '同名武将追加済み'
      );
    })();

  const deckDisabled = editMode === 'belong' || clickable !== true;
  const disabledReason = deckDisabled ? clickable : '';

  const handleAddDeckClick = useCallback(
    (targetChecked: boolean, generalIdx: number) => {
      if (targetChecked) {
        dispatch(
          deckActions.addDeckGeneral({
            card: { generalIdx },
            tabIndex: activeDeckTabIndex,
          }),
        );
      } else {
        dispatch(
          deckActions.removeDeckGeneral({
            generalIdx,
            tabIndex: activeDeckTabIndex,
          }),
        );
      }
    },
    [activeDeckTabIndex, dispatch],
  );

  const handleAddBelongClick = useCallback(
    (targetChecked: boolean, generalUniqueId: string) => {
      dispatch(
        belongActions.updateBelongCard({
          generalUniqueId,
          owned: targetChecked,
        }),
      );
    },
    [dispatch],
  );

  const handleChangeCardCount = useCallback(
    (key: CardCountKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const value =
        raw === ''
          ? undefined
          : Math.min(MAX_CARD_COUNT, Math.max(0, Math.trunc(Number(raw))));
      dispatch(
        belongActions.updateBelongCardCount({
          generalUniqueId: general.uniqueId,
          key,
          value,
        }),
      );
    },
    [dispatch, general.uniqueId],
  );

  return (
    <div className="card-list-ctrl">
      <div
        className={classNames('card-list-ctrl-item', { checked: deckChecked })}
      >
        {disabledReason && (
          <span className="disabled-reason">{disabledReason}</span>
        )}
        <CheckBox
          value={generalIdx}
          checked={deckChecked}
          disabled={deckDisabled}
          onClick={handleAddDeckClick}
        >
          デッキ
        </CheckBox>
      </div>
      {showBelongCards && (
        <div
          className={classNames('card-list-ctrl-item', {
            checked: belongChecked,
          })}
        >
          <CheckBox
            value={general.uniqueId}
            checked={belongChecked}
            disabled={belongDisabled}
            onClick={handleAddBelongClick}
          >
            所持
          </CheckBox>
        </div>
      )}
      {showCardCounts && (
        <div className="card-list-ctrl-card-count-area">
          <div
            className="card-list-ctrl-card-count"
            style={{ backgroundColor: general.color.thincolor }}
          >
            {CARD_COUNT_ITEMS.filter(({ canHave }) => canHave(general)).map(
              ({ key, label }) => (
                <label key={key} className="card-count-item">
                  {label}
                  <input
                    className="card-count-input"
                    type="number"
                    max={MAX_CARD_COUNT}
                    min={0}
                    value={belongValue?.[key] ?? ''}
                    onChange={handleChangeCardCount(key)}
                  />
                </label>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
});
