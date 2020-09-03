document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.getElementById("generateKey").addEventListener("click", () => {
      console.log("generateKey");
      document.getElementById("myCurrentKey").value = "myval";
      console.log(chrome);
    });
  },
  false
);

var connections = {};

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("incoming message from injected script");
  console.log(request);
  sendResponse({ from: "background", msg: "hello webpage" });

  return true;
});

chrome.runtime.onConnect.addListener(function (port) {
  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(function (request) {
    console.log("incoming message from dev tools page");

    // Register initial connection
    if (request.name == "init") {
      connections[request.tabId] = port;

      port.onDisconnect.addListener(function () {
        delete connections[request.tabId];
      });

      return;
    }
  });
});
