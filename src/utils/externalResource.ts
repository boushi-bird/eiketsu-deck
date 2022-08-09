import { General } from 'eiketsu-deck';

export const generalImage = (code: string) =>
  `https://image.eiketsu-taisen.net/general/card_small/${code}.jpg`;
export const generalCardDetailImage = (general: General) =>
  `https://image.eiketsu-taisen.net/general/card_ds/${general.dsCode}.jpg`;
export const generalOfficialPageLink = (general: General) =>
  `https://eiketsu-taisen.net/datalist/?v=general&s=general&c=${general.code}`;
export const unitTypeImage = (code: string) =>
  `https://image.eiketsu-taisen.net/unit_type/icon_white/${code}.png`;
export const stratRangeImage = (code: string) =>
  `https://image.eiketsu-taisen.net/strat/range/icon/${code}.png`;
