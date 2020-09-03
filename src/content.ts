function injectScript(file_path: string, tag: string) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.extension.getURL("injected.js"), "body");

//for background initiated messages
chrome.runtime.onMessage.addListener((request) => {
  if (request.from === "background") {
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
