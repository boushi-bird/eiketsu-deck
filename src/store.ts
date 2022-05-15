import { configureStore } from '@reduxjs/toolkit';

import { belongReducer } from '@/modules/belong';
import { datalistReducer } from '@/modules/datalist';
import { deckReducer } from '@/modules/deck';
import { filterReducer } from '@/modules/filter';
import { windowReducer } from '@/modules/window';

export const store = configureStore({
  reducer: {
    belong: belongReducer,
    datalist: datalistReducer,
    deck: deckReducer,
    filter: filterReducer,
    window: windowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Reduxで管理できないシリアライズ不可な値をシンプルに変数で保持するストア
interface UnmanagedStore {
  installPromptEvent: BeforeInstallPromptEvent | null;
}

export const unmanagedStore: UnmanagedStore = {
  installPromptEvent: null,
};
