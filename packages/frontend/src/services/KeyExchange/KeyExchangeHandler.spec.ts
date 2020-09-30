import 'jest-webextension-mock';

import { requestAPI } from '../API/APIService';
import { AuthenticationHandler } from '../Auth/AuthenticationHandler';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';
import { KeyExchangeHandler } from './KeyExchangeHandler';

jest.mock("../API/APIService");

beforeEach(() => {
  EncryptionHandler.createNewRSA = jest.fn(() => {});
  EncryptionHandler.exportKey = jest.fn((type) => type);
  EncryptionHandler.importKey = jest.fn(() => {});
  EncryptionHandler.decrypt = jest.fn((io) => io);
  EncryptionHandler.encrypt = jest.fn((io) => io);
  EncryptionHandler.getAesKey = jest.fn(() => "myAesKey");
  EncryptionHandler.addAesKey = jest.fn(() => {});
  AuthenticationHandler.userId = "myOwnId";
});

describe("KeyExchangeHandler Service", () => {
  it("shares aes key", async () => {
    const mockedRequestAPI = (requestAPI as any) as jest.Mock<Promise<any>>;
    mockedRequestAPI.mockImplementation(async (_, path: string) => {
      if (path.includes("publicKey")) {
        return { publicKey: "publicKey" };
      }
      if (path.includes("sharekey")) {
        return { success: true };
      }
    });
    await KeyExchangeHandler.share("userToShare");
    expect(EncryptionHandler.getAesKey).toBeCalledTimes(1);
    expect(EncryptionHandler.importKey).toBeCalledTimes(1);
    expect(EncryptionHandler.encrypt).toBeCalledTimes(1);

    EncryptionHandler.getAesKey = jest.fn(() => undefined);
    const result = await KeyExchangeHandler.share("userToShare");
    expect(result).toBe(undefined);
    EncryptionHandler.getAesKey = jest.fn(() => "myAesKey");

    mockedRequestAPI.mockImplementation(async (_, path: string) => {
      return {};
    });
    let err;
    try {
      await KeyExchangeHandler.share("userToShare");
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
    mockedRequestAPI.mockImplementation(async (_, path: string) => {
      if (path.includes("publicKey")) {
        return { publicKey: "publicKey" };
      }
      return {};
    });
    err = undefined;
    try {
      await KeyExchangeHandler.share("userToShare");
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
    AuthenticationHandler.userId = undefined;
    expect(await KeyExchangeHandler.share("userToShare")).toBe(undefined);
  });

  it("get participant aes keys", async () => {
    const mockedRequestAPI = (requestAPI as any) as jest.Mock<Promise<any>>;
    mockedRequestAPI.mockImplementation(async () => {
      return [
        { sharerId: "sharerId", aesKey: "aesKey" },
        { sharerId: "sharerId1", aesKey: "aesKey1" },
      ];
    });
    await KeyExchangeHandler.getParticipantKeys();
    expect(EncryptionHandler.addAesKey).toBeCalledTimes(2);
    expect(EncryptionHandler.decrypt).toBeCalledTimes(2);

    console.error = jest.fn();
    EncryptionHandler.decrypt = jest.fn(() => {
      throw new Error();
    });
    await KeyExchangeHandler.getParticipantKeys();
    expect(console.error).toBeCalledTimes(2);

    mockedRequestAPI.mockImplementation(async () => {
      return undefined;
    });
    let err;
    try {
      await KeyExchangeHandler.getParticipantKeys();
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
});
