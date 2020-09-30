import mockingoose from 'mockingoose';
import NodeRSA from 'node-rsa';

import { SessionStore } from '../../utils/session';
import { UserModel } from './model';
import * as Service from './service';

beforeAll(() => {
  mockingoose(UserModel);
});
beforeEach(() => {
  mockingoose(UserModel).reset();
});
describe("Authentication Service", () => {
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

  it("should authenticate session", async () => {
    const sessionId = "123";
    const publicKey = new NodeRSA({ b: 128 }).exportKey("public");
    let result = await Service.initiateAuthentication(sessionId, publicKey);
    expect(result).toBeDefined();
    mockingoose(UserModel).toReturn({ publicKey }, "findOne");
    result = await Service.initiateAuthentication(sessionId, publicKey);
    expect(result).toBeDefined();
  });

  it("should validate a authentication ", async () => {
    const sessionId = "123";
    const publicKey = new NodeRSA({ b: 128 }).exportKey("public");
    let authenticator = await Service.initiateAuthentication(sessionId, publicKey);
    const session = SessionStore.getOrGenerateSession(sessionId, publicKey);
    expect(Service.validateAuthentication(sessionId, authenticator)).toBe(true);
    expect(Service.validateAuthentication(sessionId, session.authenticator)).toBe(true);
    expect(Service.validateAuthentication(authenticator, session.authenticator)).toBe(false);
  });

  it("should get User by sessionId ", async () => {
    const session = SessionStore.setSession("123", "234");
    mockingoose(UserModel).toReturn({ publicKey: "234" }, "findOne");
    let result = await Service.getUser("123");
    expect(result.publicKey).toBe(session.publicKey);
    result = await Service.getUser("345");
    expect(result).toBe(null);
  });
});
