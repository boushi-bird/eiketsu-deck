function storageAvailable(storage: Storage): boolean {
  try {
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

let localStorageAvailableCache: boolean | null = null;

function _localStorageAvailable(): boolean {
  if (!('localStorage' in window)) {
    return false;
  }
  return storageAvailable(window.localStorage);
}

export function localStorageAvailable(): boolean {
  if (localStorageAvailableCache != null) {
    return localStorageAvailableCache;
  }
  localStorageAvailableCache = _localStorageAvailable();
  return localStorageAvailableCache;
}
