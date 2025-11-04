import { FC, ReactNode, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Loading } from '@/components/layouts/Loading/';
import { Main } from '@/components/layouts/Main/';
import { Modal } from '@/components/layouts/Modal';
import { SideMenu } from '@/components/layouts/SideMenu/';
import { Toast } from '@/components/layouts/Toast';
import { useAppDispatch } from '@/hooks';
import { datalistActions } from '@/modules/datalist';
import { localStorageSync } from '@/modules/localStorageSync';
import { querySync } from '@/modules/querySync';
import { windowActions } from '@/modules/window';
import { createDatalist } from '@/services/createDatalist';
import {
  loadEiketsuDeckData,
  loadEiketsuDeckDataKabuki,
} from '@/services/loadData';
import { serverSideDate } from '@/utils/serverSideDate';

interface Props {
  children?: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    (async () => {
      // TODO: 例外処理
      const [data, kabukiData, now] = await Promise.all([
        loadEiketsuDeckData(),
        loadEiketsuDeckDataKabuki(),
        serverSideDate(),
      ]);
      const datalist = createDatalist(data, kabukiData, now);
      dispatch(datalistActions.setDatalist(datalist));
      querySync();
      localStorageSync();
      setReady(true);

      // 一定時間経っていた場合、Service Worker更新時のリロードはしない。
      timerId = setTimeout(() => {
        dispatch(windowActions.disableAutoReload());
      }, 5000);
    })();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [dispatch]);

  return (
    <div className={classNames('app-container', { ready })}>{children}</div>
  );
};

export const App = () => {
  return (
    <AppContainer>
      <SideMenu />
      <Main />
      <Modal />
      <Loading />
      <Toast />
    </AppContainer>
  );
};
