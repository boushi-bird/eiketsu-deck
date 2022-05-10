import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onClose: () => void;
}

export const CopyrightModal = ({ onClose }: Props) => (
  <div className="copyright-modal">
    <ul>
      <li>本ツールは個人が作成した非公式のツールです。</li>
      <li>
        利用している画像やデータの著作権は
        <a
          href="https://www.sega.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          株式会社セガ
          <FontAwesomeIcon
            className="external-link-icon"
            icon={faExternalLinkAlt}
          />
        </a>
        にあります。
      </li>
    </ul>
    <button className="close-button" onClick={onClose}>
      <FontAwesomeIcon icon={faCircleXmark} />
    </button>
  </div>
);
