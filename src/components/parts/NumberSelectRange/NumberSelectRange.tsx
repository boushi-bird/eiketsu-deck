import { memo, useCallback } from 'react';

import { RequireAtLeastOne } from 'type-fest';

import { NumberSelect } from '@/components/parts/NumberSelect';

interface Props {
  max: number;
  min: number;
  current?: RequireAtLeastOne<{ max?: number; min?: number }>;
  onChangeValue: (
    value?: RequireAtLeastOne<{ max?: number; min?: number }>,
  ) => void;
}

export const NumberSelectRange = memo(function Component({
  max,
  min,
  current,
  onChangeValue,
}: Props) {
  const handleOnChangeBase = useCallback(
    ({ max, min }: { max?: number; min?: number }) => {
      const value =
        max != null ? { max, min } : min != null ? { max, min } : undefined;
      onChangeValue(value);
    },
    [onChangeValue],
  );
  return (
    <div className="number-select-range">
      <NumberSelect
        max={max}
        min={min}
        defaultValue={min}
        currentValue={current?.min}
        onChangeValue={useCallback(
          (currentValue) => {
            const max = current?.max;
            const min = currentValue;
            handleOnChangeBase({ max, min });
          },
          [handleOnChangeBase, current],
        )}
      />
      -
      <NumberSelect
        max={max}
        min={min}
        defaultValue={max}
        currentValue={current?.max}
        onChangeValue={useCallback(
          (currentValue) => {
            const max = currentValue;
            const min = current?.min;
            handleOnChangeBase({ max, min });
          },
          [handleOnChangeBase, current],
        )}
      />
    </div>
  );
});
