import { useRef, useState } from 'react';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { CheckBox } from '@/components/parts/CheckBox';
import { normalizeFilterValue } from '@/services/filterMenuItems';
import { genericMemo } from '@/utils/genericMemo';

interface Item<V> {
  key: string;
  name: string;
  value: V;
  searchName: string;
}

interface Props<N extends string, V> {
  itemName: N;
  items: Item<V>[];
  title: string;
  selectedItems: V[];
  onSelectItems: (itemName: N, items: V[]) => void;
}

interface MultiSelectedItemsProps<V> {
  items: Item<V>[];
  selectedItems: V[];
  onRemoveSelectItem: (value: V) => void;
}

const MultiSelectedItems = <V,>({
  items,
  selectedItems,
  onRemoveSelectItem,
}: MultiSelectedItemsProps<V>) => (
  <div className="selected-items">
    {items
      .filter((item) => selectedItems.includes(item.value))
      .map((item) => (
        <div key={item.key} className="selected-item">
          <span className="selected-item-label">{item.name}</span>
          <button
            className="selected-item-remove"
            onClick={() => {
              onRemoveSelectItem(item.value);
            }}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </div>
      ))}
  </div>
);

export const MultiSelect = genericMemo(function Component<N extends string, V>({
  itemName,
  items,
  title,
  selectedItems,
  onSelectItems,
}: Props<N, V>) {
  const scrollArea = useRef<HTMLDivElement>(null);
  const [filterName, setFilterName] = useState('');
  const [modalShown, setModalShown] = useState(false);
  const [pending, setPending] = useState(false);
  const [pendingSelectedItems, setPendingSelectedItems] = useState<V[]>([]);

  const openModal = () => {
    setPending(false);
    setPendingSelectedItems(selectedItems);
    setFilterName('');
    setModalShown(true);
  };

  const closeModal = () => {
    if (pending) {
      onSelectItems(itemName, pendingSelectedItems);
    }
    if (scrollArea.current) {
      scrollArea.current.scrollTop = 0;
    }
    setModalShown(false);
  };

  const onChangePendingSelectItem = (checked: boolean, value: V) => {
    setPending(true);
    setPendingSelectedItems(
      checked
        ? [...pendingSelectedItems, value]
        : pendingSelectedItems.filter((item) => item !== value)
    );
  };

  const onRemoveSelectItem = (value: V) => {
    onSelectItems(
      itemName,
      selectedItems.filter((item) => item !== value)
    );
  };

  return (
    <div className="multi-select">
      <button className="action-button" onClick={openModal}>
        選択
      </button>
      <MultiSelectedItems {...{ items, selectedItems, onRemoveSelectItem }} />
      <div
        className={classNames('selection-modal-container', {
          open: modalShown,
        })}
      >
        <div className="modal-bg selection-modal-bg" onClick={closeModal}></div>
        <div className="selection-modal">
          <h2 className="selection-title">{title}</h2>
          <div className="selection-filter-area">
            <input
              className="filter-name"
              type="search"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <div className="selection-filter-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <div ref={scrollArea} className="selection-items">
            {items
              .filter(
                (item) =>
                  !filterName ||
                  item.searchName.includes(normalizeFilterValue(filterName))
              )
              .map((item) => (
                <div className="selection-item" key={item.key}>
                  <CheckBox
                    value={item.value}
                    checked={pendingSelectedItems.includes(item.value)}
                    onClick={onChangePendingSelectItem}
                  >
                    <span className="selection-item-label">{item.name}</span>
                  </CheckBox>
                </div>
              ))}
          </div>
          <div className="selection-actions">
            <MultiSelectedItems
              items={items}
              selectedItems={pendingSelectedItems}
              onRemoveSelectItem={(value: V) => {
                onChangePendingSelectItem(false, value);
              }}
            />
            <button className="action-button" onClick={closeModal}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
