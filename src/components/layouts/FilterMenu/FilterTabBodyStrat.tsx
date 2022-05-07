import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { FilterButtonList } from '@/components/parts/FilterButtonList';
import { NumberSelectRange } from '@/components/parts/NumberSelectRange';
import { SwitchItem } from '@/components/parts/SwitchItem';
import {
  datalistSelector,
  filterSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { SelectionFilterItemName, filterActions } from '@/modules/filter';
import { stratRangeImage } from '@/utils/externalResource';

const filterBasicSelector = createSelector(
  filterSelector,
  ({
    selectionMode,
    generalStrategyMp,
    generalStrategyCategories,
    generalStrategyCategoriesAnd,
    generalStrategyTimes,
    generalStrategyRanges,
  }) => ({
    selectionMode,
    generalStrategyMp,
    generalStrategyCategories,
    generalStrategyCategoriesAnd,
    generalStrategyTimes,
    generalStrategyRanges,
  })
);

export const FilterTabBodyStrat = () => {
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
        <h2 className="title">必要士気</h2>
        <NumberSelectRange
          max={datalist.generalStrategyMp.max}
          min={datalist.generalStrategyMp.min}
          current={filter.generalStrategyMp}
          onChangeValue={useCallback((value) => {
            dispatch(
              filterActions.setCondition({
                itemName: 'generalStrategyMp',
                value,
              })
            );
          }, [])}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">計略カテゴリー</h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback((value) => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'generalStrategyCategoriesAnd',
                  value,
                })
              );
            }, [])}
            isOn={filter.generalStrategyCategoriesAnd}
            labelOff="OR"
            labelOn="AND"
          />
        </div>
        <FilterButtonList
          itemName="generalStrategyCategories"
          buttonItems={useMemo(() => {
            return datalist.generalStrategyCategories.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
            }));
          }, [datalist.cardTypes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyCategories}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">計略効果時間</h2>
        <FilterButtonList
          itemName="generalStrategyTimes"
          buttonItems={useMemo(() => {
            return datalist.generalStrategyTimes.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
            }));
          }, [datalist.cardTypes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyTimes}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">計略範囲</h2>
        <FilterButtonList
          itemName="generalStrategyRanges"
          addtionalClasses={useMemo(() => ['strategy-range-button'], [])}
          buttonItems={useMemo(() => {
            return datalist.generalStrategyRanges.map((r) => ({
              key: `${r.idx}`,
              name: r.code,
              value: r.idx,
              imageUrl: stratRangeImage(r.code),
            }));
          }, [datalist.cardTypes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyRanges}
          onSelectItems={changeSelectedItem}
        />
      </section>
    </div>
  );
};
