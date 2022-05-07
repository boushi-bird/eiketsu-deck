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
import { NO_SKILL } from '@/services/createDatalist';
import { unitTypeImage } from '@/utils/externalResource';

const filterBasicSelector = createSelector(
  filterSelector,
  ({
    selectionMode,
    generalColors,
    generalCosts,
    unitTypes,
    periods,
    strong,
    intelligence,
    skills,
    skillsAnd,
  }) => ({
    selectionMode,
    generalColors,
    generalCosts,
    unitTypes,
    periods,
    strong,
    intelligence,
    skills,
    skillsAnd,
  })
);

export const FilterTabBodyBasic = () => {
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
        <h2 className="title">勢力</h2>
        <FilterButtonList
          itemName="generalColors"
          buttonItems={useMemo(() => {
            return datalist.generalColors.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
              bgColor: r.color,
            }));
          }, [datalist.generalColors])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalColors}
          square={true}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">コスト</h2>
        <FilterButtonList
          itemName="generalCosts"
          buttonItems={useMemo(() => {
            return datalist.generalCosts.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
            }));
          }, [datalist.generalCosts])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.generalCosts}
          square={true}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">兵種</h2>
        <FilterButtonList
          itemName="unitTypes"
          buttonItems={useMemo(() => {
            return datalist.unitTypes.map((r) => ({
              key: `${r.idx}`,
              name: r.shortName,
              value: r.idx,
              tooltip: r.name,
              imageUrl: unitTypeImage(r.code),
            }));
          }, [datalist.unitTypes])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.unitTypes}
          square={true}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">時代</h2>
        <FilterButtonList
          itemName="periods"
          buttonItems={useMemo(() => {
            return datalist.periods.map((r) => ({
              key: `${r.idx}`,
              name: r.name,
              value: r.idx,
            }));
          }, [datalist.periods])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.periods}
          onSelectItems={changeSelectedItem}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">武力</h2>
        <NumberSelectRange
          max={datalist.strong.max}
          min={datalist.strong.min}
          current={filter.strong}
          onChangeValue={useCallback((value) => {
            dispatch(
              filterActions.setCondition({
                itemName: 'strong',
                value,
              })
            );
          }, [])}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">知力</h2>
        <NumberSelectRange
          max={datalist.intelligence.max}
          min={datalist.intelligence.min}
          current={filter.intelligence}
          onChangeValue={useCallback((value) => {
            dispatch(
              filterActions.setCondition({
                itemName: 'intelligence',
                value,
              })
            );
          }, [])}
        />
      </section>

      <section className="filter-section">
        <h2 className="title">特技</h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback((value) => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'skillsAnd',
                  value,
                })
              );
            }, [])}
            isOn={filter.skillsAnd}
            labelOff="OR"
            labelOn="AND"
          />
        </div>
        <FilterButtonList
          itemName="skills"
          buttonItems={useMemo(() => {
            return datalist.skills.map((r) => ({
              key: `${r.idx}`,
              name: r.shortName,
              value: r.idx,
              tooltip: r.name,
              addtionalClasses:
                NO_SKILL.idx === r.idx ? ['no-skill'] : undefined,
            }));
          }, [datalist.skills])}
          selectionMode={filter.selectionMode}
          selectedItems={filter.skills}
          square={true}
          onSelectItems={changeSelectedItem}
        />
      </section>
    </div>
  );
};
