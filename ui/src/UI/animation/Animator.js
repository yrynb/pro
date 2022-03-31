import util from '../../common/util'
import Tick from './Tick'
/**
 * @desc 动画主体
 * @example 例子：
 * toggle([{
    target: layer, // 图层
    animation: UI.animation.RIGHT, // 动画效果
    type: 'hide', // 隐藏|展示
    duration: 1000, // 动画持续时长
    delay: 300, //  动画延迟执行时间
  },{
    target: layer,
    animation: UI.animation.LEFT,
    type: 'hide',
    duration: 1000
  }]).toggle([])
 */
class Animator {
  /**
   * @desc 构造函数
   * @param {Layer|Container} target 需要执行动画的实例
   * @param {Object} animation 动画样式集合
   * @param {Number} duration 动画执行时间
   * @param {Number} delay 动画延迟时间
   * @param {function} callback 动画执行完的回调
   */
  constructor(opts) {
    this.id = util.createElementName()
    this.opts = opts
    /**
     * @desc 需要执行动画的实例
     */
    this.target = opts.target
    /**
     * @desc 动画样式集合
     */
    this.animation = opts.animation || {}
    /**
     * @desc 元素的隐藏或展示
     */
    // this.type = type || 'show'
    /**
     * @desc 动画执行时间
     */
    this.duration = opts.duration || 0
    /**
     * @desc 动画延迟时间
     */
    this.delay = opts.delay || 0

    this.easing = opts.easing

    this.callback = opts.callback

    this.tweens = []

    this.init()
  }

  /**
   * @desc 初始化
   */
  init() {
    util.isType(this.animation, 'Function')
      ? this._initCustomTweens()
      : this._initDefaultTweens()
  }

  /**
   * @desc 初始化自定义动画
   */
  _initCustomTweens() {
    const tween = new Tick(this, { type: 'custom' })
    this.tweens.push(tween)
  }

  /**
   * @desc 初始化默认动画
   */
  _initDefaultTweens() {
    Object.keys(this.animation).forEach(css => {
      const options = {
        type: css,
        endValue: this.animation[css]
      }
      const tween = new Tick(this, options)
      this.tweens.push(tween)
    })
  }

  /**
   * @desc 开始动画
   * @return {Animator} Animator实例
   */
  start() {
    const ticks = []
    this._runBefore()
    this.tweens.forEach(tween => ticks.push(tween.init()))
    this.tweens.length && (this.paused = false)
    return ticks
  }

  /**
   * @desc 在动画开始前执行的回调
   */
  _runBefore() {
    const { before } = this.opts
    util.isType(before, 'Function') && before(this.target)
  }

  /**
   * @desc 暂停动画
   */
  pause() {
    this.tweens.forEach(tween => tween.pause())
    this.tweens.length && (this.paused = true)
    return this
  }

  /**
   * @desc 关闭动画
   */
  stop() {
    this.tweens.forEach(tween => tween.stop())
    this.destroy()
  }

  /**
   * @desc 最终
   */
  destroy() {
    this.tweens = []
    this.target = {}
  }
  static factory(target, animation, duration, delay, callback) {
    return new Animator(target, animation, duration, delay, callback)
  }
}

export default Animator
