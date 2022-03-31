import Store from './Store'
/**
 * store管理类
 */
class StoreManager {
  constructor(modules) {
    // 存储分区
    if (!modules) {
      return
    }
    for (const key in modules) {
      const store = new Store(modules[key], key)
      store.registerToManager(this)
    }
  }
}

export default StoreManager
