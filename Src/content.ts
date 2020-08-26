import './aes';

import * as aesHelper from './aes_helper';

console.log("nice");

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

function writeIntoTextbox() {
  test();
  console.log("starting mission");
  let listenerComplete = textbox.lastListenerInfo.find((item) => item.type === "keydown");
  if (!listenerComplete) {
    console.error("no listener found - aborting mission");
    return;
  }
  const listener = listenerComplete.fn;
  textbox.removeEventListener("keydown", listener);

  textbox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      textbox.innerHTML = "replacement";
      console.log("replacing text");
    }
    listener(e);
  });
}

function test() {
  var keyIv = aesHelper.generateKeyAndIV();
  var keyIVObj = aesHelper.splitKeyAndIV(keyIv);
  var encryptedText = aesHelper.encrypt("My AES encrypt-decrypt is working with padding!!!", keyIVObj.key, keyIVObj.iv);
  var decryptedText = aesHelper.decrypt(encryptedText, keyIVObj.key, keyIVObj.iv);
  console.log(encryptedText, decryptedText);
}
