export function setStorage({key, value}) {
  return window.localStorage.setItem(key, value);
}

export function getStorage(key) {
  return window.localStorage.getItem(key);
}

export function isStorage(key) {
  return window.localStorage.getItem(key) ? true : false;
}

export function removeStorage(key) {
  return window.localStorage.removeItem(key);
}

export function clearStorage() {
  const storages = window.localStorage;
  Object.keys(storages).forEach(key => {
    if (key != 'promoteList') {
      window.localStorage.removeItem(key)
    }
  })
}
