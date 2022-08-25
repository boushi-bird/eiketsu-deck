import { useCallback } from 'react';

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';
import { shallowEqual } from 'react-redux';

import { MAX_DECK_TABS } from '@/consts';
import {
  activeDeckTabIndexSelector,
  deckSelector,
  editModeSelector,
  generalsSelector,
  useAppDispatch,
  useAppSelector,
  windowSelector,
} from '@/hooks';
import { DeckCard, deckActions } from '@/modules/deck';
import { windowActions } from '@/modules/window';
import { excludeUndef } from '@/utils/excludeUndef';

const selector = createSelector(
  windowSelector,
  ({ showNotice, offline, updateReady }) => ({
    showNotice,
    offline,
    updateReady,
  })
);

const selectorDeckTabs = createSelector(deckSelector, ({ deckTabs }) =>
  deckTabs.map((deckTab) => ({
    key: deckTab.key,
    cards: deckTab.cards,
    saved: deckTab.cards.length === 0 || deckTab.cardsSaved,
  }))
);

const createTabName = (generals: General[], cards: DeckCard[]) => {
  const deckCards = cards
    .map((card) => generals.find((g) => g.idx === card.generalIdx))
    .filter(excludeUndef);
  if (deckCards.length === 0) {
    return '[空]';
  }
  const colors = [...new Set(deckCards.map((g) => g.color.name))];
  const colorLabel =
    colors.length <= 2 ? colors.join('') : `${colors.length}色`;
  return `${colorLabel}${deckCards.length}枚`;
};

export const AppHeader = () => {
  const generals = useAppSelector(generalsSelector);
  const editMode = useAppSelector(editModeSelector);
  const { showNotice, offline, updateReady } = useAppSelector(selector);
  const activeDeckTabIndex = useAppSelector(activeDeckTabIndexSelector);
  const deckTabs = useAppSelector(selectorDeckTabs, (a, b) => {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((ai, i) => shallowEqual(ai, b[i]));
  });
  const dispatch = useAppDispatch();

  const handleSideMenuButtonClick = useCallback(() => {
    dispatch(windowActions.openSideMenu());
  }, []);

  const handleCopyrightClick = useCallback(() => {
    dispatch(windowActions.openCopyright());
  }, []);

  const handleAddNewDeckTabClick = useCallback(() => {
    dispatch(deckActions.addDeckTab(false));
  }, []);

  const displayDeckTabs = deckTabs.length > 1 ? deckTabs : [];

  return (
    <div className="app-header">
      <button className="side-menu-button" onClick={handleSideMenuButtonClick}>
        <FontAwesomeIcon icon={faBars} />
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={classNames('notice-icon', {
            show: showNotice,
          })}
        />
      </button>
      <div className="app-header-title">英傑大戦デッキシミュレーター</div>
      <span className="copyright">
        <a onClick={handleCopyrightClick}>&copy;SEGA</a>
      </span>
      {offline && <span className="offline">オフラインで実行中です</span>}
      {updateReady && (
        <button
          className="update-ready"
          onClick={() => {
            location.reload();
          }}
        >
          最新にアップデート
        </button>
      )}
      <div
        className={classNames('deck-tabs', {
          show: editMode === 'deck',
        })}
      >
        {displayDeckTabs.map((deckTab, index) => (
          <div
            key={deckTab.key}
            className={classNames('deck-tab', {
              active: activeDeckTabIndex === index,
            })}
            onClick={() => {
              dispatch(deckActions.changeDeckTab(index));
            }}
          >
            {createTabName(generals, deckTab.cards)}
            {deckTab.saved ? '' : ' *'}
            <button
              className="deck-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: confirmのコンポーネント作る
                if (deckTab.saved || window.confirm('デッキを削除します。')) {
                  dispatch(deckActions.removeDeckTab(index));
                }
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        ))}
        <button
          className={classNames('add-new-deck-tab', {
            active: MAX_DECK_TABS > displayDeckTabs.length,
          })}
          onClick={handleAddNewDeckTabClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
};
