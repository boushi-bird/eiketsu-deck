import {
  MouseEventHandler,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { General } from 'eiketsu-deck';

import { CardListCtrl } from './CardListCtrl';

import { GeneralCard } from '@/components/parts/GeneralCard';
import { datalistSelector, filterSelector, useAppSelector } from '@/hooks';
import { FilterState } from '@/modules/filter';
import {
  filterMenuItems,
  filterMenuStratItems,
} from '@/services/filterMenuItems';
import { createLazyRunner } from '@/utils/lazyRunner';
import { nextTick } from '@/utils/sleep';

const generalsSelector = createSelector(
  datalistSelector,
  (datalist) => datalist.generals
);

const lazyRunner = createLazyRunner();

const PAGE_LIMIT = 50;

function page(currentPage: number, allCount: number, pageLimit: number) {
  const searchedOffset = (currentPage - 1) * pageLimit;
  const hasPrev = searchedOffset > 0;
  const hasNext = searchedOffset + pageLimit < allCount;
  const start = allCount > 0 ? searchedOffset + 1 : 0;
  let end = searchedOffset + pageLimit;
  if (end > allCount) {
    end = allCount;
  }
  return { searchedOffset, hasPrev, hasNext, start, end };
}

function isGeneralMatchFilterCondition(
  general: General,
  filter: FilterState
): boolean {
  return (
    filterMenuItems
      .filter((item) => item.enabled(filter))
      .every((item) => item.filter(general, filter)) &&
    filterMenuStratItems
      .filter((item) => item.enabled(filter))
      .every((item) => item.filter(general.strat, filter))
  );
}

export const CardList = () => {
  const scrollArea = useRef<HTMLDivElement>(null);

  const [pending, startTransition] = useTransition();
  const [pendingPaging, startPageingTransition] = useTransition();

  // 現在のページ
  const [currentPage, setCurrentPage] = useState(1);
  // 検索条件に合う武将のidx
  const [searchedGenerals, setSearchedGenerals] = useState<number[]>([]);
  const [readingCards, setReadingCards] = useState(0);
  const [readingCardsAll, setReadingCardsAll] = useState(0);

  const generals = useAppSelector(generalsSelector);
  const filter = useAppSelector(filterSelector);

  const deferredFilter = useDeferredValue(filter);

  const allCount = searchedGenerals.length;
  const { searchedOffset, hasPrev, hasNext, start, end } = page(
    currentPage,
    allCount,
    PAGE_LIMIT
  );

  const displaySearchedGenerals = searchedGenerals.slice(
    searchedOffset,
    searchedOffset + PAGE_LIMIT
  );

  useEffect(() => {
    const genLen = generals.length;
    setReadingCardsAll(genLen);
    (async () => {
      await nextTick();
      for (let r = 0; r < genLen; r += 25) {
        setReadingCards(r);
        await nextTick();
      }
      setReadingCards(genLen);
    })();
  }, [generals]);

  useEffect(() => {
    if (!scrollArea.current) {
      return;
    }
    scrollArea.current.scrollTop = 0;
  }, [currentPage, allCount]);

  useEffect(() => {
    lazyRunner.run(() => {
      startTransition(() => {
        setSearchedGenerals(
          generals
            .filter((general) =>
              isGeneralMatchFilterCondition(general, deferredFilter)
            )
            .map(({ idx }) => idx)
        );
        setCurrentPage(1);
      });
    });
  }, [generals, deferredFilter]);

  const handleEtcAreaClick = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      e.stopPropagation();
    },
    []
  );

  const generalCards = generals.slice(0, readingCards).map((general) => {
    const show = displaySearchedGenerals.includes(general.idx);

    return (
      <div
        className={classNames('general-card-container', { show })}
        key={general.uniqueId}
        onClick={() => console.log('TODO: show detail')}
      >
        <GeneralCard {...{ general }}>
          <div className="etc-area" onClick={handleEtcAreaClick}>
            <CardListCtrl {...{ general, generals }} />
          </div>
        </GeneralCard>
      </div>
    );
  });

  return (
    <div className="card-list-container">
      {readingCards < readingCardsAll && (
        <div className="reading-cards">
          読み込み中 {readingCards}/{readingCardsAll}
        </div>
      )}
      <div className="card-list-paging">
        <button
          className={classNames('paging-button', 'prev', { active: hasPrev })}
          onClick={useCallback(() => {
            startPageingTransition(() => {
              setCurrentPage((prevPage) => prevPage - 1);
            });
          }, [currentPage])}
        >
          &lt; 前
        </button>
        <div className="paging-label">
          {pending ? '検索中...' : `全${allCount}件 ${start} - ${end}件`}
        </div>
        <button
          className={classNames('paging-button', 'next', { active: hasNext })}
          onClick={useCallback(() => {
            startPageingTransition(() => {
              setCurrentPage((prevPage) => prevPage + 1);
            });
          }, [currentPage])}
        >
          次 &gt;
        </button>
      </div>
      <div
        className={classNames('loading-list', {
          pending: pending || pendingPaging,
        })}
      >
        <div className="loading-item" />
      </div>
      <div
        className={classNames('card-list', {
          pending: pending || pendingPaging,
        })}
        ref={scrollArea}
      >
        {generalCards}
      </div>
    </div>
  );
};
