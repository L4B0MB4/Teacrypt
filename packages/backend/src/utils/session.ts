export const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
type localSession = { publicKey: string; authenticator: string; isValid: boolean };
export class SessionStoreC {
  sessions: Record<string, localSession> = {};

  getSession = (sessionID: string): localSession | undefined => {
    return this.sessions[sessionID];
  };
  setSession = (sessionID: string, publicKey: string) => {
    this.sessions[sessionID] = {
      publicKey,
      authenticator: generateId(),
      isValid: false,
    };
    return this.sessions[sessionID];
  };
  validateSession = (sessionID: string) => {
    this.sessions[sessionID].isValid = true;
  };

  getOrGenerateSession = (sessionID: string, publicKey: string) => {
    const sess = this.getSession(sessionID);
    if (sess) {
      return sess;
    } else {
      return this.setSession(sessionID, publicKey);
    }
  };
}

export const SessionStore = new SessionStoreC();
