import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GeneralCard } from '@/components/parts/GeneralCard';
import { generalsSelector, useAppSelector } from '@/hooks';
import {
  generalBasicImage,
  generalCardDetailImage,
  generalOfficialPageLink,
  stratRangeImage,
} from '@/utils/externalResource';

interface Props {
  generalIdx: number;
  onClose: () => void;
}

export const GeneralDetail = ({ generalIdx, onClose }: Props) => {
  const generals = useAppSelector(generalsSelector);

  const general = generals.find((g) => g.idx == generalIdx);

  if (!general) {
    return <div className="general-detail">見つかりません。</div>;
  }

  return (
    <div className="general-detail">
      <div className="general-detail-inner">
        <GeneralCard {...{ general }}>
          <span className="official-links" data-label="公式リンク">
            <a
              href={generalOfficialPageLink(general.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              武将情報
              <FontAwesomeIcon
                className="external-link-icon"
                icon={faExternalLinkAlt}
              />
            </a>
            <a
              href={generalCardDetailImage(general.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              カード画像
              <FontAwesomeIcon
                className="external-link-icon"
                icon={faExternalLinkAlt}
              />
            </a>
            <a
              href={generalBasicImage(general.code)}
              target="_blank"
              rel="noopener noreferrer"
            >
              武将画像
              <FontAwesomeIcon
                className="external-link-icon"
                icon={faExternalLinkAlt}
              />
            </a>
          </span>
        </GeneralCard>
        <div className="creator-info">
          <span className="name">{general.illust.displayName}</span>
          <span className="name">CV:{general.cv.name}</span>
        </div>
        <div className="strat-info" data-label="計略">
          <h1 className="strat-title">
            <ruby>
              {general.strat.name}
              <rt>{general.strat.kana}</rt>
            </ruby>
          </h1>
          <div className="strat-body">
            <span className="strat-params">
              <span className="strat-param">
                カテゴリー：
                {general.strat.categories.map((c) => c.name).join(', ')}
              </span>
              <span className="strat-param">必要士気：{general.strat.mp}</span>
              <span className="strat-param">
                効果時間：{general.strat.time.name}
              </span>
            </span>
            <span className="strat-range" data-label="効果範囲">
              <img
                className="strat-range-image"
                src={stratRangeImage(general.strat.range.code)}
                loading="lazy"
              />
            </span>
            <span className="strat-caption" data-label="説明">
              {general.strat.caption}
            </span>
          </div>
        </div>
        <div className="skill-info" data-label="特技">
          {general.skills.map((s, i) => (
            <div className="skill" key={i}>
              <span className="name">{s.name}</span>
              {s.caption}
            </div>
          ))}
          {general.skills.length === 0 && <div className="skill">なし</div>}
        </div>
      </div>
      <button className="close-button" onClick={onClose}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    </div>
  );
};
