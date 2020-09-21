import NodeRSA from 'node-rsa';

class EncryptionHandlerC {
  private rsaKey: NodeRSA = new NodeRSA();
  private serverRsa: NodeRSA = new NodeRSA();

  private userKeys: Array<{ id: string; publicKey?: NodeRSA.Key; aes?: string }> = [];

  createNewRSA = () => {
    this.rsaKey = new NodeRSA({ b: 2048 });
  };

  importKey = (key: string, keyType: "public" | "private", foreign?: boolean, userId?: string) => {
    if (foreign) {
      if (!userId) {
        this.serverRsa.importKey(key, keyType);
      } else {
        const found = this.userKeys.find((item) => item.id === userId);
        if (!found) {
          this.userKeys.push({ id: userId, publicKey: key });
        } else {
          /*ToDo: Test ! */
          found.publicKey = key;
        }
      }
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

  encrypt = (toEncrypt: string, own?: boolean, userId?: string) => {
    if (own) {
      return this.rsaKey.encrypt(toEncrypt, "base64");
    } else {
      if (!userId) {
        return this.serverRsa.encrypt(toEncrypt, "base64");
      } else {
        const found = this.userKeys.find((item) => item.id === userId);
        if (found && found.publicKey) {
          const tempRSA = new NodeRSA();
          tempRSA.importKey(found.publicKey, "public");
          return tempRSA.encrypt(toEncrypt, "base64");
        } else {
          throw new Error("Not implemented yet");
        }
      }
    }
  };

  addAesKey = (userId: string, aes: string) => {
    const found = this.userKeys.find((item) => item.id === userId);
    if (found) {
      found.aes = aes;
    } else {
      this.userKeys.push({ id: userId, aes });
    }
  };

  getAesKey = (userId: string) => {
    return this.userKeys.find((item) => item.id === userId);
  };
}

export const EncryptionHandler = new EncryptionHandlerC();
