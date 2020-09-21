export const FROM = {
  BACKGROUND: "teacrypt_background",
  WEBPAGE: "teacrypt_webpage",
};

export const MSG = {
  ONOFF: "ONOFF",
  OWN_IDENTIFIER: "OWN_IDENTIFIER",
  GET_OWN_IDENTIFIER: "GET_OWN_IDENTIFIER",
};

export type StatusPayload = { status: boolean };

export type OwnIdentifierPayload = { id?: string };
