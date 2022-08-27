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
import { excludeUndef } from '@/utils/excludeUndef';

interface Props {
  onImport: (props: BelongImportConfirmProps) => void;
}

export const BelongImport = ({ onImport }: Props) => {
  const [importText, setImportText] = useState('');
  const [useFilter, setUseFilter] = useState(true);

  const generals = useAppSelector(generalsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);

  const handleImportFileChanged = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        return;
      }
      const file = files[0];
      e.target.value = '';
      if (file.type !== 'text/plain') {
        alert('テキストファイルではありません。');
        return;
      }
      try {
        const text = await file.text();
        setImportText(text);
      } catch (e) {
        console.error(e);
        alert('ファイル読み込みに失敗しました');
      }
    },
    []
  );

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
        <label className="belong-modal-action button-style-label">
          ファイルを読み込む
          <input
            className="button-style-input-file"
            type="file"
            onChange={handleImportFileChanged}
            accept="text/plain"
          />
        </label>
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
            const lines = importText
              .trim()
              .split(/\r\n*|\n/g)
              .filter((l) => l.trim().length > 0);

            const belong = lines.every((l) => !l.includes('[未所持]'));

            const filteredGenerals = generals.filter(
              (g) => !useFilter || searchedGenerals.includes(g.idx)
            );

            const importUniqueIds = lines
              .map((line) => {
                const [readId] = line.trim().split(' ');
                return generals.find((g) => g.uniqueId === readId);
              })
              .filter(excludeUndef)
              .map((g) => g.uniqueId);

            if (importUniqueIds.length === 0) {
              alert('インポートできる形式ではありません');
              return;
            }

            onImport({
              importType: belong ? 'belong' : 'not_belong',
              importUniqueIds,
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
