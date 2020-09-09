import * as NodeRSA from 'node-rsa';

import { RSA_KEYS } from '../../keys';
import { KeyModel } from './model';

const ownKeys = new NodeRSA({ b: 2064 });

ownKeys.importKey(RSA_KEYS.PRIVATE, "private");

ownKeys.importKey(RSA_KEYS.PUBLIC, "public");

export const getPublicKey = () => {
  return RSA_KEYS.PUBLIC;
};

export const encrypt = (toEncrypt: string, publicKey: NodeRSA.Key) => {
  const foreignKey = new NodeRSA(publicKey, "public");
  const result = foreignKey.encrypt(toEncrypt, "base64");
  const keyM = new KeyModel();
  keyM.publicKey = publicKey.toString();
  keyM.save();
  return result;
};

export const decrypt = (toDecrypt: string) => {
  return ownKeys.decrypt(toDecrypt, "utf8");
};
