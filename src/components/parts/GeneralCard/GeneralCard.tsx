import { ReactNode, memo } from 'react';

import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { GeneralCost } from '@/components/parts/GeneralCost';
import { generalFaceImage, unitTypeImage } from '@/utils/externalResource';

interface Props {
  children?: ReactNode;
  general: General;
}

export const GeneralCard = memo(function Component({
  children,
  general,
}: Props) {
  const imageUrl = generalFaceImage(general);
  const skills = general.skills.map((skill, i) => (
    <span className="skill" key={i} title={skill.name}>
      {skill.shortName}
    </span>
  ));
  if (skills.length === 0) {
    skills.push(
      <span className="no-skill" key={0}>
        特技なし
      </span>
    );
  }
  const stratCategories = general.strat.categories.map((c) => (
    <span key={c.idx} className="strat-category">
      {c.name}
    </span>
  ));
  const generalNameClasses = classNames(['name'], {
    ['very-long']: general.name.length > 7,
  });

  return (
    <div
      key={general.uniqueId}
      className="general-card"
      style={{
        backgroundColor: general.color.thincolor,
      }}
    >
      <span
        className="state-color"
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
      <span className="rarity">
        <span
          className={classNames(
            'rarity-area',
            'rarity-bg',
            `rarity-bg-${general.rarity.shortName.toLocaleLowerCase()}`
          )}
        >
          {general.rarity.shortName}
        </span>
      </span>
      <span className={generalNameClasses}>
        <ruby>
          {general.name}
          <rt>{general.kana}</rt>
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
