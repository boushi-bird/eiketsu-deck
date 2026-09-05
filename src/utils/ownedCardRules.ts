import { General } from 'eiketsu-deck';

/**
 * 絆カード・刻銘カードを持ちうるかどうかの判定ロジック。
 *
 * これらの排出対象はゲーム側の仕様変更で変わりうるため、判定はこのファイルに集約し、
 * 仕様変更時はここだけを修正すればよいようにしている。
 * 入力欄の出し分け・フィルタ・エクスポート対象判定など、判定が必要な箇所では
 * 個別に条件式を書かず必ずこの関数を経由すること。
 *
 * なお `cardType.code` / `rarity.code` は実データではハッシュ値のため判定に使えない。
 * 意味が読み取れる `name` / `shortName` をキーにしている。
 */

/** 絆カードが存在しないカード種別名 */
const NO_KIZUNA_CARD_TYPE_NAMES: readonly string[] = ['PL'];

/** 刻銘カードが存在するカード種別名 */
const KOKUMEI_CARD_TYPE_NAMES: readonly string[] = ['通常'];

/** 刻銘カードが存在するレアリティ略称 */
const KOKUMEI_RARITY_SHORT_NAMES: readonly string[] = ['ER', 'SR'];

/**
 * 絆カードを持ちうるか。
 * カード種別が PL のカードには絆カードが存在しない。
 */
export const canHaveKizuna = (general: General): boolean =>
  !NO_KIZUNA_CARD_TYPE_NAMES.includes(general.cardType.name);

/**
 * 刻銘カードを持ちうるか。
 * カード種別が通常かつレアリティが ER / SR のカードのみ刻銘カードが存在する。
 */
export const canHaveKokumei = (general: General): boolean =>
  KOKUMEI_CARD_TYPE_NAMES.includes(general.cardType.name) &&
  KOKUMEI_RARITY_SHORT_NAMES.includes(general.rarity.shortName);
