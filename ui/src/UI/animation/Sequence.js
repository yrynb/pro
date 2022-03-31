import util from '../../common/util'

/**
 * Sequence类
 */
class Sequence {
  /**
   * @desc 动画切换的先后顺序
   * @param {parent} parent  实例
   */
  constructor(parent) {
    this.parent = parent
    /**
     * 动画执行总集合
     * @type {Array}
     */
    this.totalTicks = []
    /**
     * 当前执行动画
     * @type {Array}
     */
    this.ticks = []
    /**
     * 每组animate队列执行完毕的回调列表
     * @type {Array}
     */
    this.callbacks = []
  }

  static factory(parent) {
    return new Sequence(parent)
  }

  /**
   * @desc 添加动画,并创建化动画类
   */
  addTicks(ticks, callback) {
    if (util.confirmArr(ticks)) {
      this.totalTicks.push(ticks)
      this.callbacks.push(callback)
    }
  }
  /**
   * 判断动画队列是否已经清空
   * @return {Boolean}
   */
  isFinish() {
    return this.totalTicks.length < 1 && this.ticks.length < 1
  }

  /**
   * 把动画队列的下一个item放入执行队列
   * @return {Array}
   */
  getCurrentTicks() {
    if (this.ticks.length > 0) {
      return this.ticks
    }
    if (this.totalTicks.length) {
      this.ticks = this.totalTicks[0]
      this.totalTicks.shift()
    }
    return this.ticks
  }
}

export default Sequence
