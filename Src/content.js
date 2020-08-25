console.log("Trying to hook teams");

const chats = {
  telegram: {
    placeholder: ".composer_rich_textarea",
    input: ".im_message_field",
    outerTextField: ".im_message_outer_wrap .im_message_wrap",
    messageField:
      ".im_message_outer_wrap .im_message_wrap .im_content_message_wrap .im_message_text",
  },
  teams: {
    placeholder: ".ts-edit-box >:nth-child(3)>*>:nth-child(2)>*",
  },
};
let currentChat = "teams";
let placeholder;
let input;
let messages = [];
HTMLDivElement.prototype.realAddEventListener =
  HTMLDivElement.prototype.addEventListener;

HTMLDivElement.prototype.addEventListener = function (a, b, c) {
  this.realAddEventListener(a, b, c);
  if (!this.lastListenerInfo) {
    this.lastListenerInfo = new Array();
  }
  this.lastListenerInfo.push({ type: a, fn: b, thirdEventParam: c });
};

//setTimeout(hookTextbox, 10);

function hookTextbox() {
  if (!placeholder && !input) {
    placeholder = document.querySelector(chats[currentChat].placeholder);
    input = document.querySelector(chats[currentChat].input);
    setTimeout(hookTextbox, 10);
  } else {
    writeIntoTextbox();
  }
}
function addDecryptClickButton(e) {
  var btn = document.createElement("BUTTON"); // Create a <button> element
  btn.className = "decrypt-button";
  btn.setAttribute("style", "position:absolute; top: 60px;left: 10px;");
  btn.innerHTML = "CLICK ME"; // Insert text
  e.currentTarget.appendChild(btn);
  e.currentTarget.removeEventListener("mouseover", addDecryptClickButton);
  e.currentTarget.addEventListener("mouseout", removeDecryptClickButton, true);
}
function removeDecryptClickButton(e) {
  let btn = e.currentTarget.querySelector(".decrypt-button");
  e.currentTarget.removeChild(btn);
  e.currentTarget.removeEventListener("mouseout", removeDecryptClickButton);
  e.currentTarget.addEventListener("mouseover", addDecryptClickButton);
}
function hookMessages() {
  if (messages && messages.length === 0) {
    messages = document.querySelectorAll(chats[currentChat].outerTextField);
    return setTimeout(hookMessages, 10);
  }

  messages.forEach((x) =>
    x.addEventListener("mouseover", addDecryptClickButton, true)
  );
}

function writeIntoTextbox() {
  console.log("starting mission");
  let listener =
    placeholder.lastListenerInfo &&
    placeholder.lastListenerInfo.find((item) => item.type === "keydown");
  /* if (!listener) {
    console.error("no listener found - aborting mission");
    return;
  }
  listener = listener.fn;
  textbox.removeEventListener("keydown", listener); */

  placeholder.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      placeholder.innerHTML = test(input.value);
      console.log("replacing text");
    }
    if (listener) {
      listener.fn(e);
    }
  });
}

function test(message) {
  var keyIv = window.generateKeyAndIV();
  var keyIVObj = window.splitKeyAndIV(keyIv);
  var encryptedText = window.encrypt(message, keyIVObj.key, keyIVObj.iv);
  var decryptedText = window.decrypt(encryptedText, keyIVObj.key, keyIVObj.iv);
  console.log(encryptedText, decryptedText);

  return encryptedText;
}

(function () {
  // your page initialization code here
  // the DOM will be available here

  const host = window.location.host;

  if (host === "web.telegram.org") {
    console.log("is telegram");
    currentChat = "telegram";
  }
  hookMessages();
  hookTextbox();
})();
