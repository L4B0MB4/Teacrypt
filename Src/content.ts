import './aes';

import * as aesHelper from './aes_helper';
import Store from './store';
import { goOverTeamsChatMessages } from './Teams/teams';

Store.addKey(aesHelper.STATIC_DEV_KEY_IV, "chatIdent");

console.log("Trying to hook teams");
interface EnhancedHTMLDivElement extends HTMLDivElement {
  lastListenerInfo: Array<{ type: string; fn: EventListener; thirdEventParam?: boolean }>;
}

//@ts-ignore
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
  goOverTeamsChatMessages();
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
    if (e.key === "Enter") {
      //todo ! check
      textbox.innerHTML = aesHelper.encryptSimple(Store.getKey("chatIdent")!, textbox.innerText);
      //setTimeout(goOverTeamsChatMessages, 500);
    }
    listener(e);
  });
}
