import 'jest-webextension-mock';

import { ComHelp } from '@teacrypt/common';

import { Communication } from './communication';

describe("Background Communication", () => {
  it("Testing basic event listening", () => {
    const listener = jest.fn();
    Communication.addListener("x", listener);
    Communication.emit("x", "y");
    expect(listener).toBeCalledTimes(1);
    Communication.removeListener(listener);
    Communication.emit("x", "y");
    expect(listener).toBeCalledTimes(1);
  });
  it("Sending messages", () => {
    Communication.sendMessage("x", "hello");
    expect(chrome.tabs.query).toBeCalled();
    expect(chrome.tabs.sendMessage).toBeCalled();
  });
  it("Init communication", () => {
    expect(chrome.runtime.onMessage.addListener).toBeCalled();
    expect(chrome.runtime.onConnect.addListener).toBeCalled();
    const listener = jest.fn();
    Communication.addListener("x", listener);
    chrome.runtime.sendMessage({ type: "y" });
    expect(listener).not.toBeCalled();
    chrome.runtime.sendMessage({ type: "x", from: ComHelp.FROM.WEBPAGE });
    expect(listener).toBeCalled();
  });
});
