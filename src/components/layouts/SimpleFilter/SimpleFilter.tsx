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
import { windowActions } from '@/modules/window';

const datalistSelectorCurrent = createSelector(
  datalistSelector,
  (datalist) => datalist.generalColors
);

const filterSelectorCurrent = createSelector(
  filterSelector,
  ({ selectionMode, generalColors }) => ({ selectionMode, generalColors })
);

export const SimpleFilter = () => {
  const dispatch = useAppDispatch();
  const generalColors = useAppSelector(datalistSelectorCurrent);
  const { selectionMode, generalColors: filterdGeneralColors } = useAppSelector(
    filterSelectorCurrent
  );

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

  const openFilter = useCallback(() => {
    dispatch(windowActions.openFilter());
  }, []);

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
        <button className="open-filter" onClick={openFilter}>
          絞込
        </button>
      </div>
    </div>
  );
};
