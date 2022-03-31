import store from '../../common/store'
// import eventBusMixin from '../../core/mixin/eventBusMixin'
import util from '../../common/util'
import AnimationManager from '../animation/AnimationManager'
import SceneTransition from '../animation/SceneTransition'
import Displayable from '../displayable/Displayable'
import layoutMixin from '../mixin/layoutMixin'
import register from '../registe/registe'
import ExportJson from '../scene/ExportJson'
import SceneManager from '../scene/SceneManager'

/**
 * UI 主类
 * @class Layout
 */
class Layout extends Displayable {
  constructor(root, opts) {
    store.UI.setRoot(root)
    opts && opts.isDrag && store.UI.setDrag(opts.isDrag)
    super({}, opts)
    if (!opts.pointerEvents) {
      root.style.pointerEvents = 'none'
    }
    // 默认渲染区域宽高
    this.canvasWidth = root.clientWidth
    this.canvasHeight = root.clientHeight
    this.defaultOpts = {
      threeFirst: true,
      layerOpts: null
    }
    this.opts = util.deepMixinOpts(
      {},
      {
        ...this.defaultOpts,
        canvasWidth: this.canvasWidth,
        canvasHeight: this.canvasHeight,
        ...opts
      }
    )

    // rFA是否开始
    this._isRunning = false

    this.handleResize = this._handleResize.bind(this)

    this.sceneTransition = SceneTransition.factory()

    this.scenes = SceneManager.factory(this)

    this.animation = new AnimationManager(this)

    this._onEvent('resize', this.handleResize)
  }

  static factory(root, opts) {
    return new Layout(root, opts)
  }

  apply(frame) {
    if (!frame) {
      return
    }
    this.opts.threeFirst
      ? frame.afterLoad.inject(() => this.init(this.opts))
      : this.init(this.opts)
    frame.beforeDestroy.inject(this.destroy.bind(this))
  }

  /**
   * @desc 初始化布局
   * @param {object} opts 布局所需配置项
   */
  init(opts) {
    return util.confirmArr(opts.layerOpts)
      ? opts.layerOpts.map(opt => this.createLayer(opt))
      : []
  }

  /**
   * @desc 新增图层
   * @param {object}opts 新增图层所需的配置
   */
  createLayer(opts = { x: 0, y: 0 }) {
    const layer = register.newFromRegistedClazz('Layer', this, opts)
    this.scenes.divideScene(layer, opts.sceneId || this.scenes.defaultSceneId)

    this._setMap(layer.id, layer)

    return layer
  }

  /**
   * @desc 销毁图层
   * @param {Array|Object|String} option 需要销毁的图层，支持图层对象、图层对象数组、图层id、图层id数组
   */
  removeLayer(option) {
    if (util.isType(option, 'Array')) {
      return option.every(opt => {
        return this._removeLayer(opt)
      })
    } else {
      return this._removeLayer(option)
    }
  }

  /**
   * @desc 销毁单个图层
   * @param {Object|String} opt 图层对象或图层id
   */
  _removeLayer(opt) {
    const _layer = util.isType(opt, 'Object') ? opt : this.getLayer(opt)
    let _r = false

    if (_layer) {
      // 将图层从map集中删除
      _r = this._deleteMap(_layer.id)
      // 销毁图层
      _layer.destroy()
    }

    return _r
  }

  /**
   * @desc 判断是否存在图层
   * @param {string} id 需要判断是否存在的图层的id
   */
  hasLayer(id) {
    return this._hasMap(id)
  }

  /**
   * @desc 通过id获取对应的图层
   * @param {string} id 图层id
   */
  getLayer(id) {
    return this._getMapById(id)
  }

  /**
   * @desc 获取当前所有图层对象
   */
  getLayers() {
    return this._getMapValues()
  }

  /**
   * @desc 获取当前所有图层对象的id
   */
  getLayerIds() {
    return this._getMapKeys()
  }

  /**
   * @desc 操作图层的配置
   * @param {object} layer 图层对象
   * @param {object} opts 图层配置
   */
  setLayer(layer, opts) {
    if (!layer) {
      return false
    }
    if (Array.isArray(layer)) {
      this.setLayers(layer, opts)
      return true
    }
    layer.setOption(opts)
    return true
  }

  /**
   * @desc 给多个图层进行配置
   * @param {Array} layers 图层数组
   * @param {object} opts 图层的配置项
   * @returns 返回修改后的图层对象
   */
  setLayers(layers, opts) {
    if (!util.confirmArr(layers)) {
      return false
    }
    layers.forEach(layer => {
      this.setLayer(layer, opts)
    })
    return layers
  }

  /**
   * @desc 配置布局
   * @param {object} opts 布局所需配置
   */
  setOption(opts) {
    this.opts = { ...opts }
    this.canvasWidth = this.opts.canvasWidth
    this.canvasHeight = this.opts.canvasHeight
    this.init(opts)
  }

  /**
   * @desc 缩放布局
   * @param {object} el 需要布局的对象
   */
  setLayout(el, pos) {
    return this.doLayout(el, {
      top: pos.top,
      left: pos.left,
      width: this.opts.canvasWidth,
      height: this.opts.canvasHeight
    })
  }

  setNewCoord(
    el,
    { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
  ) {
    return this.computeNewCoord(el, {
      top: oldTop,
      left: oldLeft,
      width: canvasSizeX,
      height: canvasSizeY
    })
  }

  /**
   * @desc 绑定事件
   * @param {string} eventName 事件名称
   * @param {function} callback 事件的回调函数
   */
  _onEvent(eventName, callback) {
    window.addEventListener(eventName, callback)
  }

  /**
   * @desc 解绑事件
   * @param {*} eventName 事件名称
   * @param {*} callback 回调函数
   */
  _offEvent(eventName, callback) {
    window.removeEventListener(eventName, callback)
  }

  /**
   * @desc 窗口缩放事件
   */
  _handleResize() {
    this.emit('windowResize')
  }

  /**
   * @desc 销毁布局实例
   */
  destroy() {
    this.removeLayer(this.getLayers())
    this._offEvent('resize', this.handleResize)
    this.canvasWidth = null
    this.canvasHeight = null
    this.defaultOpts = null
    this.opts = null
    this.handleResize = null
    this.animation.destroy()
    super.destroy()
  }
}

util.applyMixins(Layout, [layoutMixin, ExportJson])

export default Layout
