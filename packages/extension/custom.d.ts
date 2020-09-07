export {};
declare global {
  interface Window {
    aesjs: any;
  }

  interface HTMLDivElement {
    realAddEventListener: (
      type: string,
      event_listener: EventListener,
      options?: boolean | AddEventListenerOptions
    ) => void;
  }
}
