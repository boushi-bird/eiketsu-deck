import { registerSW } from 'virtual:pwa-register';

import { setupRoot } from './root';
import { store, unmanagedStore } from './store';

import { windowActions } from '@/modules/window';

const updateSW = registerSW({
  onNeedRefresh() {
    const {
      window: { autoReload },
    } = store.getState();
    updateSW(autoReload);
  },
  onOfflineReady() {
    store.dispatch(windowActions.beOffline());
  },
  onRegisterError(error) {
    console.error('[SW Register Error]', error);
  },
});

window.addEventListener('beforeinstallprompt', {
  handleEvent: (event: BeforeInstallPromptEvent) => {
    event.preventDefault();

    unmanagedStore.installPromptEvent = event;
    store.dispatch(windowActions.storeInstallPromptEvent());
  },
});

// タグマネージャー等他の要素からイベントを発行させる
const receiveNoticeChanged = (noticeEnabled?: boolean) => {
  store.dispatch(windowActions.changeShowNotice(!!noticeEnabled));
};
receiveNoticeChanged(window.__noticeEnabled);
window.addEventListener('__receiveNoticeChanged', (event: Event) => {
  event.preventDefault();
  receiveNoticeChanged(window.__noticeEnabled);
});

const app = document.getElementById('app');

if (app) {
  setupRoot(app);

  const about = document.getElementById('about');
  about?.parentNode?.removeChild(about);
}
