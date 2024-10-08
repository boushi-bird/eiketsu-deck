import React, { FC, ReactNode, useCallback } from 'react';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import {
  useAppDispatch,
  useAppSelector,
  useSelector,
  windowSelector,
} from '@/hooks';
import { windowActions } from '@/modules/window';
import { unmanagedStore } from '@/store';
import { localStorageAvailable } from '@/utils/storageAvailable';

const selectorContainer = createSelector(
  windowSelector,
  (window) => window.openedSideMenu,
);

const lsAvailable = localStorageAvailable();

interface Props {
  children?: ReactNode;
}

const SideMenuContainer: FC<Props> = ({ children }) => {
  const open = useSelector(selectorContainer);
  const dispatch = useAppDispatch();

  const handleBackgroundClick = useCallback(() => {
    dispatch(windowActions.closeSideMenu());
  }, [dispatch]);

  return (
    <div
      className={classNames('side-menu-container', { open })}
      onClick={handleBackgroundClick}
    >
      {children}
    </div>
  );
};

interface Selectors {
  pwaInstallEnabled: boolean;
  showNotice: boolean;
}

const selector = createSelector(windowSelector, (window) => ({
  pwaInstallEnabled: window.pendingInstallPromptEvent,
  showNotice: window.showNotice,
}));

export const SideMenu = () => {
  const { pwaInstallEnabled, showNotice } = useAppSelector<Selectors>(selector);
  const dispatch = useAppDispatch();

  return (
    <SideMenuContainer>
      <div className="modal-bg side-menu-bg" />
      <div className="side-menu">
        <div className="side-menu-header" />
        <ul className="side-menu-list">
          <li className="side-menu-item">
            <a href="./about.html" target="_blank" rel="noopener noreferrer">
              このツールについて
              <FontAwesomeIcon
                className="external-link-icon"
                icon={faExternalLinkAlt}
              />
            </a>
          </li>
          <li className="side-menu-item">
            <a
              onClick={useCallback(() => {
                dispatch(windowActions.openUpdateInfo());
              }, [dispatch])}
            >
              更新情報
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className={classNames('notice-icon', {
                  show: showNotice,
                })}
              />
            </a>
          </li>
          <li className="side-menu-item">
            <a
              className={classNames({ disabled: !lsAvailable })}
              onClick={useCallback(() => {
                if (!lsAvailable) {
                  return;
                }
                dispatch(dispatch(windowActions.changeEditMode('belong')));
              }, [dispatch])}
            >
              所持状態編集
            </a>
          </li>
          <li className="side-menu-item pwa-install">
            <a
              onClick={useCallback<React.MouseEventHandler>(
                async (e) => {
                  if (pwaInstallEnabled) {
                    await unmanagedStore.installPromptEvent?.prompt();
                    unmanagedStore.installPromptEvent = null;
                  } else {
                    e.stopPropagation();
                  }
                  dispatch(windowActions.clearInstallPromptEvent());
                },
                [pwaInstallEnabled, dispatch],
              )}
              className={classNames({
                disabled: !pwaInstallEnabled,
              })}
            >
              インストールする
            </a>
          </li>
        </ul>
      </div>
    </SideMenuContainer>
  );
};
