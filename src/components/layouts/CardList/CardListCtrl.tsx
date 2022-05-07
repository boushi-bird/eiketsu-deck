import { useCallback } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { CheckBox } from '@/components/parts/CheckBox';
import { deckSelector, useAppDispatch, useAppSelector } from '@/hooks';
import { deckActions } from '@/modules/deck';
import { RootState } from '@/store';

interface Props {
  generalIdx: number;
}

// デッキに含まれている武将名idxと計略idxの配列を返す
const selectorWithDeckPersonals = createSelector(
  ({ datalist: { generals }, deck: { deckCards } }: RootState) => ({
    generals,
    deckCards,
  }),
  ({ generals, deckCards }) => {
    const deckGeneralIdxs = deckCards.map((v) => v.generalIdx);

    return {
      generals,
      deckCards,
      deckPersonals: generals
        .filter((general) => {
          return deckGeneralIdxs.includes(general.idx);
        })
        .map(({ personalIdx, strat }) => {
          return { personalIdx, stratIdx: strat.idx };
        }),
    };
  }
);

const selectorDeckConstraints = createSelector(
  deckSelector,
  ({ deckConstraints: { sameCard, generalCardLimit } }) => ({
    sameCard,
    generalCardLimit,
  })
);

export const CardListCtrl = ({ generalIdx }: Props) => {
  const dispatch = useAppDispatch();

  const { generals, deckPersonals, cardCount, checked } = useAppSelector(
    createSelector(
      selectorWithDeckPersonals,
      ({ generals, deckCards, deckPersonals }) => {
        const checked = deckCards.some((d) => d.generalIdx === generalIdx);
        return {
          generals,
          deckPersonals,
          cardCount: deckCards.length,
          checked,
        };
      }
    )
  );
  const deckConstraints = useAppSelector(selectorDeckConstraints);

  // クリック可能であるか判別
  const clickable =
    checked ||
    (() => {
      // 武将カード上限枚数判別
      if (cardCount >= deckConstraints.generalCardLimit) {
        return '';
      }
      const general = generals.find((g) => g.idx === generalIdx);
      if (!general) {
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
      console.log('handleAddDeckClick', { checked, targetChecked, generalIdx });
      if (checked === targetChecked) {
        // 不整合の場合は何もしない
        return;
      }

      if (targetChecked) {
        dispatch(deckActions.addDeckGeneral({ generalIdx }));
      } else {
        dispatch(deckActions.removeDeckGeneral(generalIdx));
      }
    },
    [checked]
  );

  return (
    <div className="card-list-ctrl">
      <div className={classNames('card-list-ctrl-item', { checked })}>
        {disabledReason && (
          <span className="disabled-reason">{disabledReason}</span>
        )}
        <CheckBox
          value={generalIdx}
          checked={checked}
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
};
