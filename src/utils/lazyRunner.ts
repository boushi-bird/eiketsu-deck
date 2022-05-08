import { sleep } from './sleep';

export const createLazyRunner = (delayTime = 500) => {
  let handleId: number | undefined;

  return {
    run(callback: () => void) {
      if (handleId != null) {
        cancelIdleCallback(handleId);
      }
      handleId = requestIdleCallback(async () => {
        await sleep(delayTime);
        callback();
        handleId = undefined;
      });
    },
  };
};
