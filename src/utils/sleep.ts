export const sleep = (milliSec: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, milliSec));

export const nextTick = (): Promise<void> => sleep(0);
