import { registerSW } from 'virtual:pwa-register';

import { setupRoot } from './root';
import { store, unmanagedStore } from './store';

import { windowActions } from '@/modules/window';

const updateSW = registerSW({
  async onNeedRefresh() {
    const {
      window: { autoReload },
    } = store.getState();

    await updateSW(autoReload);

    if (!autoReload) {
      store.dispatch(windowActions.beUpdateReady());
    }
  },
  // onOfflineReady() {
  //   store.dispatch(windowActions.beOffline());
  // },
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

window.addEventListener('beforeunload', (ev) => {
  const { deckTabs, activeTabIndex } = store.getState().deck;
  const hasNotSave =
    deckTabs.length > 1 &&
    deckTabs.some(
      (d, i) => activeTabIndex !== i && d.cards.length !== 0 && !d.cardsSaved,
    );
  if (hasNotSave) {
    ev.preventDefault();
    ev.returnValue = '';
  }
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
