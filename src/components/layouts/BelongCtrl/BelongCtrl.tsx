import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import {
  belongCardsSelector,
  generalsSelector,
  searchedGeneralsSelector,
  useAppSelector,
} from '@/hooks';
import { belongActions } from '@/modules/belong';
import { windowActions } from '@/modules/window';

export const BelongCtrl = () => {
  const dispatch = useDispatch();
  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);
  const belongCards = useAppSelector(belongCardsSelector);

  return (
    <div className="belong-ctrl">
      <h1>所持状態編集</h1>
      現在絞り込んでいる武将を
      <button
        onClick={useCallback(() => {
          if (!confirm('現在絞り込んでいる武将をすべて所持状態にします。')) {
            return;
          }
          const updateBelongs = generals
            .filter(
              (g) =>
                searchedGenerals.includes(g.idx) &&
                belongCards[g.uniqueId] == null
            )
            .map((g) => ({ generalUniqueId: g.uniqueId, count: 1 }));
          dispatch(belongActions.updateBelongCards(updateBelongs));
        }, [generals, searchedGenerals, belongCards])}
      >
        すべて所持
      </button>
      <button
        onClick={useCallback(() => {
          if (!confirm('現在絞り込んでいる武将をすべて未所持状態にします。')) {
            return;
          }
          const updateBelongs = Object.keys(belongCards).map(
            (generalUniqueId) => ({
              generalUniqueId,
              count: 0,
            })
          );
          dispatch(belongActions.updateBelongCards(updateBelongs));
        }, [belongCards])}
      >
        すべて未所持
      </button>
      <button
        onClick={useCallback(() => {
          dispatch(windowActions.changeEditMode('deck'));
        }, [])}
      >
        編集終了
      </button>
    </div>
  );
};
