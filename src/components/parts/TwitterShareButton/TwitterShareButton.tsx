import { memo, useCallback } from 'react';

import imgXLogo from './x-logo/logo-white.png';

import { store } from '@/store';
import { excludeUndef } from '@/utils/excludeUndef';

export const TwitterShareButton = memo(function Component() {
  return (
    <button
      className="share-button x-logo"
      onClick={useCallback(() => {
        const {
          deck: { deckTabs, activeTabIndex },
          datalist: { generals },
        } = store.getState();

        const cards = deckTabs[activeTabIndex]?.cards || [];

        const deckGenerals = cards
          .map((d) => generals.find((g) => g.idx === d.generalIdx))
          .filter(excludeUndef);

        const text =
          '\n' +
          deckGenerals
            .map((g) => `${g.rarity.shortName}${g.name}[${g.uniqueId}]`)
            .join('\n') +
          '\n';

        const url = new URL('https://twitter.com/intent/tweet');
        url.search = new URLSearchParams({
          text,
          hashtags: '英傑大戦デッキ',
          url: location.href,
        }).toString();
        window.open(url, '_blank');
      }, [])}
    >
      <img className="share-button-image twitter" src={imgXLogo} />
    </button>
  );
});
