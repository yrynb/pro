import util from '../../common/util'
import Displayable from '../displayable/Displayable'
import adapterMixin from '../mixin/adapterMixin'
import Drag from '../modules/Drag'
import Style from '../style/Style'
import store from '../../common/store'
/**
 * Container容器
 */
class Container extends Displayable {
  /**
   * @desc 构造函数
   * @param {Layer} parent 父级元素
   * @param {Object} opts 传入容器的配置对象
   */
  constructor(parent, opts) {
    super(parent, opts)

    // 容器默认参数
    const defaultOpts = {
      id: null,
      style: {
        width: 500,
        height: 500,
        position: 'absolute'
      }
    }

    this.layout = this.parent.layout

    this.dom = null
    // 合并options，深拷贝
    this.opts = util.deepMixinOpts(defaultOpts, opts)
    // this.width = this.opts.width
    // this.height = this.opts.height
    this.dealOpts()

    this.isShow = true

    // style实例
    this.style = Style.factory(this)

    // 名称
    this._initId('container')

    this.drag = null

    this.initDom()

    if (store.UI.getDrag()) {
      this.drag = new Drag(this)
    }

    // 根据opts初始化样式
    this.style.setOption(this.opts.style)

    // 适配器实例
    this.adapter = null

    this.dirty = false

    // this.update()
    this.loadAdapter()
  }

  /**
   * @desc 通过工厂创建Container实例
   * @param {Container} parent Container对象
   * @param {object} opts 配置参数
   */
  static factory(parent, opts) {
    return new Container(parent, opts)
  }

  /**
   * @desc 转换创建容器时传入的top和left
   */
  dealOpts() {
    this.opts.top = this.opts.top || this.opts.style.top || 0
    this.opts.left = this.opts.left || this.opts.style.left || 0
    this.opts.style.top = 0
    this.opts.style.left = 0
  }

  /**
   * @desc 初始化Dom节点,挂载到页面
   */
  initDom() {
    this.dom = this._createDom()
    this.dom.style.pointerEvents = 'auto'
    this.mount()
  }

  /**
   * @desc 创建dom
   * @param {string} type 元素类型
   */
  _createDom() {
    const dom = document.createElement('div')
    dom.dataset.id = this.id
    return dom
  }
  /**
   * 获取容器的 dom 节点
   * @returns {HTMLDivElement} 容器 dom 节点
   */
  getDom() {
    return this.dom
  }

  /**
   * @desc 挂载
   */
  mount() {
    this.root.appendChild(this.dom)
  }

  /**
   * @desc 卸载
   */
  unmount() {
    this.dom && this.root.removeChild(this.dom)
  }

  /**
   * @desc 调用适配器渲染组件,注册、初始化
   */
  loadAdapter() {
    if (this.opts.adapter) {
      const adapterOpts = this.opts.adapter
      this.createAdapter(adapterOpts.type, adapterOpts.name)
      this.initAdapter(adapterOpts.option)
    }
  }

  /**
   * @desc 提供width、height给conch组件
   */
  getSize() {
    return {
      width: this.width,
      height: this.height
    }
  }

  /**
   * @desc 显示
   */
  show() {
    if (this.isShow) {
      return
    }
    this.isShow = true

    this.style.display = ''
    // this.update()
  }

  /**
   * @desc 隐藏
   */
  hide() {
    if (!this.isShow) {
      return
    }
    this.isShow = false

    this.style.display = 'none'
    // this.update()
  }

  /**
   * @desc 更新可显示元素样式
   */
  update() {
    return () => {
      const dirtyStyleList = this.style.getDirtyStyleList()
      dirtyStyleList.forEach(item => {
        this.dom.style[item.name] = item.value
      })
    }
  }

  /**
   * @desc 更新样式
   * @param {string} opts 传入的配置参数对象
   */
  setOption(opts) {
    if (Reflect.has(opts, 'id')) {
      throw new Error('配置更新失败, 容器id无法更新, 请输入正确的配置')
    }
    this.opts = util.deepMixinOpts(this.opts, opts)
    this.style.setOption(opts)
    // this.update()
    this.adapter && this.adapter.resize && this.adapter.resize()
  }

  /**
   * @desc 销毁容器
   */
  destroy() {
    // 销毁组件（适配器）、销毁节点、销毁对象（ID，parent等）
    this.destroyAdapter()
    this.unmount()
    this.drag && this.drag.removeDown()
    this.id = null
    this.dom = null
  }

  get width() {
    return this.style.width
  }

  get height() {
    return this.style.height
  }
}

util.applyMixins(Container, [adapterMixin])

export default Container
