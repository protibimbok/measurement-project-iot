const EVENT_LISTENERS: Map<string, Array<(data: any) => void>> = new Map();

export const addListener = <T>(name: string, callback: (data: T) => void) => {
  const callbacks = EVENT_LISTENERS.get(name) || [];
  callbacks.push(callback);
  EVENT_LISTENERS.set(name, callbacks);
};

export const removeListener = (name: string, callback: (data: any) => void) => {
  const callbacks = EVENT_LISTENERS.get(name) || [];
  callbacks.splice(callbacks.indexOf(callback), 1);
  EVENT_LISTENERS.set(name, callbacks);
};

export const emitEvent = <T>(name: string, data: T) => {
  const callbacks = EVENT_LISTENERS.get(name) || [];
  callbacks.forEach((callback) => callback(data));
};
