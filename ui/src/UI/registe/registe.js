import MapHandle from '../../common/MapHandle'
/**
 * class 注册管理模块
 */
class ClazzMap extends MapHandle {
  /**
   * 通过对象名称创建对象，对象必须是通过registClazz注册
   * @param {*} key 已注册的类名称
   * @param {*} parent 该对象所属的父级对象
   * @param {*} opts 创建对象实例所需的配置参数
   * @param  {...any} args 其余参数
   * @returns 实例化的对象
   */
  newFromRegistedClazz(key, parent, opts, ...args) {
    return this._create(key, parent, opts, ...args)
  }

  /**
   * @desc 将对象注册到注册表中，用于后续创建使用
   * @param {string} key 注册Class时使用的名称
   * @param {object} clazz 注册的Class
   */
  registClazz(key, clazz) {
    this._set(key, clazz)
  }
}

export default new ClazzMap()
