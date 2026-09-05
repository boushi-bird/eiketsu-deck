type ShowOpenFilePicker = (options?: {
  multiple?: boolean;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<FileSystemFileHandle[]>;

type ShowSaveFilePicker = (options?: {
  suggestedName?: string;
  types?: { description?: string; accept: Record<string, string[]> }[];
}) => Promise<FileSystemFileHandle>;

type WindowWithFilePicker = Window &
  typeof globalThis & {
    showOpenFilePicker: ShowOpenFilePicker;
    showSaveFilePicker: ShowSaveFilePicker;
  };

function hasFilePicker(w: Window): w is WindowWithFilePicker {
  return 'showOpenFilePicker' in w && 'showSaveFilePicker' in w;
}

export function supportsFilePicker(): boolean {
  return hasFilePicker(window);
}

/** 非対応ブラウザ向けフォールバック。<input type="file"> で選択させる */
function openTextFileByInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain,.txt';
    // キャンセル時も必ず解決させる
    input.addEventListener('cancel', () => resolve(null));
    input.addEventListener('change', () => {
      resolve(input.files?.[0] ?? null);
    });
    input.click();
  });
}

/**
 * ファイル選択ダイアログを開き、選択されたファイルを返す。
 * キャンセル時は null を返す。
 * File System Access API 非対応ブラウザは <input type="file"> にフォールバックする。
 */
export async function openTextFile(): Promise<File | null> {
  if (!hasFilePicker(window)) return openTextFileByInput();

  try {
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: 'テキストファイル',
          accept: { 'text/plain': ['.txt'] },
        },
      ],
    });
    return await fileHandle.getFile();
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return null;
    throw e;
  }
}

/**
 * ファイル保存ダイアログを開き、テキストを保存する。
 * File System Access API 対応ブラウザは保存先ダイアログを表示し、
 * 非対応ブラウザは <a download> によるフォールバックを行う。
 * キャンセル時は何もしない。
 */
export async function saveTextFile(
  text: string,
  fileName: string,
): Promise<void> {
  if (hasFilePicker(window)) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'テキストファイル',
            accept: { 'text/plain': ['.txt'] },
          },
        ],
      });
      const writable = await fileHandle.createWritable();
      await writable.write(text);
      await writable.close();
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      // それ以外のエラーはフォールバックへ
    }
  }

  // 非対応ブラウザ向けフォールバック
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.click();
}
