import { useCallback, useState } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faFileExport } from '@fortawesome/free-solid-svg-icons/faFileExport';
import { faFileImport } from '@fortawesome/free-solid-svg-icons/faFileImport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { BelongExport } from './BelongExport';
import { BelongImport } from './BelongImport';
import {
  BelongImportConfirm,
  BelongImportConfirmProps,
} from './BelongImportConfirm';

import { useAppDispatch } from '@/hooks';
import { windowActions } from '@/modules/window';

const TAB_NAMES = {
  ['belong-export']: 'エクスポート',
  ['belong-import']: 'インポート',
};

type Tab = keyof typeof TAB_NAMES;

interface Props {
  tab: Tab;
  onClose: () => void;
}

export const BelongModal = ({ tab, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [belongImportConfirmProps, setBelongImportConfirmProps] = useState<
    BelongImportConfirmProps | undefined
  >(undefined);

  return (
    <div className="belong-modal">
      <div className="belong-modal-tabs">
        <button
          className={classNames('belong-modal-tab', {
            active: tab === 'belong-export',
          })}
          onClick={useCallback(() => {
            if (tab === 'belong-export') {
              return;
            }
            dispatch(windowActions.openBelongCtrl('belong-export'));
          }, [tab, dispatch])}
        >
          <FontAwesomeIcon className="belong-button-icon" icon={faFileExport} />
          {TAB_NAMES['belong-export']}
        </button>
        <button
          className={classNames('belong-modal-tab', {
            active: tab === 'belong-import',
          })}
          onClick={useCallback(() => {
            if (tab === 'belong-import') {
              return;
            }
            dispatch(windowActions.openBelongCtrl('belong-import'));
          }, [tab, dispatch])}
        >
          <FontAwesomeIcon className="belong-button-icon" icon={faFileImport} />
          {TAB_NAMES['belong-import']}
        </button>
      </div>
      <div
        className={classNames('belong-modal-content', {
          active: tab === 'belong-export',
        })}
      >
        <BelongExport />
      </div>
      <div
        className={classNames('belong-modal-content', {
          active: tab === 'belong-import',
        })}
      >
        <BelongImport
          onImport={useCallback((props) => {
            setBelongImportConfirmProps(props);
          }, [])}
        />
      </div>
      <button className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      {belongImportConfirmProps && (
        <BelongImportConfirm
          {...belongImportConfirmProps}
          onClose={() => {
            setBelongImportConfirmProps(undefined);
          }}
        />
      )}
    </div>
  );
};
