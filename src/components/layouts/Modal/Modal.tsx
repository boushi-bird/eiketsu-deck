import { ReactNode, useCallback } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { CopyrightModal } from '@/components/layouts/CopyrightModal';
import { GeneralDetail } from '@/components/layouts/GeneralDetail';
import { UpdateInfo } from '@/components/layouts/UpdateInfo';
import { useAppSelector, windowSelector } from '@/hooks';
import { windowActions } from '@/modules/window';

const selector = createSelector(
  windowSelector,
  ({ currentModal, generalIdxForDetail }) => ({
    currentModal,
    generalIdxForDetail,
  })
);

export const Modal = () => {
  const dispatch = useDispatch();
  const { currentModal, generalIdxForDetail } = useAppSelector(selector);

  const handleBackgroundClick = useCallback(() => {
    dispatch(windowActions.closeModal());
  }, []);

  let current: ReactNode = <></>;
  switch (currentModal) {
    case 'copyright':
      current = <CopyrightModal onClose={handleBackgroundClick} />;
      break;
    case 'updateInfo':
      current = <UpdateInfo onClose={handleBackgroundClick} />;
      break;
    case 'general-detail':
      if (generalIdxForDetail != null) {
        current = (
          <GeneralDetail
            generalIdx={generalIdxForDetail}
            onClose={handleBackgroundClick}
          />
        );
      }
      break;
  }

  return (
    <div className={classNames('modal', `modal-${currentModal}`)}>
      <div className="modal-bg" onClick={handleBackgroundClick} />
      {current}
    </div>
  );
};
