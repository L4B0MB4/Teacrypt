import { aesHelper } from '@teacrypt/common';

import { Communication } from './communication/injected/communication';
import { MSG, OwnIdentifierPayload, StatusPayload } from './communication/types';
import Store from './encryption/store';
import { goOverTeamsChatMessages } from './Teams/teams';

let isActive = false;

Store.addKey(aesHelper.STATIC_DEV_KEY_IV, "chatIdent");

console.log("Trying to hook teams");
interface EnhancedHTMLDivElement extends HTMLDivElement {
  lastListenerInfo: Array<{ type: string; fn: EventListener; thirdEventParam?: boolean }>;
}

HTMLDivElement.prototype.realAddEventListener = HTMLDivElement.prototype.addEventListener;

HTMLDivElement.prototype.addEventListener = function (a: string, b: EventListener, c?: boolean) {
  this.realAddEventListener(a, b, c);
  if (!this.lastListenerInfo) {
    this.lastListenerInfo = new Array();
  }
  this.lastListenerInfo.push({ type: a, fn: b, thirdEventParam: c });
};

let textbox: EnhancedHTMLDivElement | undefined;

setTimeout(hookTextbox, 10);

function hookTextbox() {
  if (!textbox) {
    textbox = document.querySelector(".ts-edit-box >:nth-child(3)>*>:nth-child(2)>*");
    setTimeout(hookTextbox, 10);
  } else {
    writeIntoTextbox();
  }
}

const goOverChat = () => {
  if (isActive) {
    goOverTeamsChatMessages();
  }
  Communication.sendMessage(MSG.ONOFF, { status: isActive });
  setTimeout(goOverChat, 500);
};

function writeIntoTextbox() {
  console.log("starting mission");
  goOverChat();
  let listenerComplete = textbox.lastListenerInfo.find((item) => item.type === "keydown");
  if (!listenerComplete) {
    console.error("no listener found - aborting mission");
    return;
  }
  const listener = listenerComplete.fn;
  textbox.removeEventListener("keydown", listener);

  textbox.addEventListener("keydown", function (e) {
    console.log(isActive);
    if (e.key === "Enter" && isActive) {
      const key = Store.getKey("chatIdent");
      if (key) {
        textbox.innerHTML = aesHelper.encryptSimple(key, textbox.innerText);
      }
    }
    listener(e);
  });
}

Communication.addListener(MSG.ONOFF, (data: StatusPayload) => {
  isActive = data.status;
});

Communication.addListener(MSG.OWN_IDENTIFIER, (data: OwnIdentifierPayload) => {
  console.log(data);
});
