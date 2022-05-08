import { sleep } from './sleep';

const createLazyRunnerDefault = (delayTime = 500) => {
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

const createLazyRunnerUseSetTimeourt = (delayTime = 500) => {
  let handleId: NodeJS.Timeout;

  return {
    run(callback: () => void) {
      clearTimeout(handleId);
      handleId = setTimeout(callback, delayTime);
    },
  };
};

export const createLazyRunner =
  'requestIdleCallback' in window
    ? createLazyRunnerDefault
    : createLazyRunnerUseSetTimeourt;
