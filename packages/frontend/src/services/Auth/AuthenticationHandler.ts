import { requestAPI } from '../API/APIService';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';

class AuthenticationHandlerC {
  userId?: string;
  PATH = "/authentication";
  constructor() {
    // this will be done with chrome.store soon
    const pubk = localStorage.getItem("publicKey");
    const prik = localStorage.getItem("privateKey");
    if (pubk && prik) {
      EncryptionHandler.importKey(pubk, "public");
      EncryptionHandler.importKey(prik, "private");
    } else {
      EncryptionHandler.createNewRSA();
      localStorage.setItem("publicKey", EncryptionHandler.exportKey("public"));
      localStorage.setItem("privateKey", EncryptionHandler.exportKey("private"));
    }
  }

  authenticate = async () => {
    const res = await requestAPI<{ publicKey: string }>("GET", `${this.PATH}/public-key`);
    if (res && res.publicKey) {
      EncryptionHandler.importKey(res.publicKey, "public", true);
      const authRes = await requestAPI<{ authenticator: string }>("POST", `${this.PATH}/authenticate`, {
        publicKey: EncryptionHandler.exportKey("public"),
      });
      if (authRes && authRes.authenticator) {
        const plainAuthenticator = EncryptionHandler.decrypt(authRes.authenticator);
        const authenticator = EncryptionHandler.encrypt(plainAuthenticator);
        const validationRes = await requestAPI<{ userId: string }>("POST", `${this.PATH}/validate`, {
          authenticator,
        });
        if (validationRes && validationRes.userId) {
          this.userId = validationRes.userId;
          return this.userId;
        }
      }
    }
  };
}

export const AuthenticationHandler = new AuthenticationHandlerC();
