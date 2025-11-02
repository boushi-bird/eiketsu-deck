import { useCallback, useState } from 'react';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { KEY_NAME, useLocalStorageDecks } from './useLocalStorageDecks';

import { SavedDeck } from '@/components/parts/SavedDeck';
import { MAX_DECK_TABS, MAX_SAVED_DECK } from '@/consts';
import {
  deckCurrentSelector,
  deckSelector,
  generalsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { deckActions } from '@/modules/deck';
import { queryParamsOptions, queryResync } from '@/modules/querySync';
import { windowActions } from '@/modules/window';

const TAB_NAMES = {
  ['deck-save']: 'セーブ',
  ['deck-load']: 'ロード',
};

type Tab = keyof typeof TAB_NAMES;

interface Props {
  tab: Tab;
  onClose: () => void;
}

const SAVE_PARAMS: Readonly<string[]> = Object.keys(queryParamsOptions).filter(
  (v) => v !== 'dev',
);

const selectorDeckTabCount = createSelector(
  deckSelector,
  ({ deckTabs }) => deckTabs.length,
);

export const DeckSaveLoadModal = ({ tab, onClose }: Props) => {
  const generals = useAppSelector(generalsSelector);
  const deckTabCount = useAppSelector(selectorDeckTabCount);
  const deckCurrent = useAppSelector(deckCurrentSelector);

  const dispatch = useAppDispatch();

  // LocalStorage更新のトリガーとして使用
  const [storageVersion, setStorageVersion] = useState(0);

  // カスタムフックを使用してLocalStorageから保存済みデッキを読み込み
  const savedDecks = useLocalStorageDecks(generals, storageVersion);

  const save = (index: number) => {
    const current = new URLSearchParams(location.search);
    const saveParams = new URLSearchParams();
    for (const [key, value] of current.entries()) {
      if (!value || !SAVE_PARAMS.includes(key)) {
        continue;
      }
      saveParams.set(key, value);
    }
    const queryString = `?${saveParams.toString()}`;
    const newQueryStrings = [...savedDecks.map((d) => d.query)];
    if (index >= 0) {
      newQueryStrings[index] = queryString;
    } else {
      newQueryStrings.unshift(queryString);
    }
    localStorage.setItem(KEY_NAME, JSON.stringify(newQueryStrings));
    dispatch(deckActions.currentDeckToSaved());
    setStorageVersion((v) => v + 1); // useMemoを再計算させる
    dispatch(windowActions.showToast('デッキをセーブしました。'));
    onClose();
  };

  const enableSave = deckCurrent.cards.length > 0;
  const enableNewSave = savedDecks.length < MAX_SAVED_DECK && enableSave;
  const enableLoad =
    deckTabCount < MAX_DECK_TABS || deckCurrent.cards.length === 0;

  return (
    <div className="deck-save-load-modal">
      <div className="deck-save-load-modal-tabs">
        <button
          className={classNames('deck-save-load-modal-tab', {
            active: tab === 'deck-save',
          })}
          onClick={useCallback(() => {
            if (tab === 'deck-save') {
              return;
            }
            dispatch(windowActions.openDeckSave());
          }, [tab, dispatch])}
        >
          {TAB_NAMES['deck-save']}
        </button>
        <button
          className={classNames('deck-save-load-modal-tab', {
            active: tab === 'deck-load',
          })}
          onClick={useCallback(() => {
            if (tab === 'deck-load') {
              return;
            }
            dispatch(windowActions.openDeckLoad());
          }, [tab, dispatch])}
        >
          {TAB_NAMES['deck-load']}
        </button>
      </div>
      <div
        className={classNames('deck-save-load-modal-content', {
          active: tab === 'deck-save',
        })}
      >
        <div
          className={classNames('deck-save-load-modal-caption', {
            warning: !enableSave,
          })}
        >
          <FontAwesomeIcon icon={faCircleInfo} />
          <div className="deck-save-load-modal-caption-text">
            {enableSave
              ? 'デッキをセーブする場所を選択してください。'
              : '空のデッキはセーブできません'}
            <br />
            <small>
              {savedDecks.length} / {MAX_SAVED_DECK}(保存可能デッキ数: 残り
              {MAX_SAVED_DECK - savedDecks.length})
            </small>
          </div>
        </div>
        <div className="deck-save-load-modal-content-inner">
          <div
            className={classNames(
              'saved-deck-record',
              'new-saved-deck-record',
              {
                disabled: !enableNewSave,
              },
            )}
            onClick={() => {
              if (!enableNewSave) {
                return;
              }
              save(-1);
            }}
          >
            New Data
          </div>
          {savedDecks.map((savedDeck) => (
            <div
              className={classNames('saved-deck-record', {
                disabled: !enableSave,
              })}
              key={savedDeck.key}
            >
              <SavedDeck
                cards={savedDeck.cards}
                costLimit={savedDeck.costLimit}
                sameCard={savedDeck.sameCard}
                onClick={() => {
                  if (!enableSave) {
                    return;
                  }
                  if (!confirm('デッキを上書きします。')) {
                    return;
                  }
                  const index = savedDecks.findIndex((d) => d === savedDeck);
                  save(index);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        className={classNames('deck-save-load-modal-content', {
          active: tab === 'deck-load',
        })}
      >
        <div
          className={classNames('deck-save-load-modal-caption', {
            warning: !enableLoad,
          })}
        >
          <FontAwesomeIcon icon={faCircleInfo} />
          <div className="deck-save-load-modal-caption-text">
            {enableLoad
              ? 'ロードするデッキを選んでください。'
              : `${MAX_DECK_TABS}つのデッキを表示中のため、ロードできません。`}
          </div>
        </div>
        <div className="deck-save-load-modal-content-inner">
          {savedDecks.map((savedDeck) => (
            <div
              className={classNames('saved-deck-record', {
                disabled: !enableLoad,
              })}
              key={savedDeck.key}
            >
              <SavedDeck
                cards={savedDeck.cards}
                costLimit={savedDeck.costLimit}
                sameCard={savedDeck.sameCard}
                onClick={() => {
                  if (!enableLoad) {
                    return;
                  }
                  if (deckCurrent.cards.length > 0) {
                    dispatch(deckActions.addDeckTab(true));
                  }
                  history.replaceState(null, '', savedDeck.query);
                  queryResync();
                  dispatch(deckActions.currentDeckToSaved());
                  onClose();
                }}
                onDelete={() => {
                  if (!confirm('デッキを削除します。')) {
                    return;
                  }
                  const newSavedDecks = savedDecks.filter(
                    (d) => d !== savedDeck,
                  );
                  const newQueryStrings = newSavedDecks.map((d) => d.query);
                  localStorage.setItem(
                    KEY_NAME,
                    JSON.stringify(newQueryStrings),
                  );
                  setStorageVersion((v) => v + 1); // useMemoを再計算させる
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};
