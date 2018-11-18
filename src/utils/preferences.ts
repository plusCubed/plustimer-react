import mitt from 'mitt';

const emitter = new mitt();

export const Preferences = {
  getItem: (key: string): string => {
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Preferences.getItem(key) !== value) {
      localStorage.setItem(key, value);
      emitter.emit(key, value);
    }
  },
  onChange: (
    initial: boolean,
    key: string,
    callback: (value: string) => void
  ) => {
    emitter.on(key, callback);
    if (initial) {
      emitter.emit(key, Preferences.getItem(key));
    }
    return () => emitter.off(key, callback);
  }
};
