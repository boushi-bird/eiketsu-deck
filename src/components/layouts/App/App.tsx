import { FC, ReactNode, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Loading } from '@/components/layouts/Loading/';
import { Main } from '@/components/layouts/Main/';
import { SideMenu } from '@/components/layouts/SideMenu/';
import { useAppDispatch } from '@/hooks';
import { datalistActions } from '@/modules/datalist';
import { querySync } from '@/modules/querySync';
import { windowActions } from '@/modules/window';
import { createDatalist } from '@/services/createDatalist';
import { loadEiketsuDeckData } from '@/services/loadData';

interface Props {
  children?: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // TODO: 例外処理
      const data = await loadEiketsuDeckData();
      const datalist = createDatalist(data);
      dispatch(datalistActions.setDatalist(datalist));
      querySync();
      setReady(true);

      // 一定時間経っていた場合、Service Worker更新時のリロードはしない。
      setTimeout(() => {
        dispatch(windowActions.disableAutoReload());
      }, 2000);
    })();
  }, []);

  return (
    <div className={classNames('app-container', { ready })}>{children}</div>
  );
};

export const App = () => {
  return (
    <AppContainer>
      <SideMenu />
      <Main />
      <Loading />
    </AppContainer>
  );
};
