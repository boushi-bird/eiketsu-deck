import { useCallback, useMemo } from 'react';

import { createSelector } from '@reduxjs/toolkit';

import { FilterButton } from '@/components/parts/FilterButton';
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
import { NO_SKILL } from '@/services/createDatalist';
import { filterMenuItemNames } from '@/services/filterMenuItems';
import { unitTypeImage } from '@/utils/externalResource';

const filterBasicSelector = createSelector(
  filterSelector,
  ({
    selectionMode,
    generalColors,
    generalCosts,
    unitTypes,
    periods,
    generalRarities,
    skills,
    skillsAnd,
    skillsCount,
    hasSameSkills,
    generalNameSearch,
    generalNameSearchAnd,
  }) => ({
    selectionMode,
    generalColors,
    generalCosts,
    unitTypes,
    periods,
    generalRarities,
    skills,
    skillsAnd,
    skillsCount,
    hasSameSkills,
    generalNameSearch,
    generalNameSearchAnd,
  }),
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
        <h2 className="title">{filterMenuItemNames['generalColors']}</h2>
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
        <h2 className="title">{filterMenuItemNames['periods']}</h2>
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

      <div className="filter-section-group">
        <section className="filter-section">
          <h2 className="title">{filterMenuItemNames['generalCosts']}</h2>
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
          <h2 className="title">{filterMenuItemNames['unitTypes']}</h2>
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
      </div>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['generalRarities']}</h2>
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
        <h2 className="title">{filterMenuItemNames['skills']}</h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'skillsAnd',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
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

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['skillsCount']}</h2>
        <div className="filter-items">
          <NumberSelectRange
            max={datalist.skillsCount.max}
            min={datalist.skillsCount.min}
            current={filter.skillsCount}
            onChangeValue={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'skillsCount',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
          />
          <FilterButton
            selected={filter.hasSameSkills}
            onClick={useCallback(() => {
              dispatch(
                filterActions.setCondition({
                  itemName: 'hasSameSkills',
                  value: !filter.hasSameSkills,
                }),
              );
            }, [dispatch, filter.hasSameSkills])}
          >
            {filterMenuItemNames['hasSameSkills']}
          </FilterButton>
        </div>
      </section>

      <section className="filter-section">
        <h2 className="title">{filterMenuItemNames['generalNameSearch']}</h2>
        <div className="title-button">
          <SwitchItem
            onChange={useCallback(
              (value) => {
                dispatch(
                  filterActions.setCondition({
                    itemName: 'generalNameSearchAnd',
                    value,
                  }),
                );
              },
              [dispatch],
            )}
            isOn={filter.generalNameSearchAnd}
            labelOff="OR"
            labelOn="AND"
          />
        </div>
        <TextSearch
          itemName="generalNameSearch"
          values={filter.generalNameSearch}
          onSelectItems={changeSelectedStringItem}
        />
        <div className="search-caption">
          スペース区切りで{filter.generalNameSearchAnd ? 'AND' : 'OR'}検索
          読み仮名対応
        </div>
      </section>
    </div>
  );
};
