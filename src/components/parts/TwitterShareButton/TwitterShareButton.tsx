import { useCallback } from 'react';

import imgTwitter from './twitter.png';

export const TwitterShareButton = () => (
  <button
    className="share-button"
    onClick={useCallback(() => {
      const url = new URL('https://twitter.com/intent/tweet');
      url.search = new URLSearchParams({
        hashtags: '英傑大戦',
        url: location.href,
      }).toString();
      window.open(url, '_blank');
    }, [])}
  >
    <img className="share-button-image twitter" src={imgTwitter} />
  </button>
);
