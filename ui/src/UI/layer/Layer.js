import util from '../../common/util'
import Displayable from '../displayable/Displayable'
import register from '../registe/registe'
/**
 * 图层对象
 */
class Layer extends Displayable {
  /**
   * @desc 构造函数
   * @param {Layout} parent 父级元素对象实例
   * @param {Object} opts 传入的图层配置参数
   */
  constructor(parent, opts) {
    super(parent, opts)

    this.pos = {
      x: opts.x || 0,
      y: opts.y || 0
    }

    this.layout = this.parent

    this.sceneId = null

    this.isShow = true
    this._initId('layer')

    this._onEvent()
  }

  /**
   * @desc 初始化事件
   */
  _onEvent() {
    this.on('windowResize', this._doLayout, this)
  }

  /**
   * @desc 销毁事件
   */
  _offEvent() {
    this.off('windowResize', this._doLayout)
  }

  /**
   * @desc 计算容器布局
   */
  _doLayout() {
    this.getContainers().forEach(ct => {
      this._setLayout(ct)
    })
  }

  /**
   * @desc 布局操作
   * @param {Container} ct 容器对象
   */
  _setLayout(ct) {
    this.parent.setLayout(ct, {
      top: this.pos.y + ct.opts.top, //相对于root的top
      left: this.pos.x + ct.opts.left //相对于root的left
    })

    ct.update()
  }

  /**
   * @desc 控制容器的显示
   */
  show() {
    this.isShow = true
    this.getContainers().forEach(ct => ct.show())
  }

  /**
   * @desc 控制容器的隐藏
   */
  hide() {
    this.isShow = false
    this.getContainers().forEach(ct => ct.hide())
  }

  /**
   * @desc 通过工厂方法制造Layer实例
   * @param {Layout} parent layout对象
   * @param {Object} opts 传入的容器可配置参数
   * @returns {Layer} 返回图层实例
   */
  static factory(parent, opts = {}) {
    return new Layer(parent, opts)
  }

  /**
   * @desc 创建容器
   * @param {Object} opts 创建容器所需的opts
   */
  createContainer(opts = {}) {
    opts = { ...this.pos, ...opts }
    const ct = register.newFromRegistedClazz('Container', this, opts)
    // 将容器实例添加到map集
    this._setMap(ct.id, ct)

    this._setLayout(ct)

    return ct
  }

  /**
   * @desc 销毁容器
   * @param {Array|Object|String} option 需要销毁的容器，支持容器对象、容器对象数组、容器id、容器id数组
   */
  removeContainer(option) {
    if (util.isType(option, 'Array')) {
      return option.every(opt => {
        return this._removeContainer(opt)
      })
    } else {
      return this._removeContainer(option)
    }
  }

  /**
   * @desc 销毁单个容器
   * @param {Object|String} opt 容器对象或容器id
   */
  _removeContainer(opt) {
    const _ct = util.isType(opt, 'Object') ? opt : this.getContainer(opt)
    let _r = false

    if (_ct) {
      // 将容器从map集中删除
      _r = this._deleteMap(_ct.id)
      // 销毁容器
      _ct.destroy()
    }

    return _r
  }

  /**
   * @desc 判断是否存在容器
   * @param {string} id 需要判断是否存在的容器的id
   */
  hasContainer(id) {
    return this._hasMap(id)
  }

  /**
   * @desc 通过id获取对应的容器
   * @param {string} id 容器id
   */
  getContainer(id) {
    return this._getMapById(id)
  }

  /**
   * @desc 查找所有容器
   */
  getContainers() {
    return this._getMapValues()
  }

  /**
   * @desc 获取当前所有容器对象的id
   */
  getContainerIds() {
    return this._getMapKeys()
  }

  /**
   * @param {Object} opts 图层配置参数
   */
  setOption(opts = {}) {
    if (Reflect.has(opts, 'id')) {
      throw new Error('图层id不能改变')
    }

    if (Reflect.has(opts, 'x')) {
      this.pos.x = opts.x
    }
    if (Reflect.has(opts, 'y')) {
      this.pos.y = opts.y
    }

    this._doLayout()

    return this
  }

  /**
   * @override
   * @desc 重写父类，释放图层及其子对象的所有资源
   */
  destroy() {
    this.removeContainer(this.getContainers())
    this._offEvent()
    super.destroy()
  }

  set x(value) {
    this.pos.x = value
    this.getContainers().forEach(ct => {
      ct.setOption({
        x: value
      })
    })
  }

  get x() {
    return this.pos.x
  }

  set y(value) {
    this.pos.y = value
    this.getContainers().forEach(ct => {
      ct.setOption({
        y: value
      })
    })
  }

  get y() {
    return this.pos.y
  }
}

export default Layer
