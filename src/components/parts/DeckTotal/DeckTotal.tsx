import { memo } from 'react';

import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { TotalCost } from '@/components/parts/TotalCost';
import { DatalistState } from '@/modules/datalist';
import { DeckState } from '@/modules/deck';
import { NO_SKILL } from '@/services/createDatalist';
import { excludeUndef } from '@/utils/excludeUndef';

interface Props {
  datalistState: DatalistState;
  deckState: DeckState;
}

function totalize<K>(
  deckGenerals: General[],
  data: K[],
  getItem: (g: General) => K
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
  getItems: (g: General) => K[]
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
  data: K[]
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
  datalistState: { generals, skills, periods, generalColors, unitTypes },
  deckState: { deckCards, deckConstraints },
}: Props) {
  const deckGenerals = deckCards
    .map((card) => generals.find((g) => g.idx === card.generalIdx))
    .filter(excludeUndef);

  const totalStrong = deckGenerals.reduce((total, g) => total + g.strong, 0);
  const totalIntelligence = deckGenerals.reduce(
    (total, g) => total + g.intelligence,
    0
  );

  const totalCost = deckGenerals.reduce((total, g) => total + g.cost.value, 0);
  let costRemain = totalCost - deckConstraints.limitCost;
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

  const sumSkills = totalizeArray(
    deckGenerals,
    skills.filter((s) => s.idx !== NO_SKILL.idx),
    (g) => g.skills
  );

  // 時代コスト集計
  const periodsCostDetails = totalize(
    deckGenerals,
    periods,
    (g) => g.period
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
    (g) => g.color
  ).map((v) => ({
    key: `${v.item.idx}`,
    name: v.item.name,
    cost: v.cost,
    count: v.count,
    bgColor: v.item.thincolor,
  }));

  const sumUnitTypes = totalize(deckGenerals, unitTypes, (g) => g.unitType);

  return (
    <div className="deck-total">
      <div className="total-costs">
        <div className="cost">
          <div className="total" data-label="総コスト">
            <div className="cost-values">
              <span className="cost-value">{(totalCost / 10).toFixed(1)}</span>
              <span className={classNames('cost-remain', { over, under })}>
                ({costRemainText} {(costRemain / 10).toFixed(1)})
              </span>
            </div>
          </div>
        </div>
        <div className="cost-graph">
          <TotalCost
            totalCost={Math.max(totalCost, deckConstraints.limitCost)}
            costDetails={periodsCostDetails}
            noCostLabel="時代コスト"
          />
          <TotalCost
            totalCost={Math.max(totalCost, deckConstraints.limitCost)}
            costDetails={generalColorCostDetails}
            noCostLabel="勢力コスト"
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
          {sumSkills.map(({ item, count, cost }, i) => {
            return (
              <div key={i} className="type-count">
                <span className="skill">{item.shortName}</span>×{count}(
                {cost / 10}
                <span className="cost-label">コスト</span>)
              </div>
            );
          })}
        </div>
        <div className="total total-type-counts" data-label="兵種合計">
          {sumUnitTypes.map(({ item, count, cost }, i) => {
            return (
              <div key={i} className="type-count">
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
