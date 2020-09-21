import { generateKeyAndIV } from '@teacrypt/common/dist/aes/aesHelper';

import { requestAPI } from '../API/APIService';
import { EncryptionHandler } from '../Encryption/EncryptionHandler';

class KeyEchangeHandlerC {
  PATH = "/keyexchange";
  share = async () => {
    const res = await requestAPI<{ publicKey: string }>("GET", this.PATH + "/getPublicKey", {
      userId: "374-054-813-793",
    });
    if (res?.publicKey) {
      EncryptionHandler.importKey(res.publicKey, "public", true, "374-054-813-793");
      const aesKey = generateKeyAndIV();
      const aesKeyEncrpytedSharer = EncryptionHandler.encrypt(aesKey, true);
      const aesKeyEncrpytedParticipant = EncryptionHandler.encrypt(aesKey, false, "374-054-813-793");
      const shareRes = await requestAPI<{ publicKey: string }>("POST", this.PATH + "/sharekey", {
        sharerKey: aesKeyEncrpytedSharer,
        participantKey: aesKeyEncrpytedParticipant,
        participantID: "374-054-813-793",
      });
      console.log(shareRes);
    } else {
      throw new Error("Share wasn't successfull");
    }
  };
}

export const KeyEchangeHandler = new KeyEchangeHandlerC();
