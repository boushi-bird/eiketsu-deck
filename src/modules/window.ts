import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type Modal = 'none' | 'updateInfo' | 'copyright' | 'general-detail';

type EditMode = 'deck' | 'belong';

interface WindowState {
  autoReload: boolean;
  offline: boolean;
  openedSideMenu: boolean;
  openedFilter: boolean;
  currentModal: Modal;
  generalIdxForDetail?: number;
  editMode: EditMode;
  showNotice: boolean;
  pendingInstallPromptEvent: boolean;
  devMode: boolean;
}

const initialState: WindowState = {
  autoReload: true,
  openedSideMenu: false,
  offline: false,
  openedFilter: false,
  currentModal: 'none',
  editMode: 'deck',
  showNotice: false,
  pendingInstallPromptEvent: false,
  devMode: false,
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
      state.currentModal = 'updateInfo';
    },
    openCopyright: (state: WindowState) => {
      state.currentModal = 'copyright';
    },
    openGenerailDetail: (state: WindowState, action: PayloadAction<number>) => {
      state.generalIdxForDetail = action.payload;
      state.currentModal = 'general-detail';
    },
    changeEditMode: (state: WindowState, action: PayloadAction<EditMode>) => {
      state.editMode = action.payload;
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
      state.currentModal = 'none';
      state.generalIdxForDetail = undefined;
    },
    changeDevMode: (state: WindowState, action: PayloadAction<boolean>) => {
      state.devMode = action.payload;
    },
  },
});

export const windowReducer = slice.reducer;
export const windowActions = slice.actions;
