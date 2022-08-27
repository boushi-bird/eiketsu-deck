import { useCallback, useDeferredValue, useMemo, useState } from 'react';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { BelongCtrl } from '@/components/layouts/BelongCtrl';
import { DeckCard } from '@/components/parts/DeckCard';
import { DeckTotal } from '@/components/parts/DeckTotal';
import { TotalCost } from '@/components/parts/TotalCost';
import { TwitterShareButton } from '@/components/parts/TwitterShareButton';
import {
  activeDeckTabIndexSelector,
  datalistSelector,
  deckCurrentSelector,
  editModeSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { deckActions } from '@/modules/deck';
import { windowActions } from '@/modules/window';
import { excludeUndef } from '@/utils/excludeUndef';
import { localStorageAvailable } from '@/utils/storageAvailable';

const switchStyleClasses = ['minimum', 'small', 'normal', 'large', 'ex-large'];

const lsAvailable = localStorageAvailable();

export const DeckBoard = () => {
  const dispatch = useAppDispatch();
  const [switchStyle, setSwitchStyle] = useState(2);
  const [showOtherDeckCardActions, setShowOtherDeckCardActions] =
    useState(false);
  const [selectedUniqueId, setSelectedUniqueId] = useState<string | undefined>(
    undefined
  );

  const datalistState = useAppSelector(datalistSelector);
  const activeDeckTabIndex = useAppSelector(activeDeckTabIndexSelector);
  const deckCurrent = useAppSelector(deckCurrentSelector);
  const editMode = useAppSelector(editModeSelector);
  const [deckCount, setDeckCount] = useState(deckCurrent.cards.length);

  if (deckCount !== deckCurrent.cards.length) {
    setDeckCount(deckCurrent.cards.length);
    setSelectedUniqueId(undefined);
  }

  const { generals } = datalistState;
  const { cards: deckCards, constraints: deckConstraints } =
    useDeferredValue(deckCurrent);

  const handleOpenDeckConfig = useCallback(() => {
    dispatch(windowActions.openDeckConfig());
  }, [dispatch]);

  const handleOpenBelongCtrl = useCallback(() => {
    if (!lsAvailable) {
      return;
    }
    dispatch(windowActions.changeEditMode('belong'));
  }, [dispatch]);

  const handleDeckClear = useCallback(() => {
    // TODO: confirmのコンポーネント作る
    if (window.confirm('現在デッキに選択中のカードをすべてクリアします。')) {
      dispatch(deckActions.clearDeck(activeDeckTabIndex));
    }
  }, [activeDeckTabIndex, dispatch]);

  const handleRemove = useCallback(
    (index: number) => {
      dispatch(
        deckActions.removeDeckGeneral({
          generalIdx: deckCards[index].generalIdx,
          tabIndex: activeDeckTabIndex,
        })
      );
    },
    [deckCards, activeDeckTabIndex, dispatch]
  );

  const handleShowDetail = useCallback(
    (generalIdx: number) => {
      dispatch(windowActions.openGenerailDetail(generalIdx));
    },
    [dispatch]
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
      dispatch(
        deckActions.setDecksWithKey({
          cards: newDeckCards,
          tabIndex: activeDeckTabIndex,
        })
      );
    },
    [deckCards, activeDeckTabIndex, dispatch]
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
  const showSwitchDeckboardItems =
    editMode !== 'belong' && !showOtherDeckCardActions;
  const showUpButton = switchStyle > 0;
  const showDownButton = switchStyle < switchStyleClasses.length - 1;

  const { deckGenerals, costTotal } = useMemo(() => {
    const deckGenerals = deckCards
      .map((card) => generals.find((g) => g.idx === card.generalIdx))
      .filter(excludeUndef);
    const costTotal = deckGenerals.reduce(
      (total, g) => total + g.cost.value,
      0
    );
    return { deckGenerals, costTotal };
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
          <TotalCost {...{ costTotal, costLimit: deckConstraints.costLimit }} />
        </div>
        <div className="deck-card-actions">
          <button
            className="deck-card-action-button square-button"
            title="デッキ設定"
            onClick={handleOpenDeckConfig}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
          <TwitterShareButton />
          <button
            className={classNames('deck-card-action-button', {
              unavailable: !lsAvailable,
            })}
            onClick={useCallback(() => {
              dispatch(windowActions.openDeckSave());
            }, [dispatch])}
          >
            セーブ
          </button>
          <button
            className={classNames('open-other-deck-card-actions', {
              opened: showOtherDeckCardActions,
            })}
            onClick={() => {
              setShowOtherDeckCardActions(!showOtherDeckCardActions);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
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
              {...{ deckGenerals, costTotal, deckConstraints, datalistState }}
            />
          </div>
          <div
            className={classNames('switch-deckboard-items', {
              show: showSwitchDeckboardItems,
            })}
          >
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
          <div
            className={classNames('deck-info-mask', {
              show: showOtherDeckCardActions,
            })}
            onClick={() => {
              setShowOtherDeckCardActions(false);
            }}
          />
        </div>
      </div>
      <div
        className={classNames('other-deck-card-actions', {
          show: showOtherDeckCardActions,
        })}
        onClick={() => {
          setShowOtherDeckCardActions(false);
        }}
      >
        <div className="other-deck-card-actions-bg" />
        <div className="other-deck-card-actions-items">
          <div
            className={classNames('other-deck-card-actions-item', {
              disabled: !lsAvailable,
            })}
            onClick={useCallback(() => {
              dispatch(windowActions.openDeckLoad());
            }, [dispatch])}
          >
            ロード
          </div>
          <div
            className={classNames('other-deck-card-actions-item', {
              disabled: !lsAvailable,
            })}
            onClick={handleOpenBelongCtrl}
          >
            所持状態編集
          </div>
          <div
            className="other-deck-card-actions-item"
            onClick={handleDeckClear}
          >
            デッキクリア
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
