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
  const buttonClasses = addtionalClasses
    ? [...defaultClasses, ...addtionalClasses]
    : defaultClasses;

  const handleClick = () => {
    onChange(!isOn);
  };

  return (
    <div className={classNames(buttonClasses)} onClick={handleClick}>
      <div className={classNames('switch-button', { active: !isOn })}>
        <button className="switch-button-child">{labelOff}</button>
      </div>
      <div className={classNames('switch-button', { active: isOn })}>
        <button className="switch-button-child">{labelOn}</button>
      </div>
    </div>
  );
};
