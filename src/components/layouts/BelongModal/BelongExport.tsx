import { useCallback, useMemo, useState } from 'react';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import { CheckBox } from '@/components/parts/CheckBox';
import { SwitchItem } from '@/components/parts/SwitchItem';
import {
  belongCardsSelector,
  generalsSelector,
  searchedGeneralsSelector,
  useAppSelector,
} from '@/hooks';
import { windowActions } from '@/modules/window';

export const BelongExport = () => {
  const dispatch = useDispatch();

  const [useFilter, setUseFilter] = useState(true);
  const [showName, setShowName] = useState(true);
  const [exportBelong, setExportBelong] = useState(true);

  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);
  const belongCards = useAppSelector(belongCardsSelector);

  const belongGeneralUniqueIds = Object.entries(belongCards)
    .filter(([, count]) => count > 0)
    .map(([uniqueId]) => uniqueId);

  const exportText =
    (exportBelong ? '' : '[未所持]\n') +
    generals
      .filter((g) => !useFilter || searchedGenerals.includes(g.idx))
      .filter((g) => {
        const has = belongGeneralUniqueIds.includes(g.uniqueId);
        return exportBelong ? has : !has;
      })
      .map((g) =>
        showName ? `${g.uniqueId} ${g.rarity.shortName}${g.name}` : g.uniqueId
      )
      .join('\n');

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
          onClick={useCallback(() => {
            const blob = new Blob([exportText], {
              type: 'text/plain;charset=utf-8',
            });
            const a = document.createElement('a');
            a.download = 'eiketsu-deck-cards.txt';
            a.href = URL.createObjectURL(blob);
            a.click();
          }, [exportText])}
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
