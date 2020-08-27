function injectScript(file_path: string, tag: string) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.extension.getURL("injected.js"), "body");

var node = document.getElementsByTagName("body")[0];
var speciala = document.createElement("a");
speciala.id = "teacrpyt";
speciala.innerHTML = chrome.runtime.id;
speciala.style.display = "none";
node.appendChild(speciala);

window.addEventListener("message", function (event) {
  // Only accept messages from same frame
  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== "object" || message === null || !message.hello) {
    return;
  }

  chrome.runtime.sendMessage(message);
});
