import NodeRSA from 'node-rsa';

class EncryptionHandlerC {
  rsaKey: NodeRSA = new NodeRSA();
  serverRsa: NodeRSA = new NodeRSA();

  createNewRSA = () => {
    this.rsaKey = new NodeRSA({ b: 2048 });
  };

  importKey = (key: string, keyType: "public" | "private", foreign?: boolean) => {
    if (foreign) {
      this.serverRsa.importKey(key, keyType);
    } else {
      this.rsaKey.importKey(key, keyType);
    }
  };
  exportKey = (keyType: "public" | "private") => {
    return this.rsaKey.exportKey(keyType);
  };

  decrypt = (toDecrypt: string) => {
    return this.rsaKey.decrypt(toDecrypt, "utf8");
  };

  encrypt = (toEncrypt: string, own?: boolean) => {
    if (own) {
      return this.rsaKey.encrypt(toEncrypt, "base64");
    } else {
      return this.serverRsa.encrypt(toEncrypt, "base64");
    }
  };
}

export const EncryptionHandler = new EncryptionHandlerC();
