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
import {
  BelongFilter,
  SelectionFilterItemName,
  filterActions,
} from '@/modules/filter';

const filterBasicSelector = createSelector(
  filterSelector,
  ({ selectionMode, belongFilter, generalRarities, cardTypes }) => ({
    selectionMode,
    belongFilter,
    generalRarities,
    cardTypes,
  })
);

export const FilterTabBodyDetail = () => {
  const dispatch = useAppDispatch();
  const datalist = useAppSelector(datalistSelector);
  const filter = useAppSelector(filterBasicSelector);
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
    []
  );

  return (
    <div className="filter-content-inner filter-tab-body-basic">
      <section
        className={classNames('filter-section', { hidden: !hasBelongCards })}
      >
        <h2 className="title">所持状態</h2>
        <FilterButtonList<'belongFilter', BelongFilter>
          itemName="belongFilter"
          buttonItems={useMemo(
            () => [
              {
                key: '0',
                name: '所持',
                value: 'belong',
              },
              {
                key: '1',
                name: '未所持',
                value: 'not_belong',
              },
            ],
            []
          )}
          selectionMode={filter.selectionMode}
          selectedItems={useMemo(() => {
            if (filter.belongFilter == null) {
              return [];
            }
            if (filter.belongFilter === 'all') {
              return ['belong', 'not_belong'];
            }
            return [filter.belongFilter];
          }, [filter.belongFilter])}
          onSelectItems={useCallback((itemName, value) => {
            const belongFilter =
              value.length === 0
                ? undefined
                : value.length === 1
                ? value[0]
                : 'all';
            dispatch(
              filterActions.setCondition({ itemName, value: belongFilter })
            );
          }, [])}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">レアリティ</h2>
        <FilterButtonList
          itemName="generalRarities"
          buttonItems={useMemo(() => {
            return datalist.generalRarities.map((r) => ({
              key: `${r.idx}`,
              name: r.shortName,
              value: r.idx,
              tooltip: r.name,
              addtionalClasses: [
                'rarity-bg',
                `rarity-bg-${r.shortName.toLocaleLowerCase()}`,
              ],
            }));
          }, [datalist.generalRarities])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalRarities}
          square={true}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">カード種別</h2>
        <FilterButtonList
          itemName="cardTypes"
          buttonItems={useMemo(() => {
            return datalist.cardTypes.map((r) => ({
              key: `${r.idx}`,
              name: r.shortName,
              value: r.idx,
              tooltip: r.name,
            }));
          }, [datalist.cardTypes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.cardTypes}
          onSelectItems={changeSelectedItem}
        />
      </section>
    </div>
  );
};
