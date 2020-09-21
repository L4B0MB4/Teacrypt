export const FROM = {
  BACKGROUND: "teacrypt_background",
  WEBPAGE: "teacrypt_webpage",
};

export const MSG = {
  ONOFF: "onoff",
  OWN_IDENTIFIER: "ownIdentifier",
};

export type StatusPayload = { status: boolean };

export type OwnIdentifierPayload = { id: string };
