// @flow

function get(obj, path) {
  const keys = Array.isArray(path) ? path : path.split('/');
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!obj || !Object.prototype.hasOwnProperty.call(obj, key)) {
      obj = undefined;
      break;
    }
    obj = obj[key];
  }
  return obj;
}

function set(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split('/');
  let itObj = obj;
  for (var i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!Object.prototype.hasOwnProperty.call(itObj, key)) itObj[key] = {};
    itObj = itObj[key];
  }
  itObj[keys[i]] = value;
  return obj;
}

export default function deep(obj, path, value) {
  if (arguments.length === 3) return set(...arguments);
  return get(...arguments);
}
