import aesjs from 'aes-js';

export const TEACRYPT_PREFIX = "teacrypt--";

export const STATIC_DEV_KEY_IV = "a6cd62a0a46bed0df56368e4839b1c01_split_e8e40ab3d5baa806034cae343520ced8";

export function generateKeyAndIV() {
  var key = crypto.getRandomValues(new Uint8Array(16));
  var iv = crypto.getRandomValues(new Uint8Array(16));
  return aesjs.utils.hex.fromBytes(key) + "_split_" + aesjs.utils.hex.fromBytes(iv);
}

export function splitKeyAndIV(str: string) {
  if (!str) {
    throw new Error("Empty KeyIV String");
  }
  var entities = str.split("_split_");
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
  var text = applyPadding(textUnpadded, 16);
  var textBytesPadded = aesjs.utils.utf8.toBytes(text);
  var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  var encryptedBytes = aesCbc.encrypt(textBytesPadded);
  var encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedText;
}

export function decrypt(encryptedTextHex: string, key: Uint8Array, iv: Uint8Array) {
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedTextHex);
  var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  var decryptedBytes = aesCbc.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

export function applyPadding(text: string, base: number) {
  var paddingAddLength = base - (aesjs.utils.utf8.toBytes(text).length % base) - 1;
  var paddedText = text + "".padEnd(paddingAddLength, "0");
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

export const encryptSimple = (keyIv: string, message: string) => {
  var keyIVObj = splitKeyAndIV(keyIv);
  return TEACRYPT_PREFIX + encrypt(message, keyIVObj.key, keyIVObj.iv);
};

export const decryptSimple = (keyIv: string, encryptedText: string) => {
  if (!encryptedText.startsWith(TEACRYPT_PREFIX)) {
    //No teacrypt encryption;
    return encryptedText;
  }
  try {
    var encryptedTextSubstr = encryptedText.substring(TEACRYPT_PREFIX.length);
    var keyIVObj = splitKeyAndIV(keyIv);
    const decryptedPaddedText = decrypt(encryptedTextSubstr, keyIVObj.key, keyIVObj.iv);
    return unpaddText(decryptedPaddedText);
  } catch (ex) {
    console.warn("Key not valid");
  }
  return encryptedText;
};
