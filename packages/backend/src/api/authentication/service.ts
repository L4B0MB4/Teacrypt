import NodeRSA from 'node-rsa';

import { SessionStore } from '../../utils/session';
import { createId } from '../../utils/utils';
import { UserModel } from './model';

const ownKeys = new NodeRSA({ b: 2064 });

export const getPublicKey = () => {
  return ownKeys.exportKey("public");
};

export const initiateAuthentication = async (sessionID: string, publicKey: string) => {
  new NodeRSA(publicKey, "public");
  const result = await UserModel.findOne({ publicKey });
  if (result) {
    return SessionStore.getOrGenerateSession(sessionID, result.publicKey).authenticator;
  } else {
    const userM = new UserModel();
    userM.publicKey = publicKey;
    userM.id = createId();
    await userM.save();
    return SessionStore.getOrGenerateSession(sessionID, userM.publicKey).authenticator;
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

export const getUser = async (sessionID: string) => {
  const session = SessionStore.getSession(sessionID);
  if (session) {
    return await UserModel.findOne({ publicKey: session.publicKey });
  }
  return null;
};

export const getUserById = async (id: string) => {
  return await UserModel.findOne({ id });
};
