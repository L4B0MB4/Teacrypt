const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export class SessionStoreC {
  sessions: Record<string, string> = {};

  getSession = (key: string) => {
    return this.sessions[key];
  };
  setSession = (key: string, id: string) => {
    this.sessions[key] = id;
    return this.sessions[key];
  };

  getOrGenerateSession = (key: string) => {
    const sess = this.getSession(key);
    if (sess) {
      return sess;
    } else {
      const id = generateId();
      return this.setSession(key, id);
    }
  };
}

export const SessionStore = new SessionStoreC();
