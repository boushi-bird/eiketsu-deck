import { useEffect } from 'react';

import { createSelector } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { useAppSelector, windowSelector } from '@/hooks';
import { windowActions } from '@/modules/window';

export const toastMessageSelector = createSelector(
  windowSelector,
  ({ toastMessage }) => toastMessage
);

export const Toast = () => {
  const dispatch = useDispatch();
  const message = useAppSelector(toastMessageSelector);

  useEffect(() => {
    if (message == null) {
      return;
    }

    setTimeout(() => {
      dispatch(windowActions.clearToast());
    }, 2000);
  }, [message, dispatch]);

  if (message == null) {
    return <></>;
  }

  return (
    <div className="toast">
      <span className="toast-message">{message}</span>
    </div>
  );
};
