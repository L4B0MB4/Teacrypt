import NodeRSA from 'node-rsa';

import { requestAPI } from '../API/APIService';

class AuthenticationHandlerC {
  rsaKey: NodeRSA;
  serverRsa: NodeRSA = new NodeRSA();

  sessionId?: string;
  constructor() {
    // this will be done with chrome.store soon
    const pubk = localStorage.getItem("publicKey");
    const prik = localStorage.getItem("privateKey");
    if (pubk && prik) {
      this.rsaKey = new NodeRSA();
      this.rsaKey.importKey(pubk, "public");
      this.rsaKey.importKey(prik, "private");
    } else {
      this.rsaKey = new NodeRSA({ b: 2048 });
      localStorage.setItem("publicKey", this.rsaKey.exportKey("public"));
      localStorage.setItem("privateKey", this.rsaKey.exportKey("private"));
    }
  }

  authenticate = async () => {
    const res = await requestAPI<{ publicKey: string }>("GET", "/keyexchange/public-key");
    if (res && res.publicKey) {
      this.serverRsa.importKey(res.publicKey, "public");
      const authRes = await requestAPI<{ sessionId: string }>("POST", "/keyexchange/authenticate", {
        publicKey: this.rsaKey.exportKey("public"),
      });
      if (authRes && authRes.sessionId) {
        this.sessionId = this.rsaKey.decrypt(authRes.sessionId, "utf8");
        console.log(this.sessionId);
      }
    }
  };
}

export const AuthenticationHandler = new AuthenticationHandlerC();
