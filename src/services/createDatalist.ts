import {
  EiketsuDeckData,
  EiketsuDeckDataKabuki,
  General,
  GeneralAppearDetailVersion,
  GeneralAppearVersion,
} from 'eiketsu-deck';

import { KABUKI_RANKS, MAX_KABUKI_RANK } from '@/consts';
import { DatalistState } from '@/modules/datalist';
import { excludeUndef } from '@/utils/excludeUndef';

type PropItems = Omit<
  DatalistState,
  | 'generals'
  | 'strong'
  | 'intelligence'
  | 'strongIntelligenceDiff'
  | 'kabukiPt'
  | 'kabukiRank'
  | 'kabukiEnabled'
  | 'skillsCount'
  | 'generalAppearVersions'
>;
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

function selectKabukiRank(
  cost: General['cost'],
  kabukiPt: number,
): (typeof KABUKI_RANKS)[number] {
  // cost.value= 10 -> 2, 15 -> 3, 20 -> 4, 25 -> 6, 30 -> 8, 35 -> 10, 40 -> 12
  const baseValue =
    cost.value > 20
      ? Math.round(cost.value / 5) * 2 - 4
      : Math.round(cost.value / 5);
  const rankValue = Math.round(kabukiPt / baseValue);
  return KABUKI_RANKS.find((k) => k.rankValue === rankValue) || MAX_KABUKI_RANK;
}

