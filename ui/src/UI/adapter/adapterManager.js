import MapHandle from '../../common/MapHandle'
/**
 * Adapter 管理器
 */
class AdapterManager extends MapHandle {
  /**
   * @desc 注册组件适配器，注册后可在组件中进行实例化
   * @param {string} type 注册适配器名称
   * @param {object} adapterClass 注册的适配器
   */
  regist(type, adapterClass) {
    this._set(type, adapterClass)
  }

  /**
   * @desc 基于组件适配器创建一个组件
   * @param {string} type 组件适配器名称
   * @param {*} parent 组件适配器实例所属的可视化元素对象实例
   * @param {string} name 组件名称
   */
  creatComponent(type, parent, name) {
    return this._create(type, parent, name)
  }
}

export default new AdapterManager()
