const EIKETSU_DECK_DATA_KEYS = [
  'general',
  'color',
  'period',
  'indexInitial',
  'cardType',
  'cost',
  'generalRarity',
  'unitType',
  'skill',
  'strat',
  'stratCategory',
  'stratRange',
  'stratTime',
  'illust',
  'illustView',
  'cv',
] as const;

declare module 'eiketsu-deck' {
  import type { BaseData } from '@boushi-bird/eiketsu-taisen-net-datalist';

  type EiketsuDeckDataKeys = typeof EIKETSU_DECK_DATA_KEYS[number];

  type EiketsuDeckData = Pick<BaseData, EiketsuDeckDataKeys>;

  interface General {
    readonly uniqueId: string;
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly kana: string;
    readonly color: GeneralColor;
    readonly period: Period;
    readonly appear: string;
    readonly appearNum: number;
    readonly appearSuffix: string;
    readonly cardType: CardType;
    readonly cost: GeneralCost;
    readonly rarity: GeneralRarity;
    readonly unitType: UnitType;
    readonly personalIdx: number;
    readonly strong: number;
    readonly intelligence: number;
    readonly skills: Skill[];
    readonly strat: GeneralStrategy;
    readonly illust: Illust;
    readonly cv: CharacterVoice;
  }

  interface GeneralColor {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly color: string;
    readonly thincolor: string;
  }

  interface Period {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
  }

  interface CardType {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly shortName: string;
  }

  interface GeneralCost {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly value: number;
  }

  interface GeneralRarity {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly shortName: string;
  }

  interface UnitType {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly shortName: string;
  }

  interface Skill {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly shortName: string;
    readonly caption: string;
  }

  interface GeneralStrategy {
    idx: number;
    code: string;
    name: string;
    kana: string;
    mp: number;
    caption: string;
    categories: GeneralStrategyCategory[];
    range: GeneralStrategyRange;
    time: GeneralStrategyTime;
  }

  interface GeneralStrategyCategory {
    idx: number;
    code: string;
    name: string;
  }

  interface GeneralStrategyRange {
    idx: number;
    code: string;
  }

  interface GeneralStrategyTime {
    idx: number;
    name: string;
  }

  interface Illust {
    idx: number;
    code: string;
    name: string;
    displayName: string;
  }

  interface CharacterVoice {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
  }
}
