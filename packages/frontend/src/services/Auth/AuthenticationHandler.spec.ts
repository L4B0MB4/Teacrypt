import 'jest-webextension-mock';

import { requestAPI } from '../API/APIService';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';
import { AuthenticationHandlerC } from './AuthenticationHandler';

jest.mock("../API/APIService");

beforeEach(() => {
  localStorage.clear();
  EncryptionHandler.createNewRSA = jest.fn(() => {});
  EncryptionHandler.exportKey = jest.fn((type) => type);
  EncryptionHandler.importKey = jest.fn(() => {});
  EncryptionHandler.decrypt = jest.fn((io) => io);
  EncryptionHandler.encrypt = jest.fn((io) => io);
});

describe("AuthenticationHandler Service", () => {
  it("constructor sets correct values - without key", async () => {
    expect(localStorage.getItem("publicKey")).toBe(null);
    const authH = new AuthenticationHandlerC();
    expect(authH.userId).toBe(undefined);
    expect(localStorage.getItem("publicKey")).toBe("public");
    expect(localStorage.getItem("privateKey")).toBe("private");
    expect(EncryptionHandler.createNewRSA).toBeCalledTimes(1);
    expect(EncryptionHandler.exportKey).toBeCalledTimes(2);
    expect(EncryptionHandler.importKey).toBeCalledTimes(0);
  });

  it("constructor sets correct values - with key", async () => {
    expect(localStorage.getItem("publicKey")).toBe(null);
    localStorage.setItem("publicKey", "testPublic");
    localStorage.setItem("privateKey", "testPrivate");
    expect(localStorage.getItem("publicKey")).toBe("testPublic");
    expect(localStorage.getItem("privateKey")).toBe("testPrivate");
    const authH = new AuthenticationHandlerC();
    expect(authH.userId).toBe(undefined);
    expect(localStorage.getItem("publicKey")).toBe("testPublic");
    expect(localStorage.getItem("privateKey")).toBe("testPrivate");
    expect(EncryptionHandler.createNewRSA).toBeCalledTimes(0);
    expect(EncryptionHandler.exportKey).toBeCalledTimes(0);
    expect(EncryptionHandler.importKey).toBeCalledTimes(2);
  });

  it("authentication", async () => {
    const authH = new AuthenticationHandlerC();
    const mockedRequestAPI = (requestAPI as any) as jest.Mock<Promise<any>>;
    mockedRequestAPI.mockImplementationOnce(async () => {
      return {};
    });
    const emptyRes = await requestAPI("GET", "");
    expect(JSON.stringify(emptyRes)).toBe(JSON.stringify({}));
    let result = await authH.authenticate();
    expect(result).toBe(undefined);
    mockedRequestAPI.mockImplementation(async (_, path: string) => {
      if (path.includes("public-key")) {
        return { publicKey: "publicKey" };
      }
      if (path.includes("authenticate")) {
        return { authenticator: "authenticator" };
      }
      if (path.includes("validate")) {
        return { userId: "userId", aesKey: "aesKey" };
      }
      return {};
    });
    result = await authH.authenticate();
    expect(result).toBe("userId");
    expect(EncryptionHandler.decrypt).toBeCalledTimes(2);
    expect(EncryptionHandler.encrypt).toBeCalledTimes(1);
    expect(requestAPI).toBeCalledTimes(5);
  });
});
