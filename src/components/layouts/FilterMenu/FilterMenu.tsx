import { FC, ReactNode, useCallback, useMemo, useState } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { FilterDisplay } from './FilterDisplay';
import { FilterTabBodyBasic } from './FilterTabBodyBasic';
import { FilterTabBodyDetail } from './FilterTabBodyDetail';
import { FilterTabBodyStrat } from './FilterTabBodyStrat';
import { FilterTabs } from './FilterTabs';

import { SwitchItem } from '@/components/parts/SwitchItem';
import {
  filterSelector,
  useAppDispatch,
  useAppSelector,
  useSelector,
  windowSelector,
} from '@/hooks';
import { filterActions } from '@/modules/filter';
import { windowActions } from '@/modules/window';

const FILTER_TAB_NAMES = {
  BASIC: '基本',
  DETAIL: '詳細',
  STRAT: '計略',
};

type FilterTab = keyof typeof FILTER_TAB_NAMES;

const selectorContainer = createSelector(
  windowSelector,
  (window) => window.openedFilter
);

interface Props {
  children?: ReactNode;
}

export const FilterMenuContainer: FC<Props> = ({ children }) => {
  const open = useSelector(selectorContainer);
  return (
    <div className={classNames(['card-filter-container', { open }])}>
      {children}
    </div>
  );
};

const filterMenuSelector = createSelector(
  filterSelector,
  ({ selectionMode }) => selectionMode
);

export const FilterMenu = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>('BASIC');

  const dispatch = useAppDispatch();

  const selectionMode = useAppSelector(filterMenuSelector);

  const handleChangeActiveFilterTab = useCallback((tab: string) => {
    setActiveTab(tab as FilterTab);
  }, []);

  const handleResetConditions = useCallback(() => {
    dispatch(filterActions.resetConditions());
  }, []);

  const handleCloseFilter = useCallback(() => {
    dispatch(windowActions.closeFilter());
  }, []);

  return (
    <FilterMenuContainer>
      <div
        className="modal-bg filter-menu-bg"
        onClick={handleCloseFilter}
      ></div>
      <div className="filter-menu">
        <h1 className="filter-title">絞り込みメニュー</h1>
        <button className="filter-close" onClick={handleCloseFilter}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
        <FilterDisplay />
        <div className="filter-buttons">
          <FilterTabs
            tabs={FILTER_TAB_NAMES}
            activeTab={activeTab}
            onTabChanged={handleChangeActiveFilterTab}
          />
          <div className="filter-actions">
            <SwitchItem
              onChange={useCallback((isOn) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'selectionMode',
                    value: isOn ? 'single' : 'multiple',
                  })
                );
              }, [])}
              addtionalClasses={useMemo(() => ['selection-mode'], [])}
              isOn={selectionMode === 'multiple' ? false : true}
              labelOff="複数選択"
              labelOn="単数選択"
            />
            <button
              className="filter-action-button"
              onClick={handleResetConditions}
            >
              リセット
            </button>
          </div>
        </div>

        <div
          className={classNames([
            'filter-content',
            { active: activeTab === 'BASIC' },
          ])}
        >
          <FilterTabBodyBasic />
        </div>

        <div
          className={classNames([
            'filter-content',
            { active: activeTab === 'DETAIL' },
          ])}
        >
          <FilterTabBodyDetail />
        </div>

        <div
          className={classNames([
            'filter-content',
            { active: activeTab === 'STRAT' },
          ])}
        >
          <FilterTabBodyStrat />
        </div>
      </div>
    </FilterMenuContainer>
  );
};
