import NodeRSA from 'node-rsa';

import { EncryptionHandler } from './EncryptionHandler';

const rsa = new NodeRSA({ b: 512 });
const rsaN = new NodeRSA({ b: 512 });
const rsaU = new NodeRSA({ b: 512 });
describe("EncryptionHandler Service", () => {
  it("key creation", async () => {
    const keys = EncryptionHandler._getOwnRSAKeys();
    EncryptionHandler.createNewRSA();
    const newKeys = EncryptionHandler._getOwnRSAKeys();
    expect(keys.isPublic()).toBeFalsy();
    expect(keys.isEmpty()).toBe(true);
    expect(newKeys.exportKey("public")).toBeTruthy();
    expect(newKeys.isPublic()).toBe(true);
  });
  it("import key", async () => {
    let err;
    try {
      EncryptionHandler.importKey("notRealKey", "public");
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
    EncryptionHandler.importKey(rsa.exportKey("public"), "public");
    EncryptionHandler.importKey(rsa.exportKey("private"), "private");
    const keys = EncryptionHandler._getOwnRSAKeys();
    expect(keys.exportKey("public")).toBe(rsa.exportKey("public"));
    expect(keys.exportKey("private")).toBe(rsa.exportKey("private"));
    EncryptionHandler.importKey(rsa.exportKey("public"), "public", true);
    expect(EncryptionHandler._getServerRSAKey().exportKey("public")).toBe(rsa.exportKey("public"));
    EncryptionHandler.importKey(rsa.exportKey("public"), "public", true, "newUser");
    expect(EncryptionHandler._getUserKeys().find((item) => item.id === "newUser")?.publicKey).toBe(
      rsa.exportKey("public")
    );
    EncryptionHandler.importKey(rsa.exportKey("public"), "public", true, "newUser");
    expect(EncryptionHandler._getUserKeys().find((item) => item.id === "newUser")?.publicKey).toBe(
      rsa.exportKey("public")
    );
  });
  it("decrypt public", async () => {
    EncryptionHandler.importKey(rsa.exportKey("private"), "private");
    const encr = rsa.encrypt("hello", "base64");
    const result = EncryptionHandler.decrypt(encr);
    expect(result).toBe("hello");
  });
  it("encrypt public", async () => {
    EncryptionHandler.importKey(rsaN.exportKey("public"), "public");
    const result = EncryptionHandler.encrypt("hello", true);
    const decr = rsaN.decrypt(result, "utf8");
    expect(decr).toBe("hello");
    EncryptionHandler.importKey(rsa.exportKey("public"), "public", true);
    const resultServer = EncryptionHandler.encrypt("hello", false);
    const decrServer = rsa.decrypt(resultServer, "utf8");
    expect(decrServer).toBe("hello");
    EncryptionHandler.importKey(rsaU.exportKey("public"), "public", true, "encrUser");
    const resultUser = EncryptionHandler.encrypt("hello", false, "encrUser");
    const decrUser = rsaU.decrypt(resultUser, "utf8");
    let err;
    try {
      rsa.decrypt(resultUser, "utf8");
    } catch (e) {
      err = e;
    }
    expect(decrUser).toBe("hello");
    expect(err).toBeTruthy();
    err = undefined;
    try {
      EncryptionHandler.encrypt("hello", false, "encrUserNotThere");
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
  });
  it("adds aes key", async () => {
    EncryptionHandler.importKey(rsaU.exportKey("public"), "public", true, "aesUser");
    expect(EncryptionHandler.getAllParticipantAesKeys().length).toBe(0);
    EncryptionHandler.addAesKey("aesUser", "myaeskey");
    expect(EncryptionHandler.getAllParticipantAesKeys().length).toBe(1);
    EncryptionHandler.addAesKey("aesUser", "mydifferentaeskey");
    expect(EncryptionHandler.getAllParticipantAesKeys().length).toBe(1);
  });
  it("gets aes key", async () => {
    EncryptionHandler.importKey(rsaU.exportKey("public"), "public", true, "aesGetUser");
    EncryptionHandler.addAesKey("aesGetUser", "myaeskey");
    expect(EncryptionHandler.getAesKey("aesGetUser")).toBe("myaeskey");
    expect(EncryptionHandler.getAesKey("aesGetUserXXX")).toBeFalsy();
  });
  it("gets participant aes key", async () => {
    const currentLength = EncryptionHandler.getAllParticipantAesKeys().length;
    EncryptionHandler.importKey(rsaU.exportKey("public"), "public", true, "aesParticipant");
    EncryptionHandler.addAesKey("aesParticipant", "myaeskey");
    expect(EncryptionHandler.getAllParticipantAesKeys().length).toBeGreaterThan(currentLength);
  });
});
