/**
 * Map Handle
 */
class MapHandle {
  constructor() {
    this._map = new Map()
  }
  /**
   * 添加类
   * @param {*} k 类的名称
   * @param {*} v 类并且必须有 factory 静态方法
   */
  _set(k, v) {
    if (this._map.has(k)) {
      console.warn('重复注册' + k)
      return
    }
    if (!v.factory) {
      throw new Error('注册的对象缺失factory静态方法')
    }
    this._map.set(k, v)
  }
  /**
   * 根据名称创建
   * @param {*} k 名称
   * @param  {...any} args 创建参数
   * @returns {*} 实例化对象
   */
  _create(k, ...args) {
    if (!this._map.has(k)) {
      console.warn(`${k}尚未注册，请检查参数`)
      return false
    }
    //创建对象
    try {
      return this._map.get(k).factory(...args)
    } catch (error) {
      throw new Error(`创建${k}出错` + error)
    }
  }
}

export default MapHandle
