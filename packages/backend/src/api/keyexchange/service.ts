import NodeRSA from 'node-rsa';

import { SessionStore } from '../../utils/session';
import { KeyModel } from './model';

const ownKeys = new NodeRSA({ b: 2064 });

export const getPublicKey = () => {
  return ownKeys.exportKey("public");
};

export const initiateAuthentication = async (sessionID: string, publicKey: string) => {
  new NodeRSA(publicKey, "public");
  const result = await KeyModel.findOne({ publicKey });
  if (result) {
    return SessionStore.getOrGenerateSession(sessionID, result.publicKey).authenticator;
  } else {
    const keyM = new KeyModel();
    keyM.publicKey = publicKey;
    await keyM.save();
    return SessionStore.getOrGenerateSession(sessionID, keyM.publicKey).authenticator;
  }
};

export const validateAuthentication = (sessionID: string, authenticator: string) => {
  if (authenticator === SessionStore.getSession(sessionID).authenticator) {
    SessionStore.validateSession(sessionID);
    return true;
  } else {
    return false;
  }
};

export const encrypt = (toEncrypt: string, publicKey: string) => {
  const foreignKey = new NodeRSA(publicKey, "public");
  const result = foreignKey.encrypt(toEncrypt, "base64");
  return result;
};

export const decrypt = (toDecrypt: string) => {
  return ownKeys.decrypt(toDecrypt, "utf8");
};
