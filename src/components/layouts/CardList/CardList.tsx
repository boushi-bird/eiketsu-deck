import {
  MouseEventHandler,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import classNames from 'classnames';
import { General } from 'eiketsu-deck';
import { useDispatch } from 'react-redux';

import { CardListCtrl } from './CardListCtrl';

import { GeneralCard } from '@/components/parts/GeneralCard';
import {
  belongCardsSelector,
  editModeSelector,
  filterSelector,
  generalsSelector,
  hasBelongCardsSelector,
  searchedGeneralsSelector,
  useAppSelector,
} from '@/hooks';
import { BelongCards } from '@/modules/belong';
import { cardlistActions } from '@/modules/cardlist';
import { FilterState } from '@/modules/filter';
import { windowActions } from '@/modules/window';
import {
  filterMenuItems,
  filterMenuStratItems,
} from '@/services/filterMenuItems';
import { createLazyRunner } from '@/utils/lazyRunner';
import { nextTick } from '@/utils/sleep';

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
  filter: FilterState,
  {
    hasBelongCards,
    belongCards,
  }: { hasBelongCards: boolean; belongCards?: BelongCards }
): boolean {
  return (
    filterMenuItems
      .filter((item) => item.enabled({ filter, hasBelongCards }))
      .every((item) =>
        item.filter(general, filter, { hasBelongCards, belongCards })
      ) &&
    filterMenuStratItems
      .filter((item) => item.enabled({ filter }))
      .every((item) => item.filter(general.strat, filter))
  );
}

export const CardList = () => {
  const scrollArea = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const [pending, startTransition] = useTransition();
  const [pendingPaging, startPageingTransition] = useTransition();

  // 現在のページ
  const [currentPage, setCurrentPage] = useState(1);
  const [readingCards, setReadingCards] = useState(0);
  const [readingCardsAll, setReadingCardsAll] = useState(0);

  const [prevBelongFilter, setPrevBelongFilter] = useState<string | undefined>(
    undefined
  );
  const [localBelongCards, setLocalBelongCards] = useState<
    { [key: string]: number } | undefined
  >(undefined);

  const generals = useAppSelector(generalsSelector);
  const filter = useAppSelector(filterSelector);
  const belongCards = useAppSelector(belongCardsSelector);
  const hasBelongCards = useAppSelector(hasBelongCardsSelector);
  const searchedGenerals = useAppSelector(searchedGeneralsSelector);
  const editMode = useAppSelector(editModeSelector);

  const deferredFilter = useDeferredValue(filter);

  const belongFilterChanged = deferredFilter.belongFilter !== prevBelongFilter;

  if (belongFilterChanged) {
    setPrevBelongFilter(deferredFilter.belongFilter);
  }

  if (
    localBelongCards == null ||
    ((belongFilterChanged || editMode !== 'belong') &&
      belongCards !== localBelongCards)
  ) {
    // 所持状態編集中に絞り込みが変わらないようにeditModeがbelongのときは設定しないが、所持・未所持絞り込みを変更した場合は設定する
    setLocalBelongCards(belongCards);
  }

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
        dispatch(
          cardlistActions.setSearchedGenerals(
            generals
              .filter((general) =>
                isGeneralMatchFilterCondition(general, deferredFilter, {
                  hasBelongCards,
                  belongCards: localBelongCards,
                })
              )
              .map(({ idx }) => idx)
          )
        );
        setCurrentPage(1);
      });
    });
  }, [generals, deferredFilter, localBelongCards, hasBelongCards, dispatch]);

  const handleEtcAreaClick = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      e.stopPropagation();
    },
    []
  );

  const generalCards = useMemo(
    () =>
      generals
        .slice(0, readingCards)
        .filter((general) => displaySearchedGenerals.includes(general.idx))
        .map((general) => (
          <div
            className={classNames('general-card-container', { show: true })}
            key={general.uniqueId}
            onClick={() => {
              dispatch(windowActions.openGenerailDetail(general.idx));
            }}
          >
            <GeneralCard {...{ general }}>
              <div className="etc-area" onClick={handleEtcAreaClick}>
                <CardListCtrl {...{ general }} />
              </div>
            </GeneralCard>
          </div>
        )),
    [
      generals,
      readingCards,
      displaySearchedGenerals,
      handleEtcAreaClick,
      dispatch,
    ]
  );

  return (
    <div className="card-list-container">
      {readingCards < readingCardsAll && (
        <div className="reading-cards">
          読み込み中 {readingCards}/{readingCardsAll}
        </div>
      )}
      <div className="card-list-paging">
        <button
          className={classNames('paging-button', 'prev', {
            active: hasPrev && !pending,
          })}
          onClick={useCallback(() => {
            startPageingTransition(() => {
              setCurrentPage((prevPage) => prevPage - 1);
            });
          }, [])}
        >
          &lt; 前
        </button>
        <div className="paging-label">
          全{allCount}件 {start} - {end}件
        </div>
        <button
          className={classNames('paging-button', 'next', {
            active: hasNext && !pending,
          })}
          disabled={pending || pendingPaging}
          onClick={useCallback(() => {
            startPageingTransition(() => {
              setCurrentPage((prevPage) => prevPage + 1);
            });
          }, [])}
        >
          次 &gt;
        </button>
        <div
          className={classNames('loading-page', {
            pending: pending,
          })}
        >
          <div className="loading-item" />
        </div>
      </div>
      <div
        className={classNames('loading-list', {
          pending: pendingPaging,
        })}
      >
        <div className="loading-item" />
      </div>
      <div
        className={classNames('card-list', {
          pending: pendingPaging,
        })}
        ref={scrollArea}
      >
        {generalCards}
      </div>
    </div>
  );
};
