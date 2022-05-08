export const createLazyRunner = (delayTime = 500) => {
  let handleId: NodeJS.Timeout;

  return {
    run(callback: () => void) {
      clearTimeout(handleId);
      handleId = setTimeout(callback, delayTime);
    },
  };
};
