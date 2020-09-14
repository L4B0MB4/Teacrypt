import 'jest-webextension-mock';

import { Communication } from './communication';
import { FROM } from './types';

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
    chrome.runtime.sendMessage({ type: "x", from: FROM.WEBPAGE });
    expect(listener).toBeCalled();
  });
});
