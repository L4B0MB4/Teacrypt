import { aesHelper } from '@teacrypt/common';

import { requestAPI } from '../API/APIService';

class KeyEchangeHandlerC {
  PATH = "/keyexchange";
  share = () => {
    const res = requestAPI<{ publicKey: string }>("GET", this.PATH + "/getPublicKey", { userId: "374-054-813-793" });
    console.log(res, aesHelper);
  };
}

export const KeyEchangeHandler = new KeyEchangeHandlerC();