export const createDatalist = (
  data: EiketsuDeckData,
  kabukiData: EiketsuDeckDataKabuki | null,
): DatalistState => {
  const propItems = createPropItems(data, kabukiData);
  const indexInitials = [...data.indexInitial];

  const strongRange = { max: 1, min: 1 };
  const intelligenceRange = { max: 1, min: 1 };
  const strongIntelligenceDiffRange = { max: 0, min: 0 };
  const skillsCountRange = { max: 1, min: 0 };
  const kabukiPtRange = { max: 0, min: 0 };
  const kabukiRankRange = { max: 0, min: 0 };

  const generalAppearFilterGroups: GeneralAppearDetailVersion[] =
    data.generalAppearFilterGroup.map(({ idx, code, name }) => ({
      idx,
      code,
      name,
    }));
  const generalAppearVersions: GeneralAppearVersion[] =
    data.generalAppearVer.map(({ idx, code, name, child_idx_list }) => ({
      idx,
      code,
      name,
      details: generalAppearFilterGroups.filter(({ idx }) =>
        child_idx_list.includes(idx),
      ),
    }));
  // kabukiData から uniqueIdをキーとした 傾奇pt オブジェクト作成
  const kabukiGenerals = kabukiData
    ? Object.fromEntries(
        kabukiData.general.map((general) => {
          const indexInitial = findOrError(
            indexInitials,
            general,
            'index_initial_idx',
          );
          const numberPart = `${general.card_number}`.padStart(3, '0');
          const uniqueId = `${indexInitial.name}${numberPart}`;
          const point = kabukiData.kabuki[0]?.point[general.idx] || 0;
          return [uniqueId, point];
        }),
      )
    : null;

  const generals = data.general.map((general): General => {
    const color = findOrError(propItems.generalColors, general, 'color_idx');
    const period = findOrError(propItems.periods, general, 'period_idx');
    const cardType = findOrError(propItems.cardTypes, general, 'card_type_idx');
    const appearDetailVersion = findOrError(
      generalAppearFilterGroups,
      general,
      'appear_filter_idx',
    );
    const indexInitial = findOrError(
      indexInitials,
      general,
      'index_initial_idx',
    );
    const cost = findOrError(propItems.generalCosts, general, 'cost_idx');
    const rarity = findOrError(
      propItems.generalRarities,
      general,
      'rarity_idx',
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
      'strat_idx',
    );
    const illust = findOrError(propItems.illusts, general, 'illust_idx');
    const cv = findOrError(propItems.characterVoices, general, 'cv_idx');

    const {
      idx,
      code,
      ds_code: dsCode,
      face_code: faceCode,
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
    const strongIntelligenceDiff = strong - intelligence;
    if (strongIntelligenceDiff > strongIntelligenceDiffRange.max) {
      strongIntelligenceDiffRange.max = strong - intelligence;
    } else if (strongIntelligenceDiff < strongIntelligenceDiffRange.min) {
      strongIntelligenceDiffRange.min = strongIntelligenceDiff;
    }
    if (skills.length > skillsCountRange.max) {
      skillsCountRange.max = skills.length;
    }
    const numberPart = `${cardNumber}`.padStart(3, '0');
    const uniqueId = `${indexInitial.name}${numberPart}`;
    const kabuki = kabukiGenerals ? kabukiGenerals[uniqueId] : undefined;
    const kabukiRank =
      kabuki != null && kabukiData ? selectKabukiRank(cost, kabuki) : undefined;
    if (kabuki != null && kabukiRank != null) {
      if (kabuki > kabukiPtRange.max) {
        kabukiPtRange.max = kabuki;
      } else if (kabuki < kabukiPtRange.min) {
        kabukiPtRange.min = kabuki;
      }
      if (kabukiRank.rankValue > kabukiRankRange.max) {
        kabukiRankRange.max = kabukiRank.rankValue;
      } else if (kabukiRank.rankValue < kabukiRankRange.min) {
        kabukiRankRange.min = kabukiRank.rankValue;
      }
    }

    return {
      uniqueId,
      idx,
      code,
      dsCode,
      faceCode,
      name,
      kana,
      color,
      period,
      appear,
      appearNum,
      appearSuffix,
      appearDetailVersion,
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
      kabuki: kabukiRank ? kabuki : undefined,
      kabukiRank,
    };
  });

  const kabukiEnabled = kabukiPtRange.max > 0 && kabukiRankRange.max > 0;

  return {
    ...propItems,
    generalAppearVersions,
    generals,
    strong: strongRange,
    intelligence: intelligenceRange,
    strongIntelligenceDiff: strongIntelligenceDiffRange,
    kabukiPt: kabukiPtRange,
    kabukiRank: kabukiRankRange,
    skillsCount: skillsCountRange,
    kabukiEnabled,
  };
};

const createPropItems = (
  data: EiketsuDeckData,
  kabukiData: EiketsuDeckDataKabuki | null,
): PropItems => ({
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
    }),
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
    }),
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
      }),
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
  deckKabukiRanks: kabukiData?.kabukiRank,
});

const createGeneralStrategyPropItems = (
  data: EiketsuDeckData,
): GeneralStrategyPropItems => {
  const generalStrategyCategories = [...data.stratCategory];
  const generalStrategyRanges = [...data.stratRange];
  const generalStrategyTimes = [...data.stratTime];
  const generalStrategyMp = { max: 1, min: 1 };

  const generalStrategies = data.strat.map((strat) => {
    const {
      idx,
      code,
      name,
      kana,
      mp,
      caption: rawCaption,
      category_idx_list,
    } = strat;
    const categories = category_idx_list
      .map((categoryIdx) =>
        generalStrategyCategories.find(({ idx }) => idx === categoryIdx),
      )
      .filter(excludeUndef);
    const range = findOrError(generalStrategyRanges, strat, 'range_idx');
    const time = findOrError(generalStrategyTimes, strat, 'time_idx');
    if (mp > generalStrategyMp.max) {
      generalStrategyMp.max = mp;
    }
    const caption = rawCaption.replace(/<br\s*\/?>/gi, '\n');

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
  idxName: keyof D,
): T {
  const targetIdx = general[idxName] as unknown;
  const result = array.find(({ idx }) => idx === targetIdx);
  if (!result) {
    throw new Error(`${idxName as unknown}: ${targetIdx} not found.`);
  }
  return result;
}
