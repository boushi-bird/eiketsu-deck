import { AppHeader } from '@/components/layouts/AppHeader/';
import { CardList } from '@/components/layouts/CardList/';
import { DeckBoard } from '@/components/layouts/DeckBoard/';
import { FilterMenu } from '@/components/layouts/FilterMenu/';
import { SimpleFilter } from '@/components/layouts/SimpleFilter/';

export const Main = () => {
  return (
    <div className="main">
      <div className="card-area">
        <AppHeader />
        <DeckBoard />
        <div className="list-area">
          <SimpleFilter />
          <CardList />
        </div>
      </div>
      <FilterMenu />
    </div>
  );
};
