import { CSSProperties, ReactNode, memo, useCallback } from 'react';

import { FilterButton } from '@/components/parts/FilterButton';
import { FilterSelectionMode } from '@/modules/filter';
import { genericMemo } from '@/utils/genericMemo';

interface ButtonItem<V> {
  key: string;
  name: string;
  value: V;
  tooltip?: string;
  imageUrl?: string;
  bgColor?: string;
  addtionalClasses?: string[];
}

interface Props<N extends string, V> {
  itemName: N;
  buttonItems: ButtonItem<V>[];
  selectedItems: V[];
  addtionalClasses?: string[];
  disabled?: boolean;
  selectionMode: FilterSelectionMode;
  show?: boolean;
  square?: boolean;
  style?: CSSProperties;
  onSelectItems: (itemName: N, items: V[]) => void;
}

const createButtonChild = (name: string, imageUrl?: string): ReactNode => {
  if (!imageUrl) {
    return name;
  }
  return (
    <img
      className="filter-button-image"
      src={imageUrl}
      alt={name}
      loading="lazy"
    />
  );
};

interface FilterButtonItemProps<V> {
  itemKey: string;
  name: string;
  value: V;
  tooltip?: string;
  imageUrl?: string;
  bgColor?: string;
  addtionalClasses?: string[];
  disabled?: boolean;
  selected: boolean;
  square?: boolean;
  buttonStyle?: CSSProperties;
  onToggle: (value: V) => void;
}

const FilterButtonItem = memo(function FilterButtonItem<V>({
  itemKey,
  name,
  value,
  tooltip,
  imageUrl,
  bgColor,
  addtionalClasses,
  disabled,
  selected,
  square,
  buttonStyle,
  onToggle,
}: FilterButtonItemProps<V>) {
  const handleClick = useCallback(() => {
    onToggle(value);
  }, [value, onToggle]);

  const style: CSSProperties = {
    ...(buttonStyle || {}),
  };
  if (bgColor) {
    style.backgroundColor = bgColor;
  }

  const children: ReactNode = createButtonChild(name, imageUrl);

  return (
    <FilterButton
      key={itemKey}
      addtionalClasses={addtionalClasses}
      disabled={disabled}
      selected={selected}
      square={square}
      style={style}
      tooltip={tooltip}
      onClick={handleClick}
    >
      {children}
    </FilterButton>
  );
}) as <V>(props: FilterButtonItemProps<V>) => ReactNode;

export const FilterButtonList = genericMemo(function Component<
  T extends string,
  V,
>({
  itemName,
  buttonItems,
  selectedItems,
  addtionalClasses,
  disabled,
  selectionMode,
  show,
  square,
  style: buttonStyle,
  onSelectItems,
}: Props<T, V>) {
  const handleToggle = useCallback(
    (value: V) => {
      const selected = selectedItems.includes(value);
      const items = selected
        ? selectedItems.filter((item) => item !== value)
        : selectionMode === 'multiple'
          ? [...selectedItems, value]
          : [value];
      onSelectItems(itemName, items);
    },
    [selectedItems, selectionMode, itemName, onSelectItems],
  );

  const buttons: ReactNode[] = buttonItems.map(
    ({
      key,
      name,
      value,
      tooltip,
      imageUrl,
      bgColor,
      addtionalClasses: buttonAddtionalClasses,
    }) => {
      const selected = selectedItems.includes(value);
      const mergedAddtionalClasses = [
        ...(addtionalClasses || []),
        ...(buttonAddtionalClasses || []),
      ];

      return (
        <FilterButtonItem
          key={key}
          itemKey={key}
          name={name}
          value={value}
          tooltip={tooltip}
          imageUrl={imageUrl}
          bgColor={bgColor}
          addtionalClasses={mergedAddtionalClasses}
          disabled={disabled}
          selected={selected}
          square={square}
          buttonStyle={buttonStyle}
          onToggle={handleToggle}
        />
      );
    },
  );

  const style: CSSProperties = {
    display: show != null && !show ? 'none' : undefined,
  };

  return (
    <div className="button-list" style={style}>
      {buttons}
    </div>
  );
});
