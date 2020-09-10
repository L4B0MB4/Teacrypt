import NodeRSA from "node-rsa";

const ownKeys = new NodeRSA({ b: 2064 });

export const getPublicKey = () => {
  return ownKeys.exportKey("public");
};

export const encrypt = (toEncrypt: string, publicKey: NodeRSA.Key) => {
  const foreignKey = new NodeRSA(publicKey, "public");
  return foreignKey.encrypt(toEncrypt, "base64");
};

export const decrypt = (toDecrypt: string) => {
  return ownKeys.decrypt(toDecrypt, "utf8");
};
