import { ChangeEvent, useCallback, useState } from 'react';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { type BelongImportConfirmProps } from './BelongImportConfirm';

import { CheckBox } from '@/components/parts/CheckBox';
import {
  generalsSelector,
  searchedGeneralsSelector,
  useAppSelector,
} from '@/hooks';
import { parseBelongImportText } from '@/utils/belongImportParser';
import { openTextFile } from '@/utils/filePicker';

interface Props {
  onImport: (props: BelongImportConfirmProps) => void;
}

export const BelongImport = ({ onImport }: Props) => {
  const [importText, setImportText] = useState('');
  const [useFilter, setUseFilter] = useState(true);

  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);

  const handleLoadFileClick = useCallback(async () => {
    try {
      const file = await openTextFile();
      if (!file) {
        // キャンセル時は何もしない
        return;
      }
      setImportText(await file.text());
    } catch (e) {
      console.error(e);
      alert('ファイル読み込みに失敗しました');
    }
  }, []);

  return (
    <div className="belong-modal-content-inner">
      <div className="belong-caption">
        <FontAwesomeIcon icon={faCircleInfo} />
        <div className="belong-caption-text">
          他の端末からコピーまたはダウンロードした内容をインポートできます。
          <br />
          「インポート内容」に内容を貼り付けるか、「ファイルを読み込む」を押してファイルを読み込んでください。
          <br />
          その後、「インポート内容読み込み」ボタンを押してください。
        </div>
      </div>
      <div className="belong-options">
        <h1 className="title">インポート条件</h1>
        <CheckBox
          value="only-filter"
          checked={useFilter}
          onClick={useCallback((checked: boolean) => {
            setUseFilter(checked);
          }, [])}
        >
          絞り込みメニューの条件に合う武将にのみ反映
        </CheckBox>
      </div>
      <div className="belong-modal-actions">
        <button
          className="belong-modal-action"
          onClick={useCallback(() => {
            setImportText('');
          }, [])}
        >
          クリア
        </button>
        <button className="belong-modal-action" onClick={handleLoadFileClick}>
          ファイルを読み込む
        </button>
      </div>
      <h1 className="belong-label">インポート内容</h1>
      <textarea
        className="blong-text import-area"
        value={importText}
        placeholder="他の端末でエクスポートした内容を貼り付けてください"
        onChange={useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
          setImportText(e.target.value);
        }, [])}
      />
      <div className="belong-modal-actions">
        <button
          className="belong-modal-action run-import"
          disabled={importText.length === 0}
          onClick={useCallback(() => {
            const parsed = parseBelongImportText(importText);

            if (!parsed) {
              alert('インポートできる形式ではありません');
              return;
            }

            const filteredGenerals = generals.filter(
              (g) => !useFilter || searchedGenerals.includes(g.idx),
            );

            // 存在するuniqueIdのみに絞り込む
            const toValidUniqueIds = (uniqueIds: string[]) =>
              uniqueIds.filter((uniqueId) =>
                generals.some((g) => g.uniqueId === uniqueId),
              );
            const toValidCounts = (counts: { [uniqueId: string]: number }) =>
              Object.fromEntries(
                Object.entries(counts).filter(([uniqueId]) =>
                  generals.some((g) => g.uniqueId === uniqueId),
                ),
              );

            const importUniqueIds = toValidUniqueIds(
              parsed.ownedStateUniqueIds,
            );
            const kizunaCounts = toValidCounts(parsed.kizunaCounts);
            const kokumeiCounts = toValidCounts(parsed.kokumeiCounts);

            // 反映できる内容が1件もない場合はエラーとする
            if (
              importUniqueIds.length === 0 &&
              Object.keys(kizunaCounts).length === 0 &&
              Object.keys(kokumeiCounts).length === 0
            ) {
              alert('インポートできる形式ではありません');
              return;
            }

            onImport({
              importType: parsed.belong ? 'belong' : 'not_belong',
              hasOwnedState: parsed.hasOwnedState,
              importUniqueIds,
              kizunaCounts,
              kokumeiCounts,
              filteredGenerals,
            });
          }, [useFilter, importText, generals, searchedGenerals, onImport])}
        >
          インポート内容読み込み
        </button>
      </div>
    </div>
  );
};
