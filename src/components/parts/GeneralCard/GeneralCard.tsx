import { CSSProperties, ReactNode, memo } from 'react';

import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { GeneralCost } from '@/components/parts/GeneralCost';
import { generalFaceImage, unitTypeImage } from '@/utils/externalResource';
import { insertWordBreaks } from '@/utils/insertWordBreaks';
import { isLightColor } from '@/utils/isLightColor';

interface Props {
  children?: ReactNode;
  general: General;
}

function generateNameStyle(
  nameLength: number,
  isKabuki: boolean,
  needRuby: boolean,
): CSSProperties {
  if (nameLength >= 12) {
    return {
      letterSpacing: 'normal',
      marginRight: '0',
      fontSize: needRuby ? '60%' : '70%',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      wordBreak: 'keep-all',
    };
  }
  if (nameLength >= 10) {
    return {
      letterSpacing: 'normal',
      marginRight: '0',
      fontSize: '60%',
    };
  }
  if (nameLength >= 9) {
    return {
      letterSpacing: 'normal',
      marginRight: '0',
      fontSize: isKabuki ? '70%' : '75%',
    };
  }
  if (nameLength >= 8) {
    return {
      letterSpacing: 'normal',
      marginRight: '0',
      fontSize: isKabuki ? '80%' : '85%',
    };
  }
  if (nameLength >= 6) {
    return {
      letterSpacing: 'normal',
      marginRight: '0',
      fontSize: isKabuki ? '95%' : undefined,
    };
  }
  if (nameLength < 3) {
    return { letterSpacing: '18px', marginRight: '-18px' };
  }
  return {};
}

export const GeneralCard = memo(function Component({
  children,
  general,
}: Props) {
  const imageUrl = generalFaceImage(general);
  const skills = general.skills.map((skill, i) => (
    // 同じスキルを複数持つ場合があるのでkeyにindexを使う
    <span className="skill" key={`skill-${skill.idx}-${i}`} title={skill.name}>
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
  const stratCategories = general.strat.categories.map((c) => (
    <span key={c.idx} className="strat-category">
      {c.name}
    </span>
  ));
  const isKabuki = general.kabuki != null && general.kabukiRank != null;
  const generalClasses = classNames(['general-card'], {
    ['general-card-kabuki']: isKabuki,
  });
  const needRuby = general.name !== general.kana;
  const nameStyle = generateNameStyle(general.name.length, isKabuki, needRuby);

  const lightColorBg = isLightColor(general.color.color);

  return (
    <div
      key={general.uniqueId}
      className={generalClasses}
      style={{
        backgroundColor: general.color.thincolor,
      }}
    >
      <span
        className={classNames('state-color', {
          'light-color-bg': lightColorBg,
        })}
        style={{
          backgroundColor: general.color.color,
        }}
      >
        {general.color.name}
      </span>
      <span className="card-no">
        <span className="card-no-block">
          {general.uniqueId} {general.appear}
        </span>
      </span>
      {general.kabuki != null && general.kabukiRank ? (
        <span className="kabuki" data-label="傾奇">
          <span className="kabukiPt">{`${general.kabuki}pt`}</span>
          <span className="kabukiRank">{general.kabukiRank.label}</span>
        </span>
      ) : (
        <></>
      )}
      <span className="rarity">
        <span
          className={classNames(
            'rarity-area',
            'rarity-bg',
            `rarity-bg-${general.rarity.shortName.toLocaleLowerCase()}`,
          )}
        >
          {general.rarity.shortName}
        </span>
      </span>
      <span className="name">
        <ruby>
          <span className="general-name" style={nameStyle}>
            {insertWordBreaks(general.name)}
          </span>
          <rt className={classNames({ 'hide-ruby': !needRuby })}>
            {general.kana}
          </rt>
        </ruby>
      </span>
      <span className="period">
        <span className="period-block">{general.period.name}</span>
      </span>
      <span className="thumb">
        <img className="general-thumb" src={imageUrl} loading="lazy" />
      </span>
      <span className="cost" data-label="コスト">
        <span className="general-cost-value">{general.cost.name}</span>
        <GeneralCost value={general.cost.value} />
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
      <span className="strong" data-label="武" title="武力">
        {general.strong}
      </span>
      <span className="intelligence" data-label="知" title="知力">
        {general.intelligence}
      </span>
      <span className="skills">{skills}</span>
      <span className="strat" data-label="計略[必要士気]">
        <span className="strat-main" title={general.strat.caption}>
          {general.strat.name}
          <span className="strat-mp">[{general.strat.mp}]</span>
        </span>
        <span className="strat-categories">{stratCategories}</span>
      </span>
      <span className="etc">{children}</span>
    </div>
  );
});
