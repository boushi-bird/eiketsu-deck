declare module 'redux-query-sync' {
  import type { PayloadAction } from '@reduxjs/toolkit';
  import type { Store } from 'redux';

  export type ReduxQuerySyncUnsubscribe = () => void;

  function ReduxQuerySync<S>(options: Options<S>): ReduxQuerySyncUnsubscribe;

  export interface ParamsOptions<S, V> {
    action: (value: V) => PayloadAction<V>;
    selector: (state: S) => V;
    defaultValue?: V;
    valueToString?: (value: V) => string;
    stringToValue?: (q: string) => V;
  }

  interface Options<S> {
    store: Store<S>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { [key: string]: ParamsOptions<S, any> };
    initialTruth: 'location' | 'store';
    replaceState?: boolean;
  }

  export default ReduxQuerySync;
}
