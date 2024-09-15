import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { FilterButtonList } from '@/components/parts/FilterButtonList';
import { NumberSelectRange } from '@/components/parts/NumberSelectRange';
import { SwitchItem } from '@/components/parts/SwitchItem';
import { TextSearch } from '@/components/parts/TextSearch';
import {
  datalistSelector,
  filterSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { SelectionFilterItemName, filterActions } from '@/modules/filter';
import { filterMenuItemNames } from '@/services/filterMenuItems';
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
    generalStrategyNameSearch,
    generalStrategyNameSearchAnd,
    generalStrategyCaptionSearch,
    generalStrategyCaptionSearchAnd,
  }) => ({
    selectionMode,
    generalStrategyMp,
    generalStrategyCategories,
    generalStrategyCategoriesAnd,
    generalStrategyTimes,
    generalStrategyRanges,
    generalStrategyNameSearch,
    generalStrategyNameSearchAnd,
    generalStrategyCaptionSearch,
    generalStrategyCaptionSearchAnd,
  }),
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
        }),
      );
    },
    [dispatch],
  );

  const changeSelectedStringItem = useCallback(
    (itemName: SelectionFilterItemName, value: string[]) => {
      dispatch(
        filterActions.setCondition({
          itemName,
          value,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="filter-content-inner filter-tab-body-basic">
      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['generalStrategyMp']}</h2>
        <NumberSelectRange
          max={datalist.generalStrategyMp.max}
          min={datalist.generalStrategyMp.min}
          current={filter.generalStrategyMp}
          onChangeValue={useCallback(
            (value) => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'generalStrategyMp',
                  value,
                }),
              );
            },
            [dispatch],
          )}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">
          {filterMenuItemNames['generalStrategyNameSearch']}
        </h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'generalStrategyNameSearchAnd',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
            isOn={filter.generalStrategyNameSearchAnd}
            labelOff="OR"
            labelOn="AND"
          />
        </div>
        <TextSearch
          itemName="generalStrategyNameSearch"
          values={filter.generalStrategyNameSearch}
          onSelectItems={changeSelectedStringItem}
        />
        <div className="search-caption">
          スペース区切りで{filter.generalStrategyNameSearchAnd ? 'AND' : 'OR'}
          検索 読み仮名対応
        </div>
      </section>

      <section className="filter-section">
        <h2 className="title">
          {filterMenuItemNames['generalStrategyCaptionSearch']}
        </h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'generalStrategyCaptionSearchAnd',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
            isOn={filter.generalStrategyCaptionSearchAnd}
            labelOff="OR"
            labelOn="AND"
          />
        </div>
        <TextSearch
          itemName="generalStrategyCaptionSearch"
          values={filter.generalStrategyCaptionSearch}
          onSelectItems={changeSelectedStringItem}
        />
        <div className="search-caption">
          スペース区切りで
          {filter.generalStrategyCaptionSearchAnd ? 'AND' : 'OR'}検索
        </div>
      </section>

      <section className="filter-section">
        <h2 className="title">
          {filterMenuItemNames['generalStrategyCategories']}
        </h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'generalStrategyCategoriesAnd',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
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
          }, [datalist.generalStrategyCategories])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyCategories}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['generalStrategyTimes']}</h2>
        <FilterButtonList
          itemName="generalStrategyTimes"
          buttonItems={useMemo(() => {
            return datalist.generalStrategyTimes.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
            }));
          }, [datalist.generalStrategyTimes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyTimes}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">
          {filterMenuItemNames['generalStrategyRanges']}
        </h2>
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
          }, [datalist.generalStrategyRanges])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalStrategyRanges}
          onSelectItems={changeSelectedItem}
        />
      </section>
    </div>
  );
};
