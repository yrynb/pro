import util from '../../common/util'

/**
 * Tick类
 */
class Tick {
  constructor(parent, opts) {
    // 动画类
    this.parent = parent
    // 动画执行的目标元素
    this.target = this.parent.target
    this.layout = this.target.parent.parent
    this.opts = opts
    // 动画的类型，translate|scale 等
    this.type = this.opts.type
    this.duration = this.parent.duration
    this.delay = this.parent.delay || 0
    this.callback = this.parent.callback

    this.startValue = null
    this.currentValue = null
    this.endValue = null

    this.startTime = 0
    this.endTime = 0
    this.pauseTime = 0

    this.stopped = false
    this.ended = false

    this.easingType = this.parent.easing || 'linear'

    this.easing = {
      linear: (t, b, c, d) => {
        return c * (t / d) + b
      },
      easeOut: (t, b, c, d) => {
        const s = t / d - 1
        return -c * (Math.pow(s, 4) - 1) + b
      }
    }
  }

  static factory(parent, opts) {
    return new Tick(parent, opts)
  }

  /**
   * @desc 开始动画
   */
  init() {
    return () => {
      this.startTime = this.startTime || this.getNow()
      if (this.getNow() - this.startTime < this.delay) {
        return true
      }
      const currentTime = this.getNow()
      if (currentTime > this.startTime + this.duration + this.delay) {
        this.ended = true
        this.callback &&
          typeof this.callback === 'function' &&
          this.callback(this.target)
      } else {
        this.run()
        return true
      }
      return false
    }
  }

  /**
   * @desc 结束动画
   */
  stop() {
    this.stopped = true
  }

  /**
   * @desc 暂停动画
   */
  pause() {
    this.stopped = true
    this.pauseTime = this.getNow()
  }

  /**
   * @desc 运行动画
   * @param {number} progress 动画的进度
   */
  run() {
    if (!this.target) {
      return false
    }
    this.type === 'custom' ? this._runCustom() : this._runDefault()
    return true
  }

  /**
   * @desc 执行自定义动画
   */
  _runCustom() {
    const { animation } = this.parent
    util.isType(animation, 'Function') && animation(this.target)
  }

  /**
   * @desc 执行默认动画
   */
  _runDefault() {
    this.startValue = this.startValue || this.getValue(this.type)
    this.endValue = this.endValue || this.getEndValue(this.opts.endValue)
    const currentTime = this.getNow()

    if (['translate', 'scale', 'skew'].includes(this.type)) {
      this.currentValue = []
      this.currentValue[0] = this.easing[this.easingType](
        currentTime - this.startTime - this.delay,
        this.startValue[0],
        this.endValue[0] - this.startValue[0],
        this.duration
      )
      this.currentValue[1] = this.easing[this.easingType](
        currentTime - this.startTime,
        this.startValue[1],
        this.endValue[1] - this.startValue[1],
        this.duration
      )
    } else {
      this.currentValue = this.easing[this.easingType](
        currentTime - this.startTime,
        this.startValue,
        this.endValue - this.startValue,
        this.duration
      )
    }

    this.target.setOption({ [this.type]: this.currentValue })
  }

  /**
   * @desc 获取元素动画相关的当前值
   * @param {string} type 动画类型
   */
  getValue(type) {
    if (type === 'translate') {
      if (
        !this.target.style._style.translate ||
        !this.target.style._style.translate.length
      ) {
        return [0, 0]
      }

      return this.target.style._style.translate
    }

    if (type === 'scale') {
      if (
        !this.target.style._style.scale ||
        !this.target.style._style.scale.length
      ) {
        return [1, 1]
      }

      return this.target.style._style.scale
    }

    if (type === 'skew') {
      if (
        !this.target.style._style.skew ||
        !this.target.style._style.skew.length
      ) {
        return [0, 0]
      }

      return this.target.style._style.skew
    }

    if (type === 'opacity') {
      const opacity = this.target.style[this.type]
      return util.isType(opacity, 'Number') ? opacity : 1
    }

    return this.target.style._style[this.type]
  }

  /**
   * @desc 获取css结束样式
   * @param {string|number|Array} value 样式值
   * @returns {number|Array} 返回值
   */
  getEndValue(value) {
    if (['translate', 'scale', 'skew'].includes(this.type)) {
      if (util.isType(value, 'String')) {
        const val1 = this.target.style._style[this.type][0] + Number(value)
        const val2 = this.target.style._style[this.type][1] + Number(value)
        return [val1, val2]
      }

      if (util.isType(value, 'Number')) {
        const val1 = this.target.style._style[this.type][0] + value
        const val2 = this.target.style._style[this.type][1] + value
        return [val1, val2]
      }

      if (util.isType(value, 'Array')) {
        const val1 = this.target.style._style[this.type][0] + value[0]
        const val2 = this.target.style._style[this.type][1] + value[1]
        return [val1, val2]
      }
    }

    if ('opacity'.includes(this.type)) {
      return Number(value)
    }

    if (util.isType(value, 'String')) {
      const val = this.target.style[this.type] + Number(value)
      return val
    }

    return this.target.style[this.type] + Number(value)
  }

  /**
   * @desc 获取当前时间
   */
  getNow() {
    return Date.now()
  }
}

export default Tick
