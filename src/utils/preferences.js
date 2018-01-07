// @flow

import mitt from 'mitt';

const emitter = mitt();

export const setItem = (key, value) => {
  if (getItem(key) !== value) {
    localStorage.setItem(key, value);
    emitter.emit(key, value);
  }
};

export const getItem = key => {
  return localStorage.getItem(key);
};

export const onChange = (initial, key, callback) => {
  emitter.on(key, callback);
  if (initial) {
    emitter.emit(key, getItem(key));
  }
  return () => emitter.off(key, callback);
};
