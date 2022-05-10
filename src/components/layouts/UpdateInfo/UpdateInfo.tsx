import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  onClose: () => void;
}

export const UpdateInfo = ({ onClose }: Props) => (
  <div className="update-info-modal">
    <h1 className="update-info-title">更新情報</h1>
    <div className="update-info-body">
      <iframe className="update-info-iframe" src="./updateinfo.html" />
    </div>
    <button className="close-button" onClick={onClose}>
      <FontAwesomeIcon icon={faCircleXmark} />
    </button>
  </div>
);
