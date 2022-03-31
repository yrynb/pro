import store from '../../common/store'
import util from '../../common/util'
import EventBus from '../../common/EventBus'

/**
 * UI 基类
 * 提供基础配置参数
 * 提供map存储功能
 * 提供基础属性获取功能
 */
class Displayable extends EventBus {
  constructor(parent, opts, root) {
    super()
    this.parent = parent
    this.opts = opts || {}
    this.root = root || store.UI.getRoot()
    this.id = null
    // console.log(this)
    this.clazzMap = new Map()
    // console.log(this)
    this._initRootStyle(this.root)
  }

  /**
   * @desc 将clazz实例添加到map集
   * @param {String|Number} id
   * @param {object} clazz
   * @returns {object} clazz
   */
  _setMap(id, clazz) {
    if (this.clazzMap.has(id)) {
      throw new Error('id不能重复')
    }

    this.clazzMap.set(id, clazz)
    return this.clazzMap
  }
  /**
   * 是否含有 map
   * @param {*} id
   * @returns 是否含有id的对象
   */
  _hasMap(id) {
    return this.clazzMap.has(id)
  }
  /**
   * 根据id删除对象
   * @param {*} id
   * @returns 是否删除
   */
  _deleteMap(id) {
    if (!id) {
      throw new Error('id不能为空')
    }
    return this.clazzMap.delete(id)
  }

  _getMapById(id) {
    return id ? this.clazzMap.get(id) : null
  }

  _getMapKeys() {
    return Array.from(this.clazzMap.keys())
  }

  _getMapValues() {
    return Array.from(this.clazzMap.values())
  }

  _clearMap() {
    this.clazzMap.clear()
  }

  /**
   * @desc 初始化id
   * @param {string} type 类型
   */
  _initId(type) {
    if (this.opts.id) {
      this.id = this.opts.id
    } else {
      this.id = util.createElementName(type || this.name)
    }
    return this.id
  }

  /**
   * @desc 初始化根节点的样式
   */
  _initRootStyle(root) {
    if (!root || !root.style) {
      return
    }
    root.style.position = 'relative'
    root.style.overflow = 'hidden'
  }

  destroy() {
    this._clearMap()
  }

  /**
   * @desc 获取挂载根节点
   */
  getAppRoot() {
    return this.root
  }

  get type() {
    return this.constructor.name.toLowerCase()
  }
}
export default Displayable
