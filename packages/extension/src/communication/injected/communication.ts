import { ComHelp, EventListener } from '@teacrypt/common';

class CommunicationC extends EventListener {
  connections: any = {};

  constructor() {
    super();
    this.initCommunication();
  }
  initCommunication = () => {
    window.onmessage = (e: MessageEvent) => {
      if (typeof e !== "object" || e === null || !e.data || e.data.from === ComHelp.FROM.WEBPAGE || !e.data.type) {
        return;
      }
      this.emit(e.data.type, e.data.data);
    };
  };

  sendMessage = (type: string, data?: any) => {
    window.postMessage({ from: ComHelp.FROM.WEBPAGE, type, data: data || {} }, "*");
  };
}

export const Communication = new CommunicationC();
