import BaseAdapter from './BaseAdapter'

let conch

/**
 * Conch组件适配器
 */
class ConchAdapter extends BaseAdapter {
  constructor(parent, name) {
    super(parent, name)
  }
  /**
   * 装在 conch
   * @returns conch
   */
  static _loadConch() {
    if (!window.conch) {
      console.warn('请先加载spray-conch，否则组件将无法使用')
      return false
    }
    conch = window.conch
    return conch
  }
  /**
   * 通过工厂生产 conchAdapter
   * @param {*} parent container
   * @param {*} name conch 名称
   * @returns conchAdapter
   */
  static factory(parent, name) {
    let instance = null

    if (!conch) {
      ConchAdapter._loadConch()
    }
    if (!conch || !conch[name]) {
      throw new Error(`Conch没有加载或Conch中没有ID为${name}的组件`)
    }

    instance = new ConchAdapter(parent, name)

    return instance
  }
  /**
   * 初始化 conchAdapter
   * @param {*} opts 参数
   */
  init(opts) {
    const layout = this.parent.layout
    if (!layout) {
      return
    }
    this.opts = opts

    // this.parent && (conch = window.conch)

    if (!conch[this.name]) {
      throw new Error(
        `组件${this.name}未检测到，请先到spray-conch中下载对应的组件包`
      )
    }
    this.parent.getDom() && this.parent.getDom().appendChild(this.dom)
    this.parent &&
      !this.componentInstance &&
      this.dom &&
      (this.componentInstance = new conch[this.name](this.dom, this.opts))

    if (this.parent.staticData) {
      this.setData(this.parent.staticData)
    } else {
      // 首次，获取Conch数据并保存
      this.sourceData = this.componentInstance.data
    }

    this.componentInstance.render()
  }

  /**
   * @desc 重置组件参数
   * @param {object} opts 组件属性参数
   */
  setOption(opts) {
    super.setOption(opts)
    this.instance && this.instance.setOption(this.opts)
  }

  /**
   * @desc 重置组件数据
   * @param {object | Array} data 组件数据
   */
  setData(data) {
    super.setData(data)
    this.instance && this.instance.setData(data)
  }

  /**
   * @desc 重置组件大小
   */
  resize() {
    const size = this.parent.getSize()
    const width = size.width
    const height = size.height
    this.dom.style.width = `${width}px`
    this.dom.style.height = `${height}px`
    this.instance && this.instance.resize && this.instance.resize()
  }

  /**
   * @desc 注销组件并释放资源
   */
  destroy() {
    this.instance && this.instance.destroy()
    super.destroy()
    this.parent = null
  }
}

export default ConchAdapter
