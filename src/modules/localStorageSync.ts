import type { PayloadAction, Store } from '@reduxjs/toolkit';

import { BelongCards, belongActions } from './belong';

import { type RootState, store } from '@/store';
import { excludeUndef } from '@/utils/excludeUndef';
import { localStorageAvailable } from '@/utils/storageAvailable';

// redux-query-sync を参考に型定義
interface ParamsOptions<S, V> {
  action: (value: V) => PayloadAction<V>;
  selector: (state: S) => V;
  defaultValue?: V;
  valueToString?: (value: V) => string;
  stringToValue?: (item: string) => V;
}

interface Options<S> {
  store: Store<S>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: { [key: string]: ParamsOptions<S, any> };
  storage: Storage;
}

type CachedState = { [key: string]: unknown };

function ReduxLocalStorageSync<S>({ store, params, storage }: Options<S>) {
  const { dispatch } = store;

  const lastCachedState: CachedState = getCachedState();
  let ignoreStorageUpdate = false;
  let ignoreStateUpdate = false;

  function getCachedState() {
    const state = store.getState();
    return Object.keys(params).reduce((c, k) => {
      const { selector } = params[k];
      c[k] = selector(state);
      return c;
    }, {} as CachedState);
  }

  function handleStorageUpdate() {
    if (ignoreStorageUpdate) return;

    const actionsToDispatch = Object.keys(params)
      .map((key) => {
        const { action, stringToValue = (item) => JSON.parse(item) } =
          params[key];
        const valueString = storage.getItem(key);
        if (valueString == null) {
          return undefined;
        }
        const value = stringToValue(valueString);
        return action(value);
      })
      .filter(excludeUndef);

    ignoreStateUpdate = true;
    for (const action of actionsToDispatch) {
      dispatch(action);
    }
    ignoreStateUpdate = false;

    handleStateUpdate();
  }

  function handleStateUpdate() {
    const state = store.getState();

    const saveTargets = Object.keys(params)
      .map((key) => {
        const { selector, valueToString } = params[key];
        const targetState = selector(state);
        if (lastCachedState[key] === targetState) {
          // 前回と変わっていなければ保存対象外
          return undefined;
        }
        lastCachedState[key] = targetState;

        const value = valueToString
          ? valueToString(targetState)
          : JSON.stringify(targetState);
        return { key, value };
      })
      .filter(excludeUndef);

    if (ignoreStateUpdate) return;

    ignoreStorageUpdate = true;
    for (const { key, value } of saveTargets) {
      storage.setItem(key, value);
    }
    ignoreStorageUpdate = false;
  }

  store.subscribe(handleStateUpdate);

  handleStorageUpdate();
  // 現在のタブ以外で更新された場合の処理
  window.addEventListener('storage', function (e) {
    if (!e.isTrusted || !e.key) {
      return;
    }
    if (!Object.keys(params).includes(e.key)) {
      return;
    }
    handleStorageUpdate();
  });
}

const belongParams: ParamsOptions<RootState, BelongCards> = {
  action: belongActions.setBelongCards,
  selector: (state) => state.belong.belongCards,
  defaultValue: {},
  stringToValue: (q) => {
    const values = JSON.parse(q);
    const keys = Object.keys(values);
    if (keys.length === 0) {
      return {};
    }
    const {
      datalist: { generals },
    } = store.getState();

    return keys.reduce((belongCards, k) => {
      const v = values[k];
      if (
        v != null &&
        Number.isInteger(v) &&
        v > 0 &&
        generals.some((g) => g.uniqueId === k)
      ) {
        // 存在するuniqueIdの場合のみ追加
        belongCards[k] = v;
      }
      return belongCards;
    }, {} as BelongCards);
  },
};

let init = false;

export const localStorageSync = () => {
  if (init) {
    return;
  }
  if (localStorageAvailable()) {
    ReduxLocalStorageSync({
      store,
      params: {
        belong: belongParams,
      },
      storage: localStorage,
    });
  }
  init = true;
};
