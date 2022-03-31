/**
 * 组件适配器
 */
class BaseAdapter {
  constructor(parent, name) {
    /**
     * 组件所属父级元素
     * @type {*}
     */
    this.parent = parent

    /**
     * 组件名称
     * @type {string}
     */
    this.name = name

    /**
     * 组件实例
     * @type {object}
     */
    this.instance = null

    /**
     * 组件配置参数
     * @type {object}
     */
    this.opts = null

    /**
     * 组件所需数据
     * @type {object | array}
     */
    this.sourceData = null

    /**
     * 组件是否初始化完成
     * @type {boolean}
     */
    this.complete = false

    this.initDom()
  }

  /**
   * @desc 初始化 dom 节点
   */
  initDom() {
    const size = this.parent.getSize()
    const dom = document.createElement('div')
    dom.style.width = `${size.width}px`
    dom.style.height = `${size.height}px`

    this.dom = dom
  }

  /**
   * @desc 重置组件参数
   * @param {object} opts 组件属性参数
   */
  setOption(opts) {
    this.opts = opts
  }

  /**
   * @desc 重置组件数据
   * @param {object | Array} data 组件数据
   */
  setData(data) {
    this.sourceData = data
  }

  /**
   * @desc 获取组件参数
   */
  getOption() {
    return this.opts
  }

  /**
   * @desc 获取组件数据
   */
  getData() {
    return this.sourceData
  }

  /**
   * @desc 获取组件实例
   */
  getInstance() {
    return this.instance
  }

  /**
   * @desc 注销组件并释放资源
   */
  destroy() {
    this.dom && this.parent.getDom().removeChild(this.dom)
  }
}

export default BaseAdapter
