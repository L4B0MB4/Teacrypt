function injectScript(file_path: string, tag: string) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.extension.getURL("injected.js"), "body");

window.addEventListener("message", function (event) {
  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== "object" || message === null) {
    return;
  }

  //prevent looping messages
  if (message.from === "background") {
    return;
  }

  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }

    //prevent looping messages
    if (response.from === "webpage") {
      return;
    }
    window.postMessage(response, "*");
  });
});
