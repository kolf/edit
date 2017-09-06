export default {
  get (key) {
    return window.localStorage.getItem(key) || ''
  },
  set (key, value) {
    window.localStorage.setItem(key, value)
  },
  has (key) {
    return this.get(key)
  },
  remove(key){
    window.localStorage.removeItem(key)
  }
}
