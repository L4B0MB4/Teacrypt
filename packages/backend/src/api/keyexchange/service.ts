import NodeRSA from 'node-rsa';

import { RSA_KEYS } from '../../keys';

const ownKeys = new NodeRSA({ b: 2064 });

ownKeys.importKey(RSA_KEYS.PRIVATE, "private");

ownKeys.importKey(RSA_KEYS.PUBLIC, "public");

export const getPublicKey = () => {
  return RSA_KEYS.PUBLIC;
};

export const encrypt = (toEncrypt: string, publicKey: NodeRSA.Key) => {
  const foreignKey = new NodeRSA(publicKey, "public");
  return foreignKey.encrypt(toEncrypt, "base64");
};

export const decrypt = (toDecrypt: string) => {
  return ownKeys.decrypt(toDecrypt, "utf8");
};
