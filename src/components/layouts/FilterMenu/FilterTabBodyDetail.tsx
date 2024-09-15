import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';

import { FilterButtonList } from '@/components/parts/FilterButtonList';
import { MultiSelect } from '@/components/parts/MultiSelect';
import { NumberSelectRange } from '@/components/parts/NumberSelectRange';
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
import {
  filterMenuItemNames,
  normalizeFilterValue,
} from '@/services/filterMenuItems';

const filterBasicSelector = createSelector(
  filterSelector,
  ({
    selectionMode,
    belongFilter,
    strong,
    intelligence,
    appearDetailVersions,
    cardTypes,
    illustrations,
    characterVoices,
  }) => ({
    selectionMode,
    belongFilter,
    strong,
    intelligence,
    appearDetailVersions,
    cardTypes,
    illustrations,
    characterVoices,
  }),
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
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="filter-content-inner filter-tab-body-basic">
      <section
        className={classNames('filter-section', { hidden: !hasBelongCards })}
      >
        <h2 className="title">{filterMenuItemNames['belongFilter']}</h2>
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
            [],
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
          onSelectItems={useCallback(
            (itemName, value) => {
              const belongFilter =
                value.length === 0
                  ? undefined
                  : value.length === 1
                    ? value[0]
                    : 'all';
              dispatch(
                filterActions.setCondition({ itemName, value: belongFilter }),
              );
            },
            [dispatch],
          )}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['strong']}</h2>
        <NumberSelectRange
          max={datalist.strong.max}
          min={datalist.strong.min}
          current={filter.strong}
          onChangeValue={useCallback(
            (value) => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'strong',
                  value,
                }),
              );
            },
            [dispatch],
          )}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['intelligence']}</h2>
        <NumberSelectRange
          max={datalist.intelligence.max}
          min={datalist.intelligence.min}
          current={filter.intelligence}
          onChangeValue={useCallback(
            (value) => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'intelligence',
                  value,
                }),
              );
            },
            [dispatch],
          )}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['appearDetailVersions']}</h2>
        {datalist.generalAppearVersions.map(({ idx, name, details }) => (
          <div key={idx} className="filter-item-group">
            <div className="filter-item-group-title">{name}</div>
            <FilterButtonList
              itemName="appearDetailVersions"
              buttonItems={details.map((r) => ({
                key: `${r.idx}`,
                name: r.name,
                value: r.idx,
                tooltip: r.name,
              }))}
              selectionMode={filter.selectionMode}
              selectedItems={filter.appearDetailVersions}
              onSelectItems={changeSelectedItem}
            />
          </div>
        ))}
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['cardTypes']}</h2>
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

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['illustrations']}</h2>
        <MultiSelect
          itemName="illustrations"
          items={useMemo(() => {
            return datalist.illusts.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
              searchName: normalizeFilterValue(r.name),
            }));
          }, [datalist.illusts])}
          title={filterMenuItemNames['illustrations']}
          selectedItems={filter.illustrations}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['characterVoices']}</h2>
        <MultiSelect
          itemName="characterVoices"
          items={useMemo(() => {
            return datalist.characterVoices.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
              searchName: normalizeFilterValue(r.name),
            }));
          }, [datalist.characterVoices])}
          title={filterMenuItemNames['characterVoices']}
          selectedItems={filter.characterVoices}
          onSelectItems={changeSelectedItem}
        />
      </section>
    </div>
  );
};
