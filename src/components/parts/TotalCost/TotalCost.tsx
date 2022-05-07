import classNames from 'classnames';

interface CostDetail {
  key: string;
  name: string;
  cost: number;
  count: number;
  bgColor?: string;
}

interface Props {
  totalCost: number;
  costDetails: CostDetail[];
  noCostLabel?: string;
}

export const TotalCost = ({ totalCost, costDetails, noCostLabel }: Props) => {
  return (
    <div className="total-cost">
      {costDetails.length === 0 ? (
        <div className="total-cost-item no-cost">{noCostLabel}</div>
      ) : (
        <></>
      )}
      {costDetails.map((costDetail) => {
        const smallArea = costDetail.cost <= 10;
        const longName = costDetail.name.length >= 4 && smallArea;
        const ratio = (costDetail.cost * 100) / totalCost;

        return (
          <div
            className="total-cost-item"
            style={{ width: `${ratio}%`, backgroundColor: costDetail.bgColor }}
            key={costDetail.key}
          >
            <span
              className={classNames('total-cost-param', 'name', {
                long: longName,
              })}
            >
              {costDetail.name}
            </span>
            <span
              className={classNames('total-cost-param', 'cost', {
                small: smallArea,
              })}
            >
              {costDetail.cost / 10}コスト
            </span>
            <span
              className={classNames('total-cost-param', 'count', {
                small: smallArea,
              })}
            >
              ({costDetail.count}枚)
            </span>
          </div>
        );
      })}
    </div>
  );
};
