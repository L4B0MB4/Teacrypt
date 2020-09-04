interface IEventListener {
  type: string;
  fn: (data: any) => void;
}
export class EventListener {
  listeners: Array<IEventListener> = [];

  addListener = (type: string, fn: (data: any) => void) => {
    this.listeners.push({ type, fn });
  };
  removeListener = (fn: (data: any) => void) => {
    this.listeners = this.listeners.filter((item) => item.fn !== fn);
  };

  emit = (type: string, data: any) => {
    this.listeners.forEach((item) => item.type === type && item.fn(data));
  };
}
