import { memo, useCallback } from 'react';

import { RequireAtLeastOne } from 'type-fest';

import { NumberSelect } from '@/components/parts/NumberSelect';

interface Props {
  max: number;
  min: number;
  current?: RequireAtLeastOne<{ max?: number; min?: number }>;
  displayText?: (value: number, isDefault: boolean) => string;
  /**
   * 上限側で上限値を選んだときに `50+` のように表示する。
   *
   * 上限値を選んだ場合は上限なし(その値以上すべてが対象)として扱われるため、
   * その挙動を表示にも反映するためのオプション。
   * 下限側は通常の値として扱われるため `+` は付かない。
   */
  unlimitedMax?: boolean;
  onChangeValue: (
    value?: RequireAtLeastOne<{ max?: number; min?: number }>,
  ) => void;
}

export const NumberSelectRange = memo(function Component({
  max,
  min,
  current,
  displayText,
  unlimitedMax,
  onChangeValue,
}: Props) {
  const maxDisplayText = useCallback(
    (value: number, isDefault: boolean) => {
      const text = displayText ? displayText(value, isDefault) : `${value}`;
      return unlimitedMax && value >= max ? `${text}+` : text;
    },
    [displayText, unlimitedMax, max],
  );
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
        displayText={displayText}
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
        displayText={maxDisplayText}
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
