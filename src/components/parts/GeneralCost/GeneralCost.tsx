import { memo } from 'react';

interface Props {
  value: number;
}

export const GeneralCost = memo(function Component({ value }: Props) {
  const intValue = Math.round(value);
  const mod = intValue % 10;
  const full = (intValue - mod) / 10;
  const hasHalf = mod > 0;
  const costRound = full + (hasHalf ? 1 : 0);
  const costLess = costRound < 3 ? 3 - costRound : 0;

  return (
    <div className="general-cost">
      {[...Array(full)].map((_, i) => (
        <span className="cost-circle full" key={`full-${i}`} />
      ))}
      {hasHalf ? <span className="cost-circle half" /> : ''}
      {[...Array(costLess)].map((_, i) => (
        <span className="cost-circle cost-less" key={`less-${i}`} />
      ))}
    </div>
  );
});
