import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { FilterButtonList } from '@/components/parts/FilterButtonList';
import {
  datalistSelector,
  filterSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { SelectionFilterItemName, filterActions } from '@/modules/filter';

const filterBasicSelector = createSelector(
  filterSelector,
  ({ selectionMode, generalRarities, cardTypes }) => ({
    selectionMode,
    generalRarities,
    cardTypes,
  })
);

export const FilterTabBodyDetail = () => {
  const dispatch = useAppDispatch();
  const datalist = useAppSelector(datalistSelector);
  const filter = useAppSelector(filterBasicSelector);

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
