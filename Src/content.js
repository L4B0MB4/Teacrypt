console.log("Trying to hook teams");

HTMLDivElement.prototype.realAddEventListener = HTMLDivElement.prototype.addEventListener;

HTMLDivElement.prototype.addEventListener = function (a, b, c) {
  this.realAddEventListener(a, b, c);
  if (!this.lastListenerInfo) {
    this.lastListenerInfo = new Array();
  }
  this.lastListenerInfo.push({ type: a, fn: b, thirdEventParam: c });
};

let textbox;

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
  let listener = textbox.lastListenerInfo.find((item) => item.type === "keydown");
  if (!listener) {
    console.error("no listener found - aborting mission");
    return;
  }
  listener = listener.fn;
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
  var keyIv = window.generateKeyAndIV();
  var keyIVObj = window.splitKeyAndIV(keyIv);
  var encryptedText = window.encrypt("My AES encrypt-decrypt is working with padding!!!", keyIVObj.key, keyIVObj.iv);
  var decryptedText = window.decrypt(encryptedText, keyIVObj.key, keyIVObj.iv);
  console.log(encryptedText, decryptedText);
}
