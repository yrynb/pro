import util from '../util'
/**
 * 任务队列
 */
class Queue {
  constructor() {
    /**
     * @desc 任务列表
     * @type {Array<Function>}
     */
    this.queues = []

    /**
     * @desc 如果不在同一帧，则返回不执行，保证重新执行的唯一性
     * @type {Number}
     */
    this._reDrawId = null

    /**
     * @desc rAF是否执行
     * @type {Boolean}
     */
    this._isRunning = false
    this.taskMap = new Map()
  }

  /**
   * @desc 添加任务
   * @param {Function} task 任务
   */
  addTask(task, name) {
    if (!task || typeof task !== 'function') {
      console.warn('添加任务队列失败，请检查任务是否为Function')
      return false
    }
    name
      ? !this.taskMap.has(name) && this.taskMap.set(name, task)
      : this.queues.push(task)
    this.start()
    return true
  }

  /**
   * 判断任务队列是否已经清空
   * @return {Boolean}
   */
  isFinish() {
    return !this.queues.length
  }

  /**
   * @desc 执行任务
   */
  start() {
    if (this._isRunning) {
      return false
    }
    this._isRunning = true
    this._reDrawId = util.randomNum(1e5)
    this._exect(this.queues, this._reDrawId)
    return true
  }

  /**
   * @desc 执行任务列表
   * @param {Array<Function>} list 任务列表
   * @param {Number} redrawId 任务标识符
   */
  _exect(list, reDrawId) {
    if (this._reDrawId !== reDrawId) {
      return false
    }
    this._doExect(list)
    ;[...this.taskMap.values()].forEach(fn => fn())
    const self = this
    window.requestAnimationFrame(function () {
      self._exect(list, reDrawId)
    })
    return true
  }

  /**
   * @desc 将任务队列的所有任务按照顺序一一执行
   * @param {Array<Function>} list 任务列表
   * @returns {Boolean} 一帧是否执行完毕
   */
  _doExect(list) {
    let finished = true
    if (util.confirmArr(list)) {
      const startTime = this._getNow()
      for (let i = 0, len = list.length; i < len; i++) {
        list[0]()
        list.shift()
        if (this._getNow() - startTime > 15 && list.length > 0) {
          finished = false
          break
        }
      }
    }
    return finished
  }
  /**
   * 获取当前时间
   * @returns time
   */
  _getNow() {
    return Date.now()
  }
}
export default Queue
