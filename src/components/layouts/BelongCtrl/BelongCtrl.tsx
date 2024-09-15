import { useCallback } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faFileExport } from '@fortawesome/free-solid-svg-icons/faFileExport';
import { faFileImport } from '@fortawesome/free-solid-svg-icons/faFileImport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  belongCardsSelector,
  generalsSelector,
  searchedGeneralsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { belongActions } from '@/modules/belong';
import { windowActions } from '@/modules/window';

export const BelongCtrl = () => {
  const dispatch = useAppDispatch();
  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);
  const belongCards = useAppSelector(belongCardsSelector);

  return (
    <div className="belong-ctrl">
      <div className="belong-ctrl-inner">
        <h1 className="title">所持状態編集</h1>
        <div className="belong-actions">
          <button
            className="belong-button"
            onClick={useCallback(() => {
              dispatch(windowActions.openBelongCtrl('belong-export'));
            }, [dispatch])}
          >
            <FontAwesomeIcon
              className="belong-button-icon"
              icon={faFileExport}
            />
            <br />
            エクスポート
          </button>
          <button
            className="belong-button"
            onClick={useCallback(() => {
              dispatch(windowActions.openBelongCtrl('belong-import'));
            }, [dispatch])}
          >
            <FontAwesomeIcon
              className="belong-button-icon"
              icon={faFileImport}
            />
            <br />
            インポート
          </button>
          <div className="belong-all">
            <div className="belong-all-text">現在絞り込んでいる武将を</div>
            <div className="belong-all-buttons">
              <button
                className="belong-button"
                onClick={useCallback(() => {
                  if (
                    !confirm('現在絞り込んでいる武将をすべて所持状態にします。')
                  ) {
                    return;
                  }
                  const updateBelongs = generals
                    .filter(
                      (g) =>
                        searchedGenerals.includes(g.idx) &&
                        belongCards[g.uniqueId] == null,
                    )
                    .map((g) => ({ generalUniqueId: g.uniqueId, count: 1 }));
                  dispatch(belongActions.updateBelongCards(updateBelongs));
                }, [generals, searchedGenerals, belongCards, dispatch])}
              >
                すべて所持
              </button>
              <button
                className="belong-button"
                onClick={useCallback(() => {
                  if (
                    !confirm(
                      '現在絞り込んでいる武将をすべて未所持状態にします。',
                    )
                  ) {
                    return;
                  }
                  const updateBelongs = Object.keys(belongCards).map(
                    (generalUniqueId) => ({
                      generalUniqueId,
                      count: 0,
                    }),
                  );
                  dispatch(belongActions.updateBelongCards(updateBelongs));
                }, [belongCards, dispatch])}
              >
                すべて未所持
              </button>
            </div>
          </div>
          <button
            className="belong-button"
            onClick={useCallback(() => {
              dispatch(windowActions.changeEditMode('deck'));
            }, [dispatch])}
          >
            <FontAwesomeIcon
              className="belong-button-icon"
              icon={faCircleXmark}
            />
            <br />
            編集終了
          </button>
        </div>
      </div>
    </div>
  );
};
