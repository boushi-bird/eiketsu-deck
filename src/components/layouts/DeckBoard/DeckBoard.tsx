import { useCallback, useDeferredValue, useState } from 'react';

import classNames from 'classnames';

import { DeckCard } from '@/components/parts/DeckCard';
import { DeckTotal } from '@/components/parts/DeckTotal';
import {
  datalistSelector,
  deckSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { deckActions } from '@/modules/deck';
import { excludeUndef } from '@/utils/excludeUndef';

const switchStyleClasses = ['minimum', 'small', 'normal', 'large', 'ex-large'];

export const DeckBoard = () => {
  const dispatch = useAppDispatch();
  const [switchStyle, setSwitchStyle] = useState(2);

  const datalistState = useAppSelector(datalistSelector);
  const deckState = useAppSelector(deckSelector);
  const { generals } = datalistState;
  const { deckCards } = deckState;
  const deferredDeckState = useDeferredValue(deckState);

  const handleDeckClear = useCallback(() => {
    // TODO: confirmのコンポーネント作る
    if (window.confirm('現在デッキに選択中のカードをすべてクリアします。')) {
      dispatch(deckActions.clearDeck());
    }
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      dispatch(deckActions.removeDeckGeneral(deckCards[index].generalIdx));
    },
    [deckCards]
  );

  const handleMove = useCallback(
    (index: number, direction: 'left' | 'right') => {
      const leftIndex = direction === 'left' ? index - 1 : index;
      const rightIndex = direction === 'right' ? index + 1 : index;
      if (
        deckCards.length < 2 ||
        leftIndex < 0 ||
        rightIndex < 0 ||
        leftIndex >= deckCards.length ||
        rightIndex >= deckCards.length
      ) {
        return;
      }
      const newDeckCards = [...deckCards];
      const right = deckCards[rightIndex];
      const left = deckCards[leftIndex];
      newDeckCards.splice(leftIndex, 2, right, left);
      dispatch(deckActions.setDecksWithKey(newDeckCards));
    },
    [deckCards]
  );

  const handleSwitchSmaller = useCallback(() => {
    setSwitchStyle((prev) => {
      if (prev === 0) {
        return prev;
      }
      return prev - 1;
    });
  }, []);

  const handleSwitchLarger = useCallback(() => {
    setSwitchStyle((prev) => {
      if (prev >= switchStyleClasses.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  }, []);

  const cards = deckCards
    .map((card, index) => {
      const general = generals.find((g) => g.idx === card.generalIdx);
      if (!general) {
        return undefined;
      }
      const firstCard = index === 0;
      const lastCard = index === deckCards.length - 1;
      return (
        <DeckCard
          key={card.key}
          {...{
            index,
            general,
            enableMoveLeft: !firstCard,
            enableMoveRight: !lastCard,
          }}
          onRemove={handleRemove}
          onMove={handleMove}
        />
      );
    })
    .filter(excludeUndef);

  return (
    <div className={classNames('deck-board', switchStyleClasses[switchStyle])}>
      <div className="deck-card-actions">
        <button
          className="deck-card-action-button deck-clear"
          onClick={handleDeckClear}
        >
          クリア
        </button>
      </div>
      <div className="deck-card-list">
        {cards.length === 0 ? (
          <div className="no-deck">カードを登録してください。</div>
        ) : (
          <></>
        )}
        {cards}
      </div>
      <div className="deck-info">
        <div className="deck-info-inner">
          <div className="deck-info-main">
            <DeckTotal {...{ datalistState, deckState: deferredDeckState }} />
          </div>
          <div className="switch-deckboard-items">
            <button
              className={classNames('switch-deckboard', 'switch-deckboard-up', {
                'show-button': switchStyle > 0,
              })}
              onClick={handleSwitchSmaller}
            >
              <span className="up-icon">
                <span className="icon-inner" />
              </span>
            </button>
            <button
              className={classNames(
                'switch-deckboard',
                'switch-deckboard-down',
                {
                  'show-button': switchStyle < switchStyleClasses.length - 1,
                }
              )}
              onClick={handleSwitchLarger}
            >
              <span className="down-icon">
                <span className="icon-inner" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
