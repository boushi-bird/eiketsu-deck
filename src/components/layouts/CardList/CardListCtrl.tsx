import { memo, useCallback } from 'react';

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
import { belongActions } from '@/modules/belong';
import { deckActions } from '@/modules/deck';

interface Props {
  general: General;
}

const selectorDeckConstraints = createSelector(
  deckCurrentSelector,
  ({ constraints: { sameCard, generalCardLimit } }) => ({
    sameCard,
    generalCardLimit,
  })
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
  }
);

export const CardListCtrl = memo(function Component({ general }: Props) {
  const dispatch = useAppDispatch();

  const generalIdx = general.idx;

  const { sameCard, generalCardLimit } = useAppSelector(
    selectorDeckConstraints
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

  const belongCount = belongCards[general.uniqueId] || 0;
  const belongChecked = belongCount > 0;

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
              r.stratIdx === general.strat.idx
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
          })
        );
      } else {
        dispatch(
          deckActions.removeDeckGeneral({
            generalIdx,
            tabIndex: activeDeckTabIndex,
          })
        );
      }
    },
    [activeDeckTabIndex]
  );

  const handleAddBelongClick = useCallback(
    (targetChecked: boolean, generalUniqueId: string) => {
      const count = targetChecked ? 1 : 0;
      dispatch(belongActions.updateBelongCard({ generalUniqueId, count }));
    },
    []
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
    </div>
  );
});
