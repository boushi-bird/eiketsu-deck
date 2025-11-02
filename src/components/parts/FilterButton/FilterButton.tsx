import { CSSProperties, ReactNode } from 'react';

import classNames from 'classnames';

interface Props {
  addtionalClasses?: string[];
  selected: boolean;
  children?: ReactNode;
  disabled?: boolean;
  square?: boolean;
  style?: CSSProperties;
  tooltip?: string;
  onClick: () => void;
}

const defaultClasses = ['button', 'filter-item'];

export const FilterButton = ({
  addtionalClasses,
  selected,
  children,
  disabled,
  square,
  style,
  tooltip,
  onClick,
}: Props) => {
  const buttonClasses = addtionalClasses
    ? [...defaultClasses, ...addtionalClasses]
    : defaultClasses;

  return (
    <span className="filter-item-wrapper">
      <span className={classNames('selected-cover', { selected })} />
      <button
        className={classNames(buttonClasses, { selected, square })}
        disabled={disabled}
        style={style}
        title={tooltip}
        onClick={onClick}
      >
        {children}
      </button>
    </span>
  );
};
