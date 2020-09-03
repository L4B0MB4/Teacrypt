const sendMessage = (data) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { from: "background", ...data });
  });
};

document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.getElementById("onoffStatus").addEventListener("click", () => {
      const val = document.getElementById("onoffStatus").checked;
      sendMessage({ status: val });
    });
  },
  false
);

var connections = {};

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.from !== "webpage") return;
  console.log(request);
  if (request.status !== undefined) {
    console.log(request.status);
    document.getElementById("onoffStatus").checked = request.status;
  }

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
