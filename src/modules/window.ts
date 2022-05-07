import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type Modal = 'none' | 'updateInfo' | 'copyright';

interface WindowState {
  autoReload: boolean;
  offline: boolean;
  openedSideMenu: boolean;
  openedFilter: boolean;
  currentModel: Modal;
  showNotice: boolean;
  pendingInstallPromptEvent: boolean;
}

const initialState: WindowState = {
  autoReload: true,
  openedSideMenu: false,
  offline: false,
  openedFilter: false,
  currentModel: 'none',
  showNotice: false,
  pendingInstallPromptEvent: false,
};

const slice = createSlice({
  name: 'window',
  initialState,
  reducers: {
    disableAutoReload(state: WindowState) {
      state.autoReload = false;
    },
    beOffline(state: WindowState) {
      state.offline = true;
    },
    openSideMenu: (state: WindowState) => {
      state.openedSideMenu = true;
    },
    closeSideMenu: (state: WindowState) => {
      state.openedSideMenu = false;
    },
    openFilter: (state: WindowState) => {
      state.openedFilter = true;
    },
    closeFilter: (state: WindowState) => {
      state.openedFilter = false;
    },
    openUpdateInfo: (state: WindowState) => {
      state.currentModel = 'updateInfo';
    },
    openCopyright: (state: WindowState) => {
      state.currentModel = 'copyright';
    },
    storeInstallPromptEvent: (state: WindowState) => {
      state.pendingInstallPromptEvent = true;
    },
    clearInstallPromptEvent: (state: WindowState) => {
      state.pendingInstallPromptEvent = false;
    },
    changeShowNotice: (state: WindowState, action: PayloadAction<boolean>) => {
      state.showNotice = action.payload;
    },
    closeModal: (state: WindowState) => {
      state.currentModel = 'none';
    },
  },
});

export const windowReducer = slice.reducer;
export const windowActions = slice.actions;
