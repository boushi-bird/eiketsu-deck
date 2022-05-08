import { ReactNode } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  datalistSelector,
  filterSelector,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import { filterActions } from '@/modules/filter';
import {
  filterMenuItems,
  filterMenuStratItems,
} from '@/services/filterMenuItems';

export const FilterDisplay = () => {
  const dispatch = useAppDispatch();

  const datalist = useAppSelector(datalistSelector);
  const filter = useAppSelector(filterSelector);

  const items: ReactNode[] = [...filterMenuItems, ...filterMenuStratItems]
    .filter((item) => item.enabled(filter))
    .map((item) => (
      <div className="filter-display-item" key={item.name}>
        {item.name}:{item.label(datalist, filter)}
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
