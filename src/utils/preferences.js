// @flow

import mitt from 'mitt';

const emitter = mitt();

export const setItem = (key: string, value: string) => {
  if (getItem(key) !== value) {
    localStorage.setItem(key, value);
    emitter.emit(key, value);
  }
};

export const getItem = (key: string): string => {
  return localStorage.getItem(key);
};

export const onChange = (
  initial: boolean,
  key: string,
  callback: string => void
) => {
  emitter.on(key, callback);
  if (initial) {
    emitter.emit(key, getItem(key));
  }
  return () => emitter.off(key, callback);
};
