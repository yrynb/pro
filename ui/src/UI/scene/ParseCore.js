import util from '../../common/util'

/**
 * ParseCore 解析场景核心类
 */
class ParseCore {
  constructor() {
    this.baseFolderName = null
  }
  /**
   * @desc 渲染UI
   * @param {Object} data UI参数
   * @param {Element} parent layout实例
   * @param {Function} transform 场景json转换器
   */
  renderUI(data, parent, transform) {
    data.children &&
      data.children.forEach(item => {
        this.renderLayer(transform.layer(item), item, parent, transform)
      })
  }

  /**
   * 渲染layer
   * @param {Object} template layer参数
   * @param {Object} template layer参数
   * @param {Element} parent layout实例
   * @param {Function} transform 场景json转换器
   */
  renderLayer(opts, item, parent, transform) {
    const layer = parent.createLayer(opts)

    transform.hasChildren(item.children).forEach(child => {
      this.renderContainer(transform.container(child), layer)
    })

    return layer
  }

  /**
   * 渲染container
   * @param {Array} opts containers参数
   * @param {Element} parent layer实例
   */
  renderContainer(opts, parent) {
    parent.createContainer(opts)
  }

  /**
   * @desc 引入base包
   * @param {String} link 文件名称
   */
  importBase(link) {
    return new Promise((resolve, reject) => {
      if (util.isType(link, 'String') && link !== this.baseFolderName) {
        this.baseFolderName = link
        const script = this.pullIn('base', link)
        script.onload = () => {
          resolve(1)
        }
      } else {
        reject(0)
      }
    })
  }

  /**
   * @desc 按需循环引入Conch组件
   * @param {object} config 文件名称
   */
  importComponent(config) {
    const list = []
    config &&
      config.component &&
      config.component.map(component => {
        list.push(
          new Promise(resolve => {
            const script = this.pullIn('component', component)
            script.onload = () => {
              resolve(1)
            }
          })
        )
      })
    return Promise.all(list)
  }

  /**
   * @desc script引入
   * @param {string} folder 文件夹
   * @param {string} link 文件名
   */
  pullIn(folder, link) {
    const script = document.createElement('script')
    script.setAttribute('src', `${this.basePath}/web/${folder}/${link}.js`)
    document.head.appendChild(script)
    return script
  }
}
export default ParseCore
