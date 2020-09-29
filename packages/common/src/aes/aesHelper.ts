import aesjs from 'aes-js';

//no types
const getRandomValues = require("get-random-values");

export const TEACRYPT_PREFIX = "teacrypt::";
export const TEACRYPT_USER_LENGTH = 19; //5 times 3 numbers + '-' minus last '-'
export const TEACRYPT_SUFFFIX = "::";

export const STATIC_DEV_KEY_IV = "a6cd62a0a46bed0df56368e4839b1c01_split_e8e40ab3d5baa806034cae343520ced8";

export const generateKeyAndIV = () => {
  const key = getRandomValues(new Uint8Array(16)) as Uint8Array;
  const iv = getRandomValues(new Uint8Array(16)) as Uint8Array;
  return aesjs.utils.hex.fromBytes(key) + "_split_" + aesjs.utils.hex.fromBytes(iv);
};

export function splitKeyAndIV(str: string) {
  if (!str) {
    throw new Error("Empty KeyIV String");
  }
  const entities = str.split("_split_");
  return {
    key: aesjs.utils.hex.toBytes(entities[0]),
    iv: aesjs.utils.hex.toBytes(entities[1]),
  };
}

export function encrypt(textUnpadded: string, key: Uint8Array, iv: Uint8Array) {
  if (!textUnpadded) {
    throw new Error("Empty textUnpadded");
  }
  if (!key) {
    throw new Error("Undefined key");
  }
  if (!iv) {
    throw new Error("Undefined iv");
  }
  const text = applyPadding(textUnpadded, 16);
  const textBytesPadded = aesjs.utils.utf8.toBytes(text);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const encryptedBytes = aesCbc.encrypt(textBytesPadded);
  const encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedText;
}

export function decrypt(encryptedTextHex: string, key: Uint8Array, iv: Uint8Array) {
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedTextHex);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const decryptedBytes = aesCbc.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

export function applyPadding(text: string, base: number) {
  const paddingAddLength = base - (aesjs.utils.utf8.toBytes(text).length % base) - 1;
  let paddedText = text + "".padEnd(paddingAddLength, "0");
  paddedText += paddingAddLength.toString(16);
  return paddedText;
}

export const unpaddText = (str: string, base = 16) => {
  const lastChar = str[str.length - 1];
  const paddingLength = parseInt(lastChar, base);
  if (Number.isNaN(paddingLength)) {
    throw new Error("Cannot unpadd number");
  }
  return str.substring(0, str.length - 1 - paddingLength);
};

export const encryptSimple = (keyIv: string, message: string, userId: string) => {
  const keyIVObj = splitKeyAndIV(keyIv);
  return TEACRYPT_PREFIX + userId + TEACRYPT_SUFFFIX + encrypt(message, keyIVObj.key, keyIVObj.iv);
};

export const decryptSimple = (keyIv: string, encryptedText: string) => {
  if (!encryptedText.includes(TEACRYPT_PREFIX)) {
    //No teacrypt encryption;
    return encryptedText;
  }
  if (!encryptedText.startsWith(TEACRYPT_PREFIX)) {
    encryptedText = encryptedText.substring(encryptedText.indexOf(TEACRYPT_PREFIX));
  }
  try {
    const encryptedTextSubstr = encryptedText.substring(
      TEACRYPT_PREFIX.length + TEACRYPT_USER_LENGTH + TEACRYPT_SUFFFIX.length
    );
    const keyIVObj = splitKeyAndIV(keyIv);
    const decryptedPaddedText = decrypt(encryptedTextSubstr, keyIVObj.key, keyIVObj.iv);
    return unpaddText(decryptedPaddedText);
  } catch (ex) {
    console.warn("Key not valid");
  }
  return encryptedText;
};

export const extractUserId = (encryptedText: string) => {
  const userID = encryptedText.substring(TEACRYPT_PREFIX.length, TEACRYPT_PREFIX.length + TEACRYPT_USER_LENGTH);
  return userID;
};
