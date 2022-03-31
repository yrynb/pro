import adapter from '../adapter/adapterManager'

function adapterMixin() {
  throw new Error('adapterMixin cannot be created')
}
/**
 * @lends Container.prototype
 */
adapterMixin.prototype = {
  /**
   * @desc 创建适配器实例
   * @param {string} type 适配器注册名，用该名称的class实例化
   * @param {string} name 适配器名称
   */
  createAdapter(type, name) {
    this.adapter = adapter.creatComponent(type, this, name)
    return this.adapter
  },

  /**
   * @desc 初始化组件适配器
   * @param {object} opts 初始化组件适配器所需要的参数
   */
  initAdapter(opts) {
    if (!this.adapter) {
      console.warn(
        `容器${this.name}中无组件适配器，请检查createAdapter阶段type和name参数是否正确`
      )
      return
    }
    this.adapter.init(opts)
  },

  /**
   * @desc 注销组件适配器并释放相关资源
   */
  destroyAdapter() {
    this.adapter && this.adapter.destroy()
    this.adapter = null
  }
}
export default adapterMixin
