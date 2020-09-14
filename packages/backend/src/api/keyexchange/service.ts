import NodeRSA from 'node-rsa';

import { SessionStore } from '../../utils/sessions';
import { KeyModel } from './model';

const ownKeys = new NodeRSA({ b: 2064 });

export const getPublicKey = () => {
  return ownKeys.exportKey("public");
};

export const authenticate = async (publicKey: string) => {
  new NodeRSA(publicKey, "public");
  const result = await KeyModel.findOne({ publicKey });
  if (result) {
    return SessionStore.getOrGenerateSession(result.publicKey);
  } else {
    const keyM = new KeyModel();
    keyM.publicKey = publicKey.toString();
    await keyM.save();
    return SessionStore.getOrGenerateSession(keyM.publicKey);
  }
};

export const encrypt = (toEncrypt: string, publicKey: string) => {
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
