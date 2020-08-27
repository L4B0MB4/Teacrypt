export function generateKeyAndIV() {
  var key = window.crypto.getRandomValues(new Uint8Array(16));
  var iv = window.crypto.getRandomValues(new Uint8Array(16));
  return window.aesjs.utils.hex.fromBytes(key) + "_split_" + window.aesjs.utils.hex.fromBytes(iv);
}

export function splitKeyAndIV(str: string) {
  if (!str) {
    throw new Error("Empty KeyIV String");
  }
  var entities = str.split("_split_");
  return {
    key: window.aesjs.utils.hex.toBytes(entities[0]),
    iv: window.aesjs.utils.hex.toBytes(entities[1]),
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
  var textBytesPadded = window.aesjs.utils.utf8.toBytes(text);
  var aesCbc = new window.aesjs.ModeOfOperation.cbc(key, iv);
  var encryptedBytes = aesCbc.encrypt(textBytesPadded);
  var encryptedText = window.aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedText;
}

export function decrypt(encryptedTextHex: string, key: Uint8Array, iv: Uint8Array) {
  var encryptedBytes = window.aesjs.utils.hex.toBytes(encryptedTextHex);
  var aesCbc = new window.aesjs.ModeOfOperation.cbc(key, iv);
  var decryptedBytes = aesCbc.decrypt(encryptedBytes);
  var decryptedText = window.aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

export function applyPadding(text: string, multiplier: number) {
  var paddingAddLength = multiplier - (window.aesjs.utils.utf8.toBytes(text).length % multiplier) - 1;
  var paddedText = text + "".padEnd(paddingAddLength, "0");
  paddedText += paddingAddLength.toString(16);
  return paddedText;
}
