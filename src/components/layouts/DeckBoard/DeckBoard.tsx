import { useCallback, useDeferredValue, useState } from 'react';

import { faSuitcase } from '@fortawesome/free-solid-svg-icons/faSuitcase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { BelongCtrl } from '@/components/layouts/BelongCtrl';
import { DeckCard } from '@/components/parts/DeckCard';
import { DeckTotal } from '@/components/parts/DeckTotal';
import { TwitterShareButton } from '@/components/parts/TwitterShareButton';
import {
  datalistSelector,
  deckSelector,
  editModeSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { deckActions } from '@/modules/deck';
import { windowActions } from '@/modules/window';
import { excludeUndef } from '@/utils/excludeUndef';
import { localStorageAvailable } from '@/utils/storageAvailable';

const switchStyleClasses = ['minimum', 'small', 'normal', 'large', 'ex-large'];

const editBelongAvailable = localStorageAvailable();

export const DeckBoard = () => {
  const dispatch = useAppDispatch();
  const [switchStyle, setSwitchStyle] = useState(2);

  const datalistState = useAppSelector(datalistSelector);
  const deckState = useAppSelector(deckSelector);
  const editMode = useAppSelector(editModeSelector);

  const { generals } = datalistState;
  const deferredDeckState = useDeferredValue(deckState);
  const { deckCards } = deferredDeckState;

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

  const switchStyleClass =
    editMode === 'belong' ? 'minimum' : switchStyleClasses[switchStyle];
  const showUpButton = switchStyle > 0 && editMode !== 'belong';
  const showDownButton =
    switchStyle < switchStyleClasses.length - 1 && editMode !== 'belong';

  return (
    <div className={classNames('deck-board', switchStyleClass)}>
      <div className="deck-card-actions">
        <TwitterShareButton />
        <button
          className={classNames('deck-card-action-button', 'edit-belong', {
            unavailable: !editBelongAvailable,
          })}
          title="所持状態編集"
          onClick={useCallback(() => {
            dispatch(windowActions.changeEditMode('belong'));
          }, [])}
        >
          <FontAwesomeIcon icon={faSuitcase} />
        </button>
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
                'show-button': showUpButton,
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
                  'show-button': showDownButton,
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
      <div
        className={classNames('belong-ctrl-wrapper', {
          show: editMode === 'belong',
        })}
      >
        <BelongCtrl />
      </div>
    </div>
  );
};
