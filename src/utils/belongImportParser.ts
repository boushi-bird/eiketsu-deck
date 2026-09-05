/**
 * 所持状態インポートテキストのパーサー。
 *
 * 新形式(セクション見出しあり)と旧形式(見出しなしの行のみ、または `[未所持]` のみ)の
 * 両方に対応する。旧形式のテキストをインポートした場合、通常カードの所持状態のみが
 * 更新され、絆・刻銘は変化しない。
 */

const SECTION_HEADERS = [
  '[所持]',
  '[未所持]',
  '[絆所持]',
  '[刻銘所持]',
] as const;

type SectionHeader = (typeof SECTION_HEADERS)[number];

const isSectionHeader = (line: string): line is SectionHeader =>
  (SECTION_HEADERS as readonly string[]).includes(line);

export interface ParsedBelongImport {
  /** 所持状態の指定があるか(`[所持]`/`[未所持]`/旧形式のいずれか) */
  hasOwnedState: boolean;
  /** true: ownedStateUniqueIds を所持として扱う、false: 未所持として扱う */
  belong: boolean;
  ownedStateUniqueIds: string[];
  kizunaCounts: { [uniqueId: string]: number };
  kokumeiCounts: { [uniqueId: string]: number };
}

const parseUniqueId = (line: string): string | undefined => {
  const [uniqueId] = line.trim().split(' ');
  return uniqueId || undefined;
};

/** `(ユニークID)(空白)(武将名)(タブ)(枚数)` 形式の行を読み取る */
const parseCountLine = (
  line: string,
): { uniqueId: string; count: number } | undefined => {
  const tabIndex = line.indexOf('\t');
  if (tabIndex < 0) {
    return undefined;
  }
  const head = line.slice(0, tabIndex).trim();
  const countText = line.slice(tabIndex + 1).trim();
  const uniqueId = parseUniqueId(head);
  const count = Number(countText);
  // 枚数は1以上の整数のみ有効。0以下は未所持相当のため取り込まない
  if (!uniqueId || !Number.isInteger(count) || count <= 0) {
    return undefined;
  }
  return { uniqueId, count };
};

/** 旧形式(セクション見出しなし)。`[未所持]` という行があれば未所持リストとして扱う */
const parseLegacyFormat = (lines: string[]): ParsedBelongImport => {
  const belong = lines.every((l) => l !== '[未所持]');
  const ownedStateUniqueIds = lines
    .filter((l) => l !== '[未所持]')
    .map(parseUniqueId)
    .filter((v): v is string => v != null);
  return {
    hasOwnedState: true,
    belong,
    ownedStateUniqueIds,
    kizunaCounts: {},
    kokumeiCounts: {},
  };
};

const parseCountSection = (lines: string[]): { [uniqueId: string]: number } => {
  const counts: { [uniqueId: string]: number } = {};
  for (const line of lines) {
    const parsed = parseCountLine(line);
    if (parsed) {
      counts[parsed.uniqueId] = parsed.count;
    }
  }
  return counts;
};

/**
 * インポートテキストを解析する。
 * 戻り値が undefined の場合は対応していない形式。
 */
export const parseBelongImportText = (
  text: string,
): ParsedBelongImport | undefined => {
  const lines = text
    .trim()
    .split(/\r\n*|\n/g)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return undefined;
  }

  if (!lines.some((l) => isSectionHeader(l.trim()))) {
    return parseLegacyFormat(lines.map((l) => l.trim()));
  }

  const sections = new Map<SectionHeader, string[]>();
  let currentHeader: SectionHeader | undefined;
  for (const line of lines) {
    const trimmed = line.trim();
    if (isSectionHeader(trimmed)) {
      currentHeader = trimmed;
      if (!sections.has(currentHeader)) {
        sections.set(currentHeader, []);
      }
      continue;
    }
    if (!currentHeader) {
      // セクション見出しより前に通常行がある場合は対応していない形式
      return undefined;
    }
    sections.get(currentHeader)?.push(line);
  }

  const belongLines = sections.get('[所持]');
  const notBelongLines = sections.get('[未所持]');

  // [所持]と[未所持]の同時指定は所持状態が矛盾するため対応しない
  if (belongLines != null && notBelongLines != null) {
    return undefined;
  }

  const hasOwnedState = belongLines != null || notBelongLines != null;
  const belong = notBelongLines == null;
  const ownedStateUniqueIds = (belongLines ?? notBelongLines ?? [])
    .map((l) => parseUniqueId(l))
    .filter((v): v is string => v != null);

  return {
    hasOwnedState,
    belong,
    ownedStateUniqueIds,
    kizunaCounts: parseCountSection(sections.get('[絆所持]') ?? []),
    kokumeiCounts: parseCountSection(sections.get('[刻銘所持]') ?? []),
  };
};
