function generateKeyAndIV() {
  //todo undefined etc check
  var key = window.crypto.getRandomValues(new Uint8Array(16));
  var iv = window.crypto.getRandomValues(new Uint8Array(16));
  return aesjs.utils.hex.fromBytes(key) + "_split_" + aesjs.utils.hex.fromBytes(iv);
}

function splitKeyAndIV(str) {
  //todo undefined etc check
  var entities = str.split("_split_");
  return {
    key: aesjs.utils.hex.toBytes(entities[0]),
    iv: aesjs.utils.hex.toBytes(entities[1]),
  };
}

function encrypt(textUnpadded, key, iv) {
  //todo undefined etc check
  var text = applyPadding(textUnpadded, 16);
  var textBytesPadded = aesjs.utils.utf8.toBytes(text);
  var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  var encryptedBytes = aesCbc.encrypt(textBytesPadded);
  var encryptedText = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedText;
}

function decrypt(encryptedTextHex, key, iv) {
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedTextHex);
  var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  var decryptedBytes = aesCbc.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

function applyPadding(text, multiplier) {
  var paddingAddLength = multiplier - (aesjs.utils.utf8.toBytes(text).length % multiplier) - 1;
  var paddedText = text + "".padEnd(paddingAddLength, "0");
  paddedText += paddingAddLength.toString(16);
  return paddedText; /* 

  var missing = multiplier - (u8intArr.length % multiplier);
  if (missing === multiplier) return u8intArr;
  else {
    const newArr = new Uint8Array(u8intArr.length + missing);
    for (let i = 0; i < u8intArr.length; i++) {
      newArr[i] = u8intArr;
    }
    for (let i = 0; i < missing; i++) {
      newArr[u8intArr.length - 1 + i] = 0;
    }
    return newArr;
  } */
}

window.aes_helper = {
  generateKeyAndIV: generateKeyAndIV,
  splitKeyAndIV: splitKeyAndIV,
  encrypt: encrypt,
  decrypt: decrypt,
};
