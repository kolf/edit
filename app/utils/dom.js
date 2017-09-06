export default {
  get(className){
    return document.querySelectorAll(className)
  },
  offset(className){
    const node = this.get(className)[0];
    if (!node) return {}
    return {
      left: node.offsetLeft,
      top: node.offsetTop,
      width: node.offsetWidth,
      height: node.offsetHeight,
    }
  }
}
