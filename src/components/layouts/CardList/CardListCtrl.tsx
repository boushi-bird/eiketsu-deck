import { memo, useCallback } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { CheckBox } from '@/components/parts/CheckBox';
import { deckSelector, useAppDispatch, useAppSelector } from '@/hooks';
import { deckActions } from '@/modules/deck';

// デッキに含まれている武将名idxと計略idx
interface DeckPersonals {
  personalIdx: number;
  stratIdx: number;
}

interface Props {
  general: General;
  deckPersonals: DeckPersonals[];
  deckChecked: boolean;
  deckCardCount: number;
}

const selectorDeckConstraints = createSelector(
  deckSelector,
  ({ deckConstraints: { sameCard, generalCardLimit } }) => ({
    sameCard,
    generalCardLimit,
  })
);

export const CardListCtrl = memo(function Component({
  general,
  deckPersonals,
  deckChecked,
  deckCardCount,
}: Props) {
  const dispatch = useAppDispatch();

  const generalIdx = general.idx;

  const deckConstraints = useAppSelector(selectorDeckConstraints);

  // クリック可能であるか判別
  const clickable =
    deckChecked ||
    (() => {
      // 武将カード上限枚数判別
      if (deckCardCount >= deckConstraints.generalCardLimit) {
        return '';
      }
      // 武将カードの同名カード判別
      if (deckConstraints.sameCard === 'personal-strategy') {
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

  const disabled = clickable !== true;
  const disabledReason = disabled ? clickable : '';

  const handleAddDeckClick = useCallback(
    (targetChecked: boolean, generalIdx: number) => {
      if (targetChecked) {
        dispatch(deckActions.addDeckGeneral({ generalIdx }));
      } else {
        dispatch(deckActions.removeDeckGeneral(generalIdx));
      }
    },
    [deckChecked]
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
          disabled={disabled}
          onClick={handleAddDeckClick}
        >
          デッキ
        </CheckBox>
      </div>
      <div className="card-list-ctrl-item" style={{ display: 'none' }}>
        <CheckBox value={generalIdx} checked={false}>
          所持
        </CheckBox>
      </div>
    </div>
  );
});
