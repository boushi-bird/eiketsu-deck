declare module '*.png' {
  const value: string;
  export default value;
}

interface Window {
  __noticeEnabled: boolean | undefined;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;

  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  prompt(): Promise<void>;
}
