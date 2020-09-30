import { ComHelp, EventListener } from '@teacrypt/common';

class CommunicationC extends EventListener {
  connections: Record<number, chrome.runtime.Port> = {};

  constructor() {
    super();
    this.initCommunication();
  }
  initCommunication = () => {
    /* additional parameters 'sender, sendResponse' not used because window.postMessage has no sendResponse*/
    chrome.runtime.onMessage.addListener((request) => {
      if (request.from !== ComHelp.FROM.WEBPAGE || !request.type) return;
      this.emit(request.type, request.data);
      return true;
    });

    chrome.runtime.onConnect.addListener((port) => {
      // Listen to messages sent from the DevTools page
      port.onMessage.addListener((request) => {
        if (request.name === "init") {
          this.connections[request.tabId] = port;
          port.onDisconnect.addListener(() => {
            delete this.connections[request.tabId];
          });

          return;
        }
      });
    });
  };

  sendMessage = (type: string, data: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { from: ComHelp.FROM.BACKGROUND, type, data });
    });
  };
}

export const Communication = new CommunicationC();
