import { useCallback, useDeferredValue, useMemo, useState } from 'react';

import { faSuitcase } from '@fortawesome/free-solid-svg-icons/faSuitcase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { BelongCtrl } from '@/components/layouts/BelongCtrl';
import { DeckCard } from '@/components/parts/DeckCard';
import { DeckTotal } from '@/components/parts/DeckTotal';
import { TotalCost } from '@/components/parts/TotalCost';
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
  const [selectedUniqueId, setSelectedUniqueId] = useState<string | undefined>(
    undefined
  );

  const datalistState = useAppSelector(datalistSelector);
  const deckState = useAppSelector(deckSelector);
  const editMode = useAppSelector(editModeSelector);
  const [deckCount, setDeckCount] = useState(deckState.deckCards.length);

  if (deckCount !== deckState.deckCards.length) {
    setDeckCount(deckState.deckCards.length);
    setSelectedUniqueId(undefined);
  }

  const { generals } = datalistState;
  const { deckCards, deckConstraints } = useDeferredValue(deckState);

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

  const handleShowDetail = useCallback((generalIdx: number) => {
    dispatch(windowActions.openGenerailDetail(generalIdx));
  }, []);

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

  const handleActiveChanged = useCallback((uniqueId: string) => {
    setSelectedUniqueId(uniqueId);
  }, []);

  const cards = deckCards
    .map((card, index) => {
      const general = generals.find((g) => g.idx === card.generalIdx);
      if (!general) {
        return undefined;
      }
      const firstCard = index === 0;
      const lastCard = index === deckCards.length - 1;
      const active = general.uniqueId === selectedUniqueId;
      return (
        <DeckCard
          key={card.key}
          {...{
            index,
            general,
            active,
            enableMoveLeft: !firstCard,
            enableMoveRight: !lastCard,
          }}
          onActive={handleActiveChanged}
          onShowDetail={handleShowDetail}
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

  const { deckGenerals, totalCost } = useMemo(() => {
    const deckGenerals = deckCards
      .map((card) => generals.find((g) => g.idx === card.generalIdx))
      .filter(excludeUndef);
    const totalCost = deckGenerals.reduce(
      (total, g) => total + g.cost.value,
      0
    );
    return { deckGenerals, totalCost };
  }, [deckCards, generals]);

  return (
    <div
      className={classNames('deck-board', switchStyleClass)}
      onClick={useCallback(() => {
        setSelectedUniqueId(undefined);
      }, [])}
    >
      <div className="deck-card-ctrls">
        <div className="simple-deck-info">
          <TotalCost {...{ totalCost, limitCost: deckConstraints.limitCost }} />
        </div>
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
            <DeckTotal
              {...{ deckGenerals, totalCost, deckConstraints, datalistState }}
            />
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
