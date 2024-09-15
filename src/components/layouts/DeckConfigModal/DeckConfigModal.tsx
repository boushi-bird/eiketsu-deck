import { useCallback } from 'react';

import { NumberSelect } from '@/components/parts/NumberSelect';
import { RadioButton } from '@/components/parts/RadioButton';
import { DECK_COST_LIMIT } from '@/consts';
import { deckCurrentSelector, useAppDispatch, useAppSelector } from '@/hooks';
import { SameCardConstraint, deckActions } from '@/modules/deck';

interface Props {
  onClose: () => void;
}

export const DeckConfigModal = ({ onClose }: Props) => {
  const { constraints } = useAppSelector(deckCurrentSelector);

  const dispatch = useAppDispatch();

  const handleOnChangeDeckSameCardConstraint = useCallback(
    (value: SameCardConstraint) => {
      dispatch(deckActions.setConstraintSameCard(value));
    },
    [dispatch],
  );

  return (
    <div className="deck-config-modal">
      <h1 className="deck-config-title">デッキ設定</h1>
      <button className="deck-config-close action-button" onClick={onClose}>
        OK
      </button>
      <div className="deck-config-buttons">
        <button
          className="action-button"
          onClick={useCallback(() => {
            dispatch(deckActions.resetConstraints());
          }, [dispatch])}
        >
          リセット
        </button>
      </div>
      <div className="deck-config-content">
        <section className="deck-config-section">
          <h2 className="title">コスト上限</h2>
          <div className="content">
            <NumberSelect
              max={DECK_COST_LIMIT.max}
              min={DECK_COST_LIMIT.min}
              step={DECK_COST_LIMIT.step}
              defaultValue={DECK_COST_LIMIT.defaultValue}
              currentValue={constraints.costLimit}
              displayText={useCallback(
                (i: number, defaultValue: boolean) =>
                  `${i / 10}コスト${defaultValue ? '(通常ルール)' : ''}`,
                [],
              )}
              onChangeValue={useCallback(
                (currentValue?: number) => {
                  const value = currentValue || DECK_COST_LIMIT.defaultValue;
                  dispatch(deckActions.setConstraintCostLimit(value));
                },
                [dispatch],
              )}
            />
          </div>
        </section>
        <section className="deck-config-section">
          <h2 className="title">同名武将 制限</h2>
          <div className="content">
            <RadioButton<SameCardConstraint>
              value="personal"
              checked={constraints.sameCard === 'personal'}
              onClick={handleOnChangeDeckSameCardConstraint}
            >
              <span className="radio-label">
                同名の武将登録不可。(通常ルール)
              </span>
            </RadioButton>
            <RadioButton<SameCardConstraint>
              value="personal-strategy"
              checked={constraints.sameCard === 'personal-strategy'}
              onClick={handleOnChangeDeckSameCardConstraint}
            >
              <span className="radio-label">
                同名の武将登録可。
                <small>ただし同計略の同名武将は登録不可</small>
              </span>
            </RadioButton>
          </div>
        </section>
      </div>
    </div>
  );
};
