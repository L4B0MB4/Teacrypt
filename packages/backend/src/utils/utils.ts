export const createId = () => {
  function S4() {
    return (((1 + Math.random()) * 0x01000) | 0).toString(10).substring(1);
  }
  return (S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()).toLowerCase();
};
