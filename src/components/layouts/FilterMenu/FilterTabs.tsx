import { useCallback } from 'react';

import classNames from 'classnames';

interface Props {
  tabs: { [key: string]: string };
  activeTab: string;
  onTabChanged: (tab: string) => void;
}

export const FilterTabs = ({ tabs, activeTab, onTabChanged }: Props) => {
  return (
    <div className="filter-tabs">
      {Object.entries(tabs).map(([key, value]) => {
        const active = activeTab === key;
        const buttonClass = `tab-button-${key.toLowerCase()}`;
        const buttonClasses = classNames([buttonClass, { active }]);

        const handleTabClick = useCallback(() => {
          onTabChanged(key);
        }, [key, onTabChanged]);

        return (
          <button key={key} className={buttonClasses} onClick={handleTabClick}>
            {value}
          </button>
        );
      })}
    </div>
  );
};
