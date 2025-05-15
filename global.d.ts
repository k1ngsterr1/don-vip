// global.d.ts
export {};

declare global {
  interface Window {
    jivo_api?: {
      open: () => void;
      close: () => void;
      callPhone?: (phone: string) => void;
      setWidgetPosition?: (pos: { bottom: string; right: string }) => void;
      // и другие методы Jivo при необходимости
    };
  }
}
