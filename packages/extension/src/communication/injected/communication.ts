import { EventListener } from '@teacrypt/common';

import { FROM } from '../types';

class CommunicationC extends EventListener {
  connections: any = {};

  constructor() {
    super();
    this.initCommunication();
  }
  initCommunication = () => {
    window.onmessage = (e: MessageEvent) => {
      if (typeof e !== "object" || e === null || !e.data || e.data.from === FROM.WEBPAGE || !e.data.type) {
        return;
      }
      this.emit(e.data.type, e.data.data);
    };
  };

  sendMessage = (type: string, data: any) => {
    window.postMessage({ from: FROM.WEBPAGE, type, data }, "*");
  };
}

export const Communication = new CommunicationC();