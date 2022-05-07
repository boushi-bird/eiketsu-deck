import { EiketsuDeckData, General } from 'eiketsu-deck';

import { DatalistState } from '@/modules/datalist';
import { excludeUndef } from '@/utils/excludeUndef';

type PropItems = Omit<DatalistState, 'generals' | 'strong' | 'intelligence'>;
type GeneralStrategyPropItems = Pick<
  PropItems,
  | 'generalStrategies'
  | 'generalStrategyCategories'
  | 'generalStrategyRanges'
  | 'generalStrategyTimes'
  | 'generalStrategyMp'
>;

export const NO_SKILL = {
  idx: -35941059,
  code: '無',
  name: '特技なし',
  shortName: '無',
  caption: '特技なし',
};

export const createDatalist = (data: EiketsuDeckData): DatalistState => {
  const propItems = createPropItems(data);
  const indexInitials = [...data.indexInitial];

  const strongRange = { max: 1, min: 1 };
  const intelligenceRange = { max: 1, min: 1 };
  const generals = data.general.map((general): General => {
    const color = findOrError(propItems.generalColors, general, 'color_idx');
    const period = findOrError(propItems.periods, general, 'period_idx');
    const cardType = findOrError(propItems.cardTypes, general, 'card_type_idx');
    const indexInitial = findOrError(
      indexInitials,
      general,
      'index_initial_idx'
    );
    const cost = findOrError(propItems.generalCosts, general, 'cost_idx');
    const rarity = findOrError(
      propItems.generalRarities,
      general,
      'rarity_idx'
    );
    const unitType = findOrError(propItems.unitTypes, general, 'unit_type_idx');
    const skills = [
      propItems.skills.find(({ idx }) => idx === general.skill_0),
      propItems.skills.find(({ idx }) => idx === general.skill_1),
      propItems.skills.find(({ idx }) => idx === general.skill_2),
    ].filter(excludeUndef);
    const strat = findOrError(
      propItems.generalStrategies,
      general,
      'strat_idx'
    );
    const illust = findOrError(propItems.illusts, general, 'illust_idx');
    const cv = findOrError(propItems.characterVoices, general, 'cv_idx');

    const {
      idx,
      code,
      name,
      kana,
      appear_num: appearNum,
      appear_suffix: appearSuffix,
      card_number: cardNumber,
      personal_idx: personalIdx,
      strong,
      intelligence,
    } = general;

    const appear = `第${appearNum}弾-${appearSuffix}`;

    if (strong > strongRange.max) {
      strongRange.max = strong;
    }
    if (intelligence > intelligenceRange.max) {
      intelligenceRange.max = intelligence;
    }
    const numberPart = `${cardNumber}`.padStart(3, '0');
    const uniqueId = `${indexInitial.name}${numberPart}`;

    return {
      uniqueId,
      idx,
      code,
      name,
      kana,
      color,
      period,
      appear,
      appearNum,
      appearSuffix,
      cardType,
      cost,
      rarity,
      unitType,
      personalIdx,
      strong,
      intelligence,
      skills,
      strat,
      illust,
      cv,
    };
  });

  return {
    ...propItems,
    generals,
    strong: strongRange,
    intelligence: intelligenceRange,
  };
};

const createPropItems = (data: EiketsuDeckData): PropItems => ({
  ...createGeneralStrategyPropItems(data),
  generalColors: data.color.map(({ idx, code, name, red, blue, green }) => ({
    idx,
    code,
    name,
    color: `rgb(${red}, ${green}, ${blue})`,
    thincolor: `rgba(${red}, ${green}, ${blue}, 0.2)`,
  })),
  periods: [...data.period],
  cardTypes: data.cardType.map(
    ({ idx, code, name, short_name: shortName }) => ({
      idx,
      code,
      name,
      shortName,
    })
  ),
  generalCosts: data.cost.map(({ idx, code, name }) => ({
    idx,
    code,
    name,
    value: parseFloat(name) * 10,
  })),
  generalRarities: data.generalRarity.map(
    ({ idx, code, name, short_name: shortName }) => ({
      idx,
      code,
      name,
      shortName,
    })
  ),
  unitTypes: data.unitType.map(({ idx, code, name }) => ({
    idx,
    code,
    name,
    shortName: name[0],
  })),
  skills: [
    NO_SKILL,
    ...data.skill.map(
      ({ idx, code, name, short_name: shortName, caption }) => ({
        idx,
        code,
        name,
        shortName,
        caption,
      })
    ),
  ],
  illusts: data.illust.map(({ idx, code, name, view_idx }) => {
    const view = data.illustView.find(({ idx }) => idx === view_idx);
    let displayName = name;
    if (view?.format?.includes('{0}')) {
      displayName = view.format.replace('{0}', name);
    }

    return {
      idx,
      code,
      name,
      displayName,
    };
  }),
  characterVoices: [...data.cv],
});

const createGeneralStrategyPropItems = (
  data: EiketsuDeckData
): GeneralStrategyPropItems => {
  const generalStrategyCategories = [...data.stratCategory];
  const generalStrategyRanges = [...data.stratRange];
  const generalStrategyTimes = [...data.stratTime];
  const generalStrategyMp = { max: 1, min: 1 };

  const generalStrategies = data.strat.map((strat) => {
    const { idx, code, name, kana, mp, caption, category_idx_list } = strat;
    const categories = category_idx_list
      .map((categoryIdx) =>
        generalStrategyCategories.find(({ idx }) => idx === categoryIdx)
      )
      .filter(excludeUndef);
    const range = findOrError(generalStrategyRanges, strat, 'range_idx');
    const time = findOrError(generalStrategyTimes, strat, 'time_idx');
    if (mp > generalStrategyMp.max) {
      generalStrategyMp.max = mp;
    }

    return {
      idx,
      code,
      name,
      kana,
      mp,
      caption,
      categories,
      range,
      time,
    };
  });

  return {
    generalStrategies,
    generalStrategyCategories,
    generalStrategyRanges,
    generalStrategyTimes,
    generalStrategyMp,
  };
};

function findOrError<T extends { idx: number }, D>(
  array: T[],
  general: D,
  idxName: keyof D
): T {
  const targetIdx = general[idxName] as unknown;
  const result = array.find(({ idx }) => idx === targetIdx);
  if (!result) {
    throw new Error(`${idxName}: ${targetIdx} not found.`);
  }
  return result;
}