interface IChatKey {
  key: string;
  chatIdentifier: string;
}

class Store {
  store: Array<IChatKey> = [];

  addKey = (key: string, chatIdentifier: string) => {
    const storeItemsFiltered = this.store.filter((item) => item.chatIdentifier !== chatIdentifier);
    if (storeItemsFiltered.length !== this.store.length) {
      console.warn("Overriding exisiting key");
    }
    storeItemsFiltered.push({ key, chatIdentifier });
    this.store = storeItemsFiltered;
  };

  removeKey = (chatIdentifier: string) => {
    this.store = this.store.filter((item) => item.chatIdentifier !== chatIdentifier);
  };

  getKey = (chatIdentifier: string) => {
    return this.store.find((item) => item.chatIdentifier === chatIdentifier)?.key;
  };
}

export default new Store();
