import { memo } from 'react';

import classNames from 'classnames';

interface Props {
  totalCost: number;
  limitCost: number;
}

export const TotalCost = memo(function Component({
  totalCost,
  limitCost,
}: Props) {
  let costRemain = totalCost - limitCost;
  let costRemainText = '残り';
  let over = false;
  let under = false;
  if (costRemain > 0) {
    costRemainText = 'コストオーバー';
    over = true;
  } else if (costRemain < 0) {
    costRemain *= -1;
    under = true;
  }

  return (
    <div className="total-cost">
      <div className="total" data-label="総コスト">
        <div className="cost-values">
          <span className="cost-value">{(totalCost / 10).toFixed(1)}</span>
          <span className={classNames('cost-remain', { over, under })}>
            ({costRemainText} {(costRemain / 10).toFixed(1)})
          </span>
        </div>
      </div>
    </div>
  );
});
