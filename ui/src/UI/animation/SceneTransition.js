import util from '../../common/util'
/**
 * @desc 封装移入移出动画
 */
class SceneTransition {
  constructor() {
    this.layout = null
  }

  static factory() {
    return new SceneTransition()
  }

  /**
   * @desc 获取移动的距离
   * @param {object} container 容器
   * @param {string}} type 移动动画类型
   */
  _getTranslate(container, type) {
    const { x, y, left, top } = container.opts

    const width = container.style.width
    const height = container.style.height

    const canvasWidth = container.root.offsetWidth
    const canvasHeight = container.root.offsetHeight

    const scale = container.style.scale[0]

    const animateList = {
      fromTop: [0, (height + top + y) * scale],
      fromLeft: [(width + left + x) * scale, 0],
      fromRight: [-canvasWidth + (left + x) * scale, 0],
      fromBottom: [0, -(canvasHeight - top - y) * scale],

      toTop: [0, -(height + top + y) * scale],
      toLeft: [-(width + left + x) * scale, 0],
      toRight: [canvasWidth - (left + x) * scale, 0],
      toBottom: [0, (canvasHeight - top - y) * scale]
    }

    return animateList[type]
  }

  /**
   * @desc 解析opts的animation，实现动画效果自由组合
   * @param {object} opts 参数
   * @param {number} index 同一target里container的延迟倍数
   */
  _animator(opts, index) {
    const { target, animation, duration, delay, easing } = opts
    const container = target
    let animations = []
    const map = {
      toRight: { translate: this._getTranslate(container, 'toRight') },
      toLeft: { translate: this._getTranslate(container, 'toLeft') },
      toBottom: { translate: this._getTranslate(container, 'toBottom') },
      toTop: { translate: this._getTranslate(container, 'toTop') },
      fromBottom: { translate: this._getTranslate(container, 'fromBottom') },
      fromLeft: { translate: this._getTranslate(container, 'fromLeft') },
      fromRight: { translate: this._getTranslate(container, 'fromRight') },
      fromTop: { translate: this._getTranslate(container, 'fromTop') },
      fadeOut: { opacity: 0 },
      fadeIn: { opacity: 1 }
    }

    this.layout = container.parent.parent

    if (util.isType(animation, 'Array')) {
      animations = animation.map((type, n) => {
        return {
          target: container,
          animation: map[type],
          duration: util.isType(duration, 'Array') ? duration[n] : duration,
          delay: delay,
          easing
        }
      })
    } else {
      animations = [
        {
          target: container,
          animation: map[animation],
          duration: duration,
          delay: delay,
          easing
        }
      ]
    }

    return animations
  }

  /**
   * @desc 创建切换动画
   * @param {object} opts 创建参数
   * @param {function} callback 回调函数
   * @example frame.UI.sceneTransition.createAnimation(
        [{
        target: [container1,container2],
        animation: ['toLeft','fadeOut'],
        duration: [3000, 1000],
        delay:1000
      },{
        target: container3,
        duration: 3000,
        animation: 'toLeft',
        delay:1000
      }]
      )
   */
  createAnimation(opts, callback) {
    const containerList = this._loop(opts, this._getTarget.bind(this))
    this.layout.animation.run(containerList, callback)
  }

  /**
   * @desc 获取目标容器
   * @param {object} opts
   */
  _getTarget(opts) {
    const { target, animation, duration, delay, easing } = opts
    let optsArray = []
    if (util.isType(target, 'Array')) {
      optsArray = target
        .map((container, index) => {
          return this._animator(
            { target: container, animation, duration, delay, easing },
            index + 1
          )
        })
        .flat()
    } else {
      optsArray = [...this._animator(opts)]
    }
    return optsArray
  }

  /**
   * @desc opts是数组循环执行
   * @param {array|object} opts
   * @param {function} fn
   */
  _loop(opts, fn) {
    let containerList = []
    if (util.isType(opts, 'Array')) {
      containerList = opts
        .map(opt => {
          return fn(opt)
        })
        .flat()
    } else {
      containerList = fn(opts)
    }
    return containerList
  }
}

export default SceneTransition
