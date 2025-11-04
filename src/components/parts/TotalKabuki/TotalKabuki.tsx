import { memo } from 'react';

interface Props {
  kabukiPt: number;
  kabukiRankLabel: string;
  nextKabukiPt: number;
}

export const TotalKabuki = memo(function Component({
  kabukiPt,
  kabukiRankLabel,
  nextKabukiPt,
}: Props) {
  return (
    <div className="total-kabuki">
      <div className="total" data-label="傾奇">
        <div className="cost-values">
          <span className="kabuki-rank">
            Rank <span className="kabuki-rank-value">{kabukiRankLabel}</span>
          </span>
          <span className="kabuki-point">
            <span className="kabuki-point-value">{kabukiPt}</span>pt
          </span>
          <span className="next-kabuki-rank">
            次ランク: あと
            <span className="kabuki-point-value">{nextKabukiPt}</span> pt
          </span>
        </div>
      </div>
    </div>
  );
});
