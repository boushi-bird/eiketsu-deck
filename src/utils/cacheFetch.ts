import { localStorageAvailable } from './storageAvailable';

async function fetchMd5(url: string): Promise<string | null> {
  const res: Response = await fetch(url + '.md5');
  if (!res.ok) {
    return null;
  }
  const md5 = await res.text();
  return md5.trim();
}

async function _cacheFetch<T>(url: string, keyName: string): Promise<T | null> {
  const keyNameMd5 = keyName + '.md5';
  const md5 = await fetchMd5(url);
  if (!md5) {
    localStorage.removeItem(keyNameMd5);
    localStorage.removeItem(keyName);
    return null;
  }
  const cachedMd5 = localStorage.getItem(keyNameMd5);
  let conflict = false;
  if (cachedMd5 && cachedMd5 === md5) {
    const cached = localStorage.getItem(keyName);
    if (cached) {
      return JSON.parse(cached);
    }
    conflict = true;
    // MD5だけある状態はおかしいので削除
    localStorage.removeItem(keyNameMd5);
  }
  const res = await fetch(url);
  const result = await res.json();
  if (!conflict) {
    localStorage.setItem(keyName, JSON.stringify(result));
    localStorage.setItem(keyNameMd5, md5);
  }
  return result;
}

export async function cacheFetch<T>(url: string, keyName: string): Promise<T> {
  if (localStorageAvailable()) {
    const result = await _cacheFetch<T>(url, keyName);
    if (result) {
      return result;
    }
  }
  const res = await fetch(url);
  return res.json();
}
