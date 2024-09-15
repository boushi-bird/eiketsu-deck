import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@/components/layouts/App/';
import { store } from '@/store';

export function setupRoot(el: HTMLElement) {
  const root = createRoot(el);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}
