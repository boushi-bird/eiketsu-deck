import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { GeneralCost } from '@/components/parts/GeneralCost';
import { generalImage, unitTypeImage } from '@/utils/externalResource';
import { isLightColor } from '@/utils/isLightColor';

interface Props {
  index: number;
  general: General;
  enableMoveLeft: boolean;
  enableMoveRight: boolean;
  active: boolean;
  onActive: (uniqueId: string) => void;
  onShowDetail: (generalIdx: number) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: MoveDirection) => void;
}

type MoveDirection = 'left' | 'right';

export const DeckCard = memo(function Component({
  index,
  general,
  active,
  enableMoveLeft,
  enableMoveRight,
  onActive,
  onShowDetail,
  onRemove,
  onMove,
}: Props) {
  const prevIndexRef = useRef<number>();
  useEffect(() => {
    prevIndexRef.current = index;
  });
  const prevIndex = prevIndexRef.current;

  const [moveFrom, setMoveFrom] = useState<MoveDirection | null>(null);
  const indexClass = index % 2 === 0 ? 'even' : 'odd';

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const handleShowDetail = useCallback(() => {
    onShowDetail(general.idx);
  }, [general, onShowDetail]);

  const handleMoveLeft = useCallback(() => {
    onMove(index, 'left');
  }, [index, onMove]);

  const handleMoveRight = useCallback(() => {
    onMove(index, 'right');
  }, [index, onMove]);

  useEffect(() => {
    if (prevIndex == null) {
      return;
    }
    const diff = prevIndex - index;
    if (diff !== 0) {
      setMoveFrom(diff > 0 ? 'right' : 'left');
    }
  }, [prevIndex, index]);

  const generalNameClasses = classNames(['general-name'], {
    short: general.name.length < 3,
    long: general.name.length > 5,
    ['very-long']: general.name.length > 8,
  });

  const lightColorBg = isLightColor(general.color.color);

  const gradientBg = `linear-gradient(-60deg, ${[
    general.color.color,
    `${general.color.color} 36px`,
    'transparent 90px',
    'transparent',
  ].join(',')})`;

  const skills = general.skills.map((skill, i) => (
    <span className="skill" key={i} title={skill.name}>
      {skill.shortName}
    </span>
  ));
  if (skills.length === 0) {
    skills.push(
      <span className="no-skill" key={0}>
        特技なし
      </span>,
    );
  }

  return (
    <div
      className={classNames('deck-card', indexClass, {
        active,
        'from-right': moveFrom === 'right',
        'from-left': moveFrom === 'left',
      })}
      style={{
        backgroundColor: general.color.thincolor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (active) {
          return;
        }
        onActive(general.uniqueId);
      }}
    >
      <div
        className={classNames('deck-card-inner-top', {
          'light-color-bg': lightColorBg,
        })}
        style={{
          backgroundColor: general.color.color,
        }}
      >
        <span className="thumb">
          <img
            className="general-thumb"
            src={generalImage(general.code)}
            loading="lazy"
          />
        </span>
        <div
          className="shadow"
          style={{
            background: gradientBg,
          }}
        />
        <span className="info-area">
          <span
            className="card-no"
            style={{
              backgroundColor: general.color.color,
            }}
          >
            {general.uniqueId}
          </span>
          <span className="name">
            <span
              className={classNames(
                'rarity-area',
                'rarity-bg',
                `rarity-bg-${general.rarity.shortName.toLocaleLowerCase()}`,
              )}
            >
              {general.rarity.shortName}
            </span>
            <span className={generalNameClasses}>{general.name}</span>
          </span>
          <span className="unit-type" data-label="兵種">
            <img
              className="unit-type-image"
              src={unitTypeImage(general.unitType.code)}
              alt={general.unitType.shortName}
              title={general.unitType.name}
              loading="lazy"
            />
          </span>
        </span>
      </div>
      <div className="deck-card-inner-bottom">
        <span className="period">{general.period.name}</span>
        <span className="cost">
          <GeneralCost value={general.cost.value} />
        </span>
        <span className="strong" data-label="武" title="武力">
          {general.strong}
        </span>
        <span className="intelligence" data-label="知" title="知力">
          {general.intelligence}
        </span>
        <span className="skills">{skills}</span>
      </div>
      <div className="tool-box">
        <button className="remove" onClick={handleRemove}>
          <FontAwesomeIcon icon={faCircleXmark} className="circle-icon" />
        </button>
        <button
          className="tool-button show-detail"
          title="武将詳細"
          onClick={handleShowDetail}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button
          className={classNames('tool-button', 'move-left', {
            enabled: enableMoveLeft,
          })}
          title="左へ移動"
          onClick={handleMoveLeft}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          className={classNames('tool-button', 'move-right', {
            enabled: enableMoveRight,
          })}
          title="右へ移動"
          onClick={handleMoveRight}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
});
