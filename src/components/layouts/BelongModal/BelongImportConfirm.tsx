import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { General } from 'eiketsu-deck';

import { belongCardsSelector, useAppDispatch, useAppSelector } from '@/hooks';
import { UpdateBelong, belongActions, isOwned } from '@/modules/belong';
import { windowActions } from '@/modules/window';

interface Props {
  importType: 'belong' | 'not_belong';
  /** 通常カードの所持状態を更新するか(旧形式や絆・刻銘のみの場合は false) */
  hasOwnedState: boolean;
  importUniqueIds: string[];
  /** 絆カードの枚数(uniqueId → 枚数) */
  kizunaCounts: { [uniqueId: string]: number };
  /** 刻銘カードの枚数(uniqueId → 枚数) */
  kokumeiCounts: { [uniqueId: string]: number };
  filteredGenerals: General[];
  onClose: () => void;
}

export type BelongImportConfirmProps = Omit<Props, 'onClose'>;

/** 表示・差分判定用の状態 */
interface GeneralState {
  owned: boolean;
  kizuna: number | undefined;
  kokumei: number | undefined;
}

/** 状態の文字列表現(未所持 / 所持 / 絆N / 所持 絆N 刻銘N など) */
const formatStateText = ({ owned, kizuna, kokumei }: GeneralState): string => {
  const parts = [
    owned ? '所持' : undefined,
    kizuna ? `絆${kizuna}` : undefined,
    kokumei ? `刻銘${kokumei}` : undefined,
  ].filter((v): v is string => v != null);
  return parts.length > 0 ? parts.join(' ') : '未所持';
};

/** 変更後の状態を、減少した項目が分かる形で分解する */
const formatStateParts = (
  before: GeneralState,
  after: GeneralState,
): { text: string; isDecreased: boolean }[] => {
  const parts = [
    after.owned ? { text: '所持', isDecreased: false } : undefined,
    after.kizuna
      ? {
          text: `絆${after.kizuna}`,
          isDecreased: (before.kizuna ?? 0) > after.kizuna,
        }
      : undefined,
    after.kokumei
      ? {
          text: `刻銘${after.kokumei}`,
          isDecreased: (before.kokumei ?? 0) > after.kokumei,
        }
      : undefined,
  ].filter((v): v is { text: string; isDecreased: boolean } => v != null);

  if (parts.length === 0) {
    // 未所持になる場合、何かを失ったときだけ減少扱いにする
    const isDecreased =
      before.owned || (before.kizuna ?? 0) > 0 || (before.kokumei ?? 0) > 0;
    return [{ text: '未所持', isDecreased }];
  }
  return parts;
};

export const BelongImportConfirm = ({
  importType,
  hasOwnedState,
  importUniqueIds,
  kizunaCounts,
  kokumeiCounts,
  filteredGenerals,
  onClose,
}: Props) => {
  const dispatch = useAppDispatch();

  const belongCards = useAppSelector(belongCardsSelector);

  // 変更後の所持状態。所持状態の指定がないインポートでは現状を維持する
  const isAfterOwned = (g: General) => {
    const current = isOwned(belongCards[g.uniqueId]);
    if (!hasOwnedState) {
      return current;
    }
    const included = importUniqueIds.includes(g.uniqueId);
    return importType === 'belong' ? included : !included;
  };

  // 変更前後で状態に差がある武将のみを対象にする
  const rows = filteredGenerals
    .map((general) => {
      const current = belongCards[general.uniqueId];
      const beforeState: GeneralState = {
        owned: current?.owned ?? false,
        kizuna: current?.kizuna,
        kokumei: current?.kokumei,
      };
      // 絆・刻銘は指定がある武将のみ更新し、指定がなければ現状を維持する
      const afterState: GeneralState = {
        owned: isAfterOwned(general),
        kizuna: kizunaCounts[general.uniqueId] ?? current?.kizuna,
        kokumei: kokumeiCounts[general.uniqueId] ?? current?.kokumei,
      };
      return { general, beforeState, afterState };
    })
    .filter(
      ({ beforeState, afterState }) =>
        formatStateText(beforeState) !== formatStateText(afterState),
    );

  // 各集計数

  const sumBy = (key: 'kizuna' | 'kokumei') =>
    Object.values(belongCards).reduce((sum, c) => sum + (c[key] ?? 0), 0);
  const diffBy = (key: 'kizuna' | 'kokumei') =>
    rows.reduce(
      (sum, r) => sum + ((r.afterState[key] ?? 0) - (r.beforeState[key] ?? 0)),
      0,
    );

  // 現在の所持数
  const currentBelongCount = Object.values(belongCards).filter(isOwned).length;
  // 変更後の所持数
  const afterBelongCount =
    currentBelongCount +
    rows.filter((r) => r.afterState.owned && !r.beforeState.owned).length -
    rows.filter((r) => !r.afterState.owned && r.beforeState.owned).length;

  // 絆・刻銘カードの合計枚数
  const currentKizunaTotal = sumBy('kizuna');
  const currentKokumeiTotal = sumBy('kokumei');
  const afterKizunaTotal = currentKizunaTotal + diffBy('kizuna');
  const afterKokumeiTotal = currentKokumeiTotal + diffBy('kokumei');

  const countInfo = (label: string, before: number, after: number) => (
    <div className="count-info">
      {label}: {before}
      <span>⇒</span>
      <span className={after < before ? 'decreased' : ''}>{after}</span>
    </div>
  );

  return (
    <div className="modal modal-belong-import-confirm">
      <div className="modal-bg" onClick={onClose} />
      <div className="belong-import-confirm">
        <h1 className="title">インポート確認</h1>
        <div className="belong-import-confirm-inner">
          {countInfo('所持数', currentBelongCount, afterBelongCount)}
          {countInfo('絆カード合計', currentKizunaTotal, afterKizunaTotal)}
          {countInfo('刻銘カード合計', currentKokumeiTotal, afterKokumeiTotal)}
          <div className="belong-import-confirm-table-area">
            {rows.length > 0 ? (
              <table className="belong-import-confirm-table">
                <thead>
                  <tr>
                    <th>武将</th>
                    <th>変更前</th>
                    <th>変更後</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ general, beforeState, afterState }) => (
                    <tr key={general.uniqueId}>
                      <td>
                        {general.uniqueId} {general.rarity.shortName}
                        {general.name}
                      </td>
                      <td>{formatStateText(beforeState)}</td>
                      <td>
                        {formatStateParts(beforeState, afterState).map(
                          ({ text, isDecreased }, i) => (
                            <span
                              key={`${text}-${i}`}
                              className={isDecreased ? 'decreased' : ''}
                            >
                              {i > 0 ? ' ' : ''}
                              {text}
                            </span>
                          ),
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-changes">変更はありません</div>
            )}
          </div>
          <div className="belong-modal-actions">
            <button
              className="belong-modal-action run-import"
              disabled={rows.length === 0}
              onClick={() => {
                const updateBelongs: UpdateBelong[] = rows.map(
                  ({ general, afterState }): UpdateBelong => ({
                    generalUniqueId: general.uniqueId,
                    owned: afterState.owned,
                    cardCounts: {
                      kizuna: afterState.kizuna,
                      kokumei: afterState.kokumei,
                    },
                  }),
                );
                dispatch(belongActions.updateBelongCards(updateBelongs));
                dispatch(
                  windowActions.showToast('所持状態をインポートしました。'),
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
