import { ReactNode, memo, useCallback } from 'react';

import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface Props<V> {
  value: V;
  checked: boolean;
  children?: ReactNode;
  onClick?: (value: V) => void;
}

function RadioButtonInner<V = string>({
  value,
  checked,
  children,
  onClick,
}: Props<V>) {
  const handleOnClick = useCallback(() => {
    onClick?.(value);
  }, [value, onClick]);

  return (
    <div className="radio-button" onClick={handleOnClick}>
      <span className="radio-check">
        <FontAwesomeIcon
          className={classNames('radio-icon', { checked })}
          icon={faCircle}
        />
      </span>
      {children}
    </div>
  );
}

// ジェネリック型を保持したままmemoでラップ
export const RadioButton = memo(RadioButtonInner) as typeof RadioButtonInner;
