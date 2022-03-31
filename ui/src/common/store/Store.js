/**
 * store的实现类
 */
class Store {
  constructor(modlue, name) {
    this.name = name
    const { state, get, set } = modlue
    this.state = state
    this.get = get
    this.set = set
  }

  /**
   * @desc 给StoreManager对象添加从modules中获取到的方法
   * @param {object} vm StoreManager对象
   */
  registerToManager(vm) {
    const store = (vm[this.name] = {})
    const funs = ['get', 'set']
    funs.forEach(k => {
      for (const key in this[k]) {
        store[key] = this[k][key].bind(null, this.state)
      }
    })
  }
}
export default Store
