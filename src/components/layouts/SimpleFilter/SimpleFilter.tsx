import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { FilterButtonList } from '@/components/parts/FilterButtonList';
import {
  datalistSelector,
  filterSelector,
  hasBelongCardsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { SelectionFilterItemName, filterActions } from '@/modules/filter';
import { windowActions } from '@/modules/window';

const datalistSelectorCurrent = createSelector(
  datalistSelector,
  (datalist) => datalist.generalColors
);

const filterSelectorCurrent = createSelector(
  filterSelector,
  ({ selectionMode, generalColors, belongFilter }) => ({
    selectionMode,
    generalColors,
    belongFilter,
  })
);

export const SimpleFilter = () => {
  const dispatch = useAppDispatch();
  const generalColors = useAppSelector(datalistSelectorCurrent);
  const {
    selectionMode,
    generalColors: filterdGeneralColors,
    belongFilter,
  } = useAppSelector(filterSelectorCurrent);
  const hasBelongCards = useAppSelector(hasBelongCardsSelector);

  const changeSelectedItem = useCallback(
    (itemName: SelectionFilterItemName, value: number[]) => {
      dispatch(
        filterActions.setCondition({
          itemName,
          value,
        })
      );
    },
    [dispatch]
  );

  const openFilter = useCallback(() => {
    dispatch(windowActions.openFilter());
  }, [dispatch]);

  return (
    <div className="simple-filter">
      <div className="simple-filter-main">
        <section className="simple-filter-section">
          <h2 className="title">勢力</h2>
          <FilterButtonList
            itemName="generalColors"
            buttonItems={useMemo(() => {
              return generalColors.map((r) => ({
                key: `${r.idx}`,
                name: r.name,
                value: r.idx,
                bgColor: r.color,
              }));
            }, [generalColors])}
            selectionMode={selectionMode}
            selectedItems={filterdGeneralColors}
            square={true}
            onSelectItems={changeSelectedItem}
          />
        </section>
        <button
          className={classNames('simple-select-switch', {
            hidden: !hasBelongCards,
          })}
          onClick={useCallback(() => {
            // 押すたびに 所持 -> 未所持 -> 選択なし になる
            const value =
              belongFilter == null || belongFilter == 'all'
                ? 'belong'
                : belongFilter === 'belong'
                ? 'not_belong'
                : undefined;

            dispatch(
              filterActions.setCondition({
                itemName: 'belongFilter',
                value,
              })
            );
          }, [belongFilter, dispatch])}
        >
          <span
            className={classNames('select-item', {
              active: belongFilter === 'belong',
            })}
          >
            所持
          </span>
          <span
            className={classNames('select-item', {
              active: belongFilter === 'not_belong',
            })}
          >
            未所持
          </span>
        </button>
        <button className="open-filter" onClick={openFilter}>
          絞込
        </button>
      </div>
    </div>
  );
};
