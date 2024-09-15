import { CSSProperties, ReactNode } from 'react';

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
      const style: CSSProperties = {
        ...(buttonStyle || {}),
      };
      if (bgColor) {
        style.backgroundColor = bgColor;
      }
      const selected = selectedItems.includes(value);
      const children: ReactNode = createButtonChild(name, imageUrl);

      return (
        <FilterButton
          key={key}
          {...{
            addtionalClasses: [
              ...(addtionalClasses || []),
              ...(buttonAddtionalClasses || []),
            ],
            disabled,
            selected,
            square,
            style,
            tooltip,
          }}
          onClick={() => {
            const items = selected
              ? selectedItems.filter((item) => item !== value)
              : selectionMode === 'multiple'
                ? [...selectedItems, value]
                : [value];
            onSelectItems(itemName, items);
          }}
        >
          {children}
        </FilterButton>
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
