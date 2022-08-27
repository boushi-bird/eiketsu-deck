import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { General } from 'eiketsu-deck';

import { belongCardsSelector, useAppDispatch, useAppSelector } from '@/hooks';
import { belongActions } from '@/modules/belong';
import { windowActions } from '@/modules/window';

interface Props {
  importType: 'belong' | 'not_belong';
  importUniqueIds: string[];
  filteredGenerals: General[];
  onClose: () => void;
}

export type BelongImportConfirmProps = Omit<Props, 'onClose'>;

export const BelongImportConfirm = ({
  importType,
  importUniqueIds,
  filteredGenerals,
  onClose,
}: Props) => {
  const dispatch = useAppDispatch();

  const belongCards = useAppSelector(belongCardsSelector);
  const belongUniqueIds = Object.keys(belongCards);

  // 読み込み対象
  const targetUniqueIds = importUniqueIds.filter((uniqueId) =>
    filteredGenerals.some((g) => g.uniqueId === uniqueId)
  );

  // 所持条件
  const isBelong = (g: General) => {
    const r = targetUniqueIds.includes(g.uniqueId);
    return importType === 'belong' ? r : !r;
  };

  // 所持になる武将
  const belongs = filteredGenerals.filter(
    (g) => isBelong(g) && !belongUniqueIds.includes(g.uniqueId)
  );

  // 未所持になる武将
  const notBelongs = filteredGenerals.filter(
    (g) => !isBelong(g) && belongUniqueIds.includes(g.uniqueId)
  );

  // 各集計数

  // 読み込み武将数
  const readCount = importUniqueIds.length;
  // 絞り込み対象数
  const targetCount = targetUniqueIds.length;
  // 現在の所持数
  const currentBelongCount = belongUniqueIds.length;
  // 変更後の所持数
  const beforeBelongCount =
    belongUniqueIds.length + belongs.length - notBelongs.length;

  // 所持状態になる武将
  const toBelongGenerals =
    belongs.length > 0
      ? belongs.map((b) => `${b.uniqueId} ${b.name}`).join('\n')
      : 'なし';

  // 未所持状態になる武将
  const toNotBelongGenerals =
    notBelongs.length > 0
      ? notBelongs.map((b) => `${b.uniqueId} ${b.name}`).join('\n')
      : 'なし';

  return (
    <div className="modal modal-belong-import-confirm">
      <div className="modal-bg" onClick={onClose} />
      <div className="belong-import-confirm">
        <h1 className="title">インポート確認</h1>
        <div className="belong-import-confirm-inner">
          <div className="count-info">読み込み武将数: {readCount}</div>
          {readCount !== targetCount ? (
            <div className="count-info">(絞り込み対象数: {targetCount})</div>
          ) : (
            <></>
          )}
          <div className="count-info">
            所持数: {currentBelongCount}
            <span>⇒</span>
            {beforeBelongCount}
          </div>
          <div className="belong-list-area">
            <div className="belong-list">
              所持状態になる武将
              <textarea
                className="blong-text"
                readOnly={true}
                value={toBelongGenerals}
              />
            </div>
            <div className="belong-list">
              未所持状態になる武将
              <textarea
                className="blong-text"
                readOnly={true}
                value={toNotBelongGenerals}
              />
            </div>
          </div>
          <div className="belong-modal-actions">
            <button
              className="belong-modal-action run-import"
              onClick={() => {
                const updateBelongs = belongs
                  .map((g) => ({
                    generalUniqueId: g.uniqueId,
                    count: 1,
                  }))
                  .concat(
                    notBelongs.map((g) => ({
                      generalUniqueId: g.uniqueId,
                      count: 0,
                    }))
                  );
                dispatch(belongActions.updateBelongCards(updateBelongs));
                dispatch(
                  windowActions.showToast('所持状態をインポートしました。')
                );
                dispatch(windowActions.closeModal());
              }}
            >
              インポート実行
            </button>
            <button className="belong-modal-action" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};
