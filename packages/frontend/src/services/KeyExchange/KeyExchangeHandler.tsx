import { requestAPI } from '../API/APIService';
import { AuthenticationHandler } from '../Auth/AuthenticationHandler';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';

class KeyEchangeHandlerC {
  PATH = "/keyexchange";

  share = async () => {
    if (!AuthenticationHandler.userId) return;
    const userShare = "392-181-355-662-631";
    const res = await requestAPI<{ publicKey: string }>("GET", this.PATH + "/getPublicKey", {
      userId: userShare,
    });
    if (!res?.publicKey) {
      throw new Error("Share wasn't successfull");
    }
    EncryptionHandler.importKey(res.publicKey, "public", true, userShare);
    const aesKey = EncryptionHandler.getAesKey(AuthenticationHandler.userId);
    if (aesKey) {
      const aesKeyEncrpytedParticipant = EncryptionHandler.encrypt(aesKey, false, userShare);
      const shareRes = await requestAPI<{ success: string }>("POST", this.PATH + "/sharekey", {
        participantKey: aesKeyEncrpytedParticipant,
        participantID: userShare,
      });
      if (!shareRes?.success) {
        throw new Error("Share wasn't successfull");
      }
    }
  };

  getParticipantKeys = async () => {
    const res = await requestAPI<Array<{ sharerId: string; aesKey: string }>>("Get", this.PATH + `/participantkeys`);
    if (res) {
      if (res.length) {
        res.forEach((item) => {
          try {
            const aes = EncryptionHandler.decrypt(item.aesKey);
            EncryptionHandler.addAesKey(item.sharerId, aes);
          } catch (ex) {
            console.error(ex);
          }
        });
      }
    } else {
      throw new Error("Problem while getting participant keys");
    }
  };
}

export const KeyEchangeHandler = new KeyEchangeHandlerC();
