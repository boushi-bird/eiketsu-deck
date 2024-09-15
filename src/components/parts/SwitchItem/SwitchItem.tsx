import { useCallback, useMemo } from 'react';

import classNames from 'classnames';

interface Props {
  isOn: boolean;
  labelOff: string;
  labelOn: string;
  addtionalClasses?: string[];
  onChange: (isOn: boolean) => void;
}

const defaultClasses = ['switch-item'];

export const SwitchItem = ({
  isOn,
  labelOff,
  labelOn,
  addtionalClasses,
  onChange,
}: Props) => {
  return (
    <div
      className={classNames(
        useMemo(
          () =>
            addtionalClasses
              ? [...defaultClasses, ...addtionalClasses]
              : defaultClasses,
          [addtionalClasses],
        ),
      )}
      onClick={useCallback(() => {
        onChange(!isOn);
      }, [isOn, onChange])}
    >
      <div className={classNames('switch-button', { active: !isOn })}>
        <button className="switch-button-child">{labelOff}</button>
      </div>
      <div className={classNames('switch-button', { active: isOn })}>
        <button className="switch-button-child">{labelOn}</button>
      </div>
    </div>
  );
};
