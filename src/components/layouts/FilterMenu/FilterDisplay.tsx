import { ReactNode } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  datalistSelector,
  filterSelector,
  hasBelongCardsSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { filterActions } from '@/modules/filter';
import {
  filterMenuItemNames,
  filterMenuItems,
  filterMenuStratItems,
} from '@/services/filterMenuItems';

export const FilterDisplay = () => {
  const dispatch = useAppDispatch();

  const datalist = useAppSelector(datalistSelector);
  const filter = useAppSelector(filterSelector);
  const hasBelongCards = useAppSelector(hasBelongCardsSelector);

  const items: ReactNode[] = [...filterMenuItems, ...filterMenuStratItems]
    .filter((item) => item.enabled({ filter, hasBelongCards }))
    .map((item) => (
      <div className="filter-display-item" key={item.filterItemName}>
        {filterMenuItemNames[item.filterItemName]}:
        {item.label(datalist, filter)}
        <button
          className="filter-display-remove"
          onClick={() => {
            dispatch(filterActions.resetCondition(item.filterItemName));
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      </div>
    ));

  return <div className="filter-display">{items}</div>;
};
