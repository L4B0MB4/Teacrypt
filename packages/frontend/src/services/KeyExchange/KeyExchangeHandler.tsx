import { generateKeyAndIV } from '@teacrypt/common/dist/aes/aesHelper';

import { requestAPI } from '../API/APIService';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';

class KeyEchangeHandlerC {
  PATH = "/keyexchange";
  share = async () => {
    const res = await requestAPI<{ publicKey: string }>("GET", this.PATH + "/getPublicKey", {
      userId: "374-054-813-793",
    });
    if (!res?.publicKey) {
      throw new Error("Share wasn't successfull");
    }
    EncryptionHandler.importKey(res.publicKey, "public", true, "374-054-813-793");
    const aesKey = generateKeyAndIV();
    const aesKeyEncrpytedSharer = EncryptionHandler.encrypt(aesKey, true);
    const aesKeyEncrpytedParticipant = EncryptionHandler.encrypt(aesKey, false, "374-054-813-793");
    const shareRes = await requestAPI<{ success: string }>("POST", this.PATH + "/sharekey", {
      sharerKey: aesKeyEncrpytedSharer,
      participantKey: aesKeyEncrpytedParticipant,
      participantID: "374-054-813-793",
    });
    if (!shareRes?.success) {
      throw new Error("Share wasn't successfull");
    }
  };

  getParticipantKeys = async () => {
    const res = await requestAPI<Array<{ participantId: string; aesKey: string }>>(
      "Get",
      this.PATH + `/participantkeys`
    );
    if (res) {
      if (res.length) {
        res.forEach((item) => {
          try {
            const aes = EncryptionHandler.decrypt(item.aesKey);
            EncryptionHandler.addAesKey(item.participantId, aes);
          } catch (ex) {
            console.error(ex);
          }
        });
      }
      console.log(EncryptionHandler);
    } else {
      throw new Error("Problem while getting participant keys");
    }
  };
}

export const KeyEchangeHandler = new KeyEchangeHandlerC();
