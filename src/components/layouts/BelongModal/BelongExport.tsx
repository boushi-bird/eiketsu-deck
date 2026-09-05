import { useCallback, useMemo, useState } from 'react';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { General } from 'eiketsu-deck';

import { CheckBox } from '@/components/parts/CheckBox';
import { SwitchItem } from '@/components/parts/SwitchItem';
import {
  belongCardsSelector,
  generalsSelector,
  searchedGeneralsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { CardCountKey, isOwned } from '@/modules/belong';
import { windowActions } from '@/modules/window';
import { saveTextFile } from '@/utils/filePicker';

export const BelongExport = () => {
  const dispatch = useAppDispatch();

  const [useFilter, setUseFilter] = useState(true);
  const [showName, setShowName] = useState(true);
  const [exportBelong, setExportBelong] = useState(true);

  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);
  const belongCards = useAppSelector(belongCardsSelector);

  const belongGeneralUniqueIds = Object.entries(belongCards)
    .filter(([, cardCounts]) => isOwned(cardCounts))
    .map(([uniqueId]) => uniqueId);

  const exportGenerals = generals.filter(
    (g) => !useFilter || searchedGenerals.includes(g.idx),
  );

  const generalLabel = (g: General) =>
    showName ? `${g.uniqueId} ${g.rarity.shortName}${g.name}` : g.uniqueId;

  // 通常カードの所持 or 未所持セクション
  const ownedSection =
    (exportBelong ? '[所持]\n' : '[未所持]\n') +
    exportGenerals
      .filter((g) => {
        const has = belongGeneralUniqueIds.includes(g.uniqueId);
        return exportBelong ? has : !has;
      })
      .map(generalLabel)
      .join('\n');

  // 絆・刻銘のセクション。枚数が入力されている武将のみ出力する
  // (未所持相当のエクスポートは行わない)
  const cardCountSection = (header: string, key: CardCountKey) => {
    const lines = exportGenerals
      .map((g) => ({ g, count: belongCards[g.uniqueId]?.[key] }))
      .filter(({ count }) => count != null && count > 0)
      .map(({ g, count }) => `${generalLabel(g)}\t${count}`);
    return lines.length > 0 ? `${header}\n${lines.join('\n')}` : '';
  };

  const exportText = [
    ownedSection,
    cardCountSection('[絆所持]', 'kizuna'),
    cardCountSection('[刻銘所持]', 'kokumei'),
  ]
    .filter((v) => v !== '')
    .join('\n\n');

  return (
    <div className="belong-modal-content-inner">
      <div className="belong-caption">
        <FontAwesomeIcon icon={faCircleInfo} />
        <div className="belong-caption-text">
          所持状態をクリップボードにコピーするか、ファイルでダウンロードできます。
          <br />
          コピーまたはダウンロードした内容は、別の端末にインポートできます。
        </div>
      </div>
      <div className="belong-options">
        <h1 className="title">エクスポート条件</h1>
        <SwitchItem
          onChange={useCallback((isOn) => {
            setExportBelong(!isOn);
          }, [])}
          addtionalClasses={useMemo(() => ['belong-type-switch'], [])}
          isOn={!exportBelong}
          labelOff="所持状態をエクスポート"
          labelOn="未所持状態をエクスポート"
        />
        <CheckBox
          value="only-filter"
          checked={useFilter}
          onClick={useCallback((checked: boolean) => {
            setUseFilter(checked);
          }, [])}
        >
          絞り込みメニューの条件に合う武将のみエクスポート
        </CheckBox>
        <CheckBox
          value="show-name"
          checked={showName}
          onClick={useCallback((checked: boolean) => {
            setShowName(checked);
          }, [])}
        >
          武将名まで表示する
        </CheckBox>
      </div>
      <div className="belong-modal-actions">
        <button
          className="belong-modal-action"
          onClick={useCallback(() => {
            navigator.clipboard.writeText(exportText);
            dispatch(windowActions.showToast('クリップボードにコピーしました'));
          }, [exportText, dispatch])}
        >
          クリップボードにコピー
        </button>
        <button
          className="belong-modal-action"
          onClick={useCallback(async () => {
            try {
              await saveTextFile(exportText, 'eiketsu-deck-cards.txt');
            } catch (e) {
              console.error(e);
              dispatch(windowActions.showToast('ファイル保存に失敗しました'));
            }
          }, [exportText, dispatch])}
        >
          ファイルとしてダウンロード
        </button>
      </div>
      <h1 className="belong-label">エクスポート内容</h1>
      <textarea
        className="blong-text export-area"
        readOnly={true}
        value={exportText}
      />
    </div>
  );
};
