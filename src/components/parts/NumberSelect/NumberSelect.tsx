import { ChangeEvent, ReactNode } from 'react';

interface Props {
  min: number;
  max: number;
  defaultValue: number;
  currentValue?: number;
  step?: number;
  displayText?: (value: number, isDefault: boolean) => string;
  onChangeValue: (value?: number) => void;
}

export const NumberSelect = ({
  min,
  max,
  defaultValue,
  currentValue,
  step,
  displayText,
  onChangeValue,
}: Props) => {
  const options: ReactNode[] = [];

  const effectiveStep = step ?? 1;

  for (let i = min; i <= max; i += effectiveStep) {
    const text = displayText ? displayText(i, defaultValue === i) : `${i}`;
    options.push(
      <option key={`option-${i}`} value={i}>
        {text}
      </option>,
    );
  }

  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = parseFloat(event.currentTarget.value);
    onChangeValue(value === defaultValue ? undefined : value);
  };

  const value = currentValue == null ? defaultValue : currentValue;

  return (
    <select className="number-select" value={value} onChange={handleOnChange}>
      {options}
    </select>
  );
};
