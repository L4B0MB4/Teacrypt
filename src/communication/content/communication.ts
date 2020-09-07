import { FROM } from '../types';

export const initCommunication = () => {
  //for background initiated messages
  chrome.runtime.onMessage.addListener((request) => {
    if (request.from === FROM.BACKGROUND) {
      window.postMessage(request, "*");
    }
    return true;
  });

  //for injected-script initiated messages
  window.addEventListener("message", function (event) {
    // Only accept messages from same frame
    if (event.source !== window) {
      return;
    }

    const message = event.data;

    if (typeof message !== "object" || message === null) {
      return;
    }

    //prevent looping messages
    if (message.from === FROM.BACKGROUND) {
      return;
    }
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.warn(chrome.runtime.lastError.message);
      }

      //prevent looping messages
      if (response.from === FROM.WEBPAGE) {
        return;
      }
      window.postMessage(response, "*");
    });
  });
};
