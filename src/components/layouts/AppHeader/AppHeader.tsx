import { useCallback } from 'react';

import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector, windowSelector } from '@/hooks';
import { windowActions } from '@/modules/window';

const selector = createSelector(windowSelector, ({ showNotice, offline }) => ({
  showNotice,
  offline,
}));

export const AppHeader = () => {
  const { showNotice, offline } = useAppSelector(selector);
  const dispatch = useAppDispatch();

  const handleSideMenuButtonClick = useCallback(() => {
    dispatch(windowActions.openSideMenu());
  }, []);

  const handleCopyrightClick = useCallback(() => {
    dispatch(windowActions.openCopyright());
  }, []);

  return (
    <div className="app-header">
      <button className="side-menu-button" onClick={handleSideMenuButtonClick}>
        <FontAwesomeIcon icon={faBars} />
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={classNames('notice-icon', {
            show: showNotice,
          })}
        />
      </button>
      <div className="app-header-title">英傑大戦デッキシミュレーター</div>
      <span className="copyright">
        <a onClick={handleCopyrightClick}>&copy;SEGA</a>
      </span>
      <span className={classNames('offline', { show: offline })}>
        オフラインで実行中です
      </span>
    </div>
  );
};
