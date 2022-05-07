import { ReactNode, useCallback } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface Props<V> {
  value: V;
  checked: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: (checked: boolean, value: V) => void;
}

export function CheckBox<V>({
  checked,
  disabled,
  value,
  children,
  onClick,
}: Props<V>) {
  const handleClick = useCallback(() => {
    if (disabled || !onClick) {
      return;
    }
    onClick(!checked, value);
  }, [disabled, checked, value, onClick]);
  return (
    <div className={classNames('checkbox', { disabled })} onClick={handleClick}>
      <span className="check-area">
        <FontAwesomeIcon
          className={classNames('check', { checked })}
          icon={faCheck}
        />
      </span>
      {children}
    </div>
  );
}
