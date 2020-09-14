import NodeRSA from "node-rsa";

import * as Service from "./service";

describe("Keyexchange Service", () => {
  it("encryption should generate same results", () => {
    const keys = new NodeRSA({ b: 512 });
    const encrypted = Service.encrypt("hello", keys.exportKey("public"));
    const decrypted = keys.decrypt(encrypted, "utf8");
    expect(decrypted).toBe("hello");
  });
  it("should decrypt encrypted data", () => {
    const keys = new NodeRSA({ b: 512 });
    const publicKey = Service.getPublicKey();
    expect(publicKey).not.toBeFalsy();
    keys.importKey(publicKey, "public");
    const encrypted = keys.encrypt("hello", "base64");
    expect(Service.decrypt(encrypted)).toBe("hello");
  });
});
