// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EIKETSU_DECK_DATA_KEYS = [
  'general',
  'color',
  'period',
  'indexInitial',
  'cardType',
  'cost',
  'generalAppearVer',
  'generalAppearFilterGroup',
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

  type EiketsuDeckDataKeys = (typeof EIKETSU_DECK_DATA_KEYS)[number];

  type EiketsuDeckData = Pick<BaseData, EiketsuDeckDataKeys>;

  interface General {
    readonly uniqueId: string;
    readonly idx: number;
    readonly code: string;
    readonly dsCode: string;
    readonly faceCode: string;
    readonly name: string;
    readonly kana: string;
    readonly color: GeneralColor;
    readonly period: Period;
    readonly appear: string;
    readonly appearNum: number;
    readonly appearSuffix: string;
    readonly appearDetailVersion: GeneralAppearDetailVersion;
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

  interface GeneralAppearVersion {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly details: GeneralAppearDetailVersion[];
  }

  interface GeneralAppearDetailVersion {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
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
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly kana: string;
    readonly mp: number;
    readonly caption: string;
    readonly categories: GeneralStrategyCategory[];
    readonly range: GeneralStrategyRange;
    readonly time: GeneralStrategyTime;
  }

  interface GeneralStrategyCategory {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
  }

  interface GeneralStrategyRange {
    readonly idx: number;
    readonly code: string;
  }

  interface GeneralStrategyTime {
    readonly idx: number;
    readonly name: string;
  }

  interface Illust {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
    readonly displayName: string;
  }

  interface CharacterVoice {
    readonly idx: number;
    readonly code: string;
    readonly name: string;
  }
}
