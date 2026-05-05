// ゼロ幅スペースを挿入する文字の定義
const WBR_AFTER = ['・']; // この文字の後に挿入
const WBR_BEFORE = ['〔']; // この文字の前に挿入

export function insertWordBreaks(name: string): string {
  const afterPattern = WBR_AFTER.map((c) => c + '(?!\\u200B)').join('|');
  const beforePattern = '(?<!\\u200B)(' + WBR_BEFORE.join('|') + ')';
  return name
    .replace(new RegExp(`(${afterPattern})`, 'g'), '$1\u200B')
    .replace(new RegExp(beforePattern, 'g'), '\u200B$1');
}
