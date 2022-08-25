import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { SameCardConstraint } from '@/modules/deck';
import { generalImage } from '@/utils/externalResource';

interface Props {
  cards: General[];
  costLimit: number;
  sameCard: SameCardConstraint;
  onClick: () => void;
  onDelete?: () => void;
}

export const SavedDeck = ({
  cards,
  costLimit,
  sameCard,
  onClick,
  onDelete,
}: Props) => (
  <div className="saved-deck">
    <div className="action-area">
      <button
        className={classNames('delete-saved-deck', {
          active: !!onDelete,
        })}
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
    <div className="data-area" onClick={onClick}>
      <div className="saved-deck-cards">
        {cards.map((card) => (
          <img
            key={card.idx}
            className="saved-deck-image"
            src={generalImage(card.code)}
            alt={card.uniqueId}
          />
        ))}
      </div>
      <div className="saved-deck-constraints">
        <span className="saved-deck-constraint">
          コスト上限:{costLimit / 10}コスト
        </span>
        <span className="saved-deck-constraint">
          {sameCard === 'personal-strategy' ? '同名武将可' : ''}
        </span>
      </div>
    </div>
  </div>
);
