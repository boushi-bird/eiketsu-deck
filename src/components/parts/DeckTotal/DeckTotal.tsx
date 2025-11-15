import { memo } from 'react';

import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { TotalCost } from '@/components/parts/TotalCost';
import { TotalCostGraph } from '@/components/parts/TotalCostGraph';
import { TotalKabuki } from '@/components/parts/TotalKabuki';
import { DatalistState } from '@/modules/datalist';
import { Deck } from '@/modules/deck';
import { NO_SKILL } from '@/services/createDatalist';
import { excludeUndef } from '@/utils/excludeUndef';

interface Props {
  deckGenerals: General[];
  costTotal: number;
  deckConstraints: Deck['constraints'];
  datalistState: DatalistState;
}

function totalize<K>(
  deckGenerals: General[],
  data: K[],
  getItem: (g: General) => K,
): { item: K; count: number; cost: number }[] {
  const m = deckGenerals.reduce((v, g) => {
    const item = getItem(g);
    const total = v.get(item);
    if (!total) {
      v.set(item, { cost: g.cost.value, count: 1 });
    } else {
      total.cost += g.cost.value;
      total.count += 1;
    }
    return v;
  }, new Map<K, { count: number; cost: number }>());

  return totalizeByMap(m, data);
}

function totalizeArray<K>(
  deckGenerals: General[],
  data: K[],
  getItems: (g: General) => K[],
): { item: K; count: number; cost: number }[] {
  const m = deckGenerals.reduce((v, g) => {
    const items = getItems(g);
    for (const item of items) {
      const total = v.get(item);
      if (!total) {
        v.set(item, { cost: g.cost.value, count: 1 });
      } else {
        total.cost += g.cost.value;
        total.count += 1;
      }
    }
    return v;
  }, new Map<K, { count: number; cost: number }>());

  return totalizeByMap(m, data);
}

function totalizeByMap<K>(
  m: Map<K, { count: number; cost: number }>,
  data: K[],
): { item: K; count: number; cost: number }[] {
  return data
    .map((d) => {
      const total = m.get(d);
      if (!total) {
        return;
      }
      return {
        ...total,
        item: d,
      };
    })
    .filter(excludeUndef);
}

export const DeckTotal = memo(function Component({
  deckGenerals,
  costTotal,
  datalistState: {
    skills,
    periods,
    generalColors,
    unitTypes,
    kabukiEnabled,
    deckKabukiRanks,
  },
  deckConstraints: { costLimit },
}: Props) {
  const totalStrong = deckGenerals.reduce((total, g) => total + g.strong, 0);
  const totalIntelligence = deckGenerals.reduce(
    (total, g) => total + g.intelligence,
    0,
  );

  const sumSkills = totalizeArray(
    deckGenerals,
    skills.filter((s) => s.idx !== NO_SKILL.idx),
    (g) => g.skills,
  );

  // 時代勢力コスト集計
  const periodsCostDetails = totalize(
    deckGenerals,
    periods,
    (g) => g.period,
  ).map((v) => ({
    key: `${v.item.idx}`,
    name: v.item.name,
    cost: v.cost,
    count: v.count,
  }));
  // 勢力コスト集計
  const generalColorCostDetails = totalize(
    deckGenerals,
    generalColors,
    (g) => g.color,
  ).map((v) => ({
    key: `${v.item.idx}`,
    name: v.item.name,
    cost: v.cost,
    count: v.count,
    bgColor: v.item.thincolor,
  }));

  const sumUnitTypes = totalize(deckGenerals, unitTypes, (g) => g.unitType);

  const totalKabukiPt = deckGenerals.reduce((t, g) => t + (g.kabuki ?? 0), 0);

  // deckKabukiRanks から totalKabukiPt に応じたランクを取得
  const getCurrentRank = () => {
    if (!deckKabukiRanks || deckKabukiRanks.length === 0) {
      return { label: '', nextPt: 0 };
    }

    // lowの値でソート(昇順)
    const sortedRanks = [...deckKabukiRanks].sort((a, b) => a.low - b.low);

    // totalKabukiPt 以下で最も高いランクを検索
    const currentRank =
      sortedRanks
        .slice()
        .reverse()
        .find((rank) => rank.low <= totalKabukiPt) || sortedRanks[0];

    // 次のランクまでの必要ポイント数を計算(次がなければ nextPt = 0)
    const nextRank = sortedRanks.find((rank) => rank.low > totalKabukiPt);
    const nextPt = nextRank ? nextRank.low - totalKabukiPt : 0;

    return { label: currentRank.name, nextPt };
  };

  const { label: kabukiRankLabel, nextPt: nextKabukiPt } = getCurrentRank();

  return (
    <div className="deck-total">
      <div
        className={classNames('total-costs-area', {
          ['show-kabuki-total']: kabukiEnabled,
        })}
      >
        <div className="total-area">
          <TotalCost {...{ costTotal, costLimit }} />
          {kabukiEnabled && (
            <TotalKabuki
              {...{
                kabukiPt: totalKabukiPt,
                kabukiRankLabel,
                nextKabukiPt,
              }}
            />
          )}
        </div>
        <div className="cost-graph">
          <TotalCostGraph
            costTotal={Math.max(costTotal, costLimit)}
            costDetails={generalColorCostDetails}
            noCostLabel="勢力コスト"
          />
          <TotalCostGraph
            costTotal={Math.max(costTotal, costLimit)}
            costDetails={periodsCostDetails}
            noCostLabel="時代勢力コスト"
          />
        </div>
      </div>
      <div className="total-params">
        <div className="total" data-label="総武力">
          {totalStrong}
        </div>
        <div className="total" data-label="総知力">
          {totalIntelligence}
        </div>
        <div className="total total-type-counts" data-label="特技合計">
          {sumSkills.map(({ item, count, cost }) => {
            return (
              <div key={item.idx} className="type-count">
                <span className="skill">{item.shortName}</span>×{count}(
                {cost / 10}
                <span className="cost-label">コスト</span>)
              </div>
            );
          })}
        </div>
        <div className="total total-type-counts" data-label="兵種合計">
          {sumUnitTypes.map(({ item, count, cost }) => {
            return (
              <div key={item.idx} className="type-count">
                <span className="unit">{item.shortName}</span>×{count}(
                {cost / 10}
                <span className="cost-label">コスト</span>)
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
