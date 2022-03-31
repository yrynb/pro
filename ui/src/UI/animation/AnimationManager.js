import taskQueue from '../../common/queue'
import util from '../../common/util'
import AnimationSequence from '../animation/Sequence'
import AnimateList from './AnimateList'
import Animator from './Animator'

/**
 * AnimationManager类
 */
class AnimationManager {
  constructor(parent) {
    this.parent = parent
    this._isRunning = false
    this.animationSequence = AnimationSequence.factory(this.parent)

    // 自定义动画
    this.customAnimations = new Map()
    this.init()

    this.scenes = this.parent.scenes
  }

  /**
   * @desc 动画名称挂载
   */
  init() {
    AnimateList.forEach(v => {
      this[v] = v
    })
  }
  // static factory(parent) {
  //   return new AnimationManager(parent)
  // }

  /**
   * @desc 场景切换
   * @param {String} sceneId 需要显示的场景id
   */
  toggle(sceneId) {
    const curScene = this.scenes.getVisibleScene()
    // 单个场景移入
    util.isType(sceneId, 'String') && this._singleIn(curScene, sceneId)
  }

  /**
   * @desc 将当前页面的场景全部移除，并移入指定场景
   * @desc {object} curScene 当前场景
   * @desc {string} sceneId 需要移入的场景的id
   */
  _singleIn(curScene, sceneId) {
    const curSceneIds = Object.keys(curScene)
    // 将当前场景移出
    if (curSceneIds.includes(sceneId)) {
      return
    }
    curSceneIds.forEach(id => this._sceneAnimator(curScene[id]))

    // 将需要显示的场景移入
    const subScene = this.scenes.getSceneById(sceneId)
    this._sceneAnimator(subScene)
  }

  /**
   * @desc 场景动画
   * @param {Object} scene 场景
   */
  _sceneAnimator(scene) {
    // 获取场景内所有容器
    const containers = this._getSceneContainers(scene)
    // 划分容器到可视窗口的对应区域
    const area = this._setArea(containers)
    // 判断场景动画方向
    const action = scene.status === 'show' ? 'out' : 'in'
    if (action === 'out') {
      // 为不同区域设置不同动画，并执行移出动画
      const areaAnimator = this._getAnimationOpts(area, action)
      this.parent.sceneTransition.createAnimation(areaAnimator, () => {
        // 将移出场景状态置为隐藏
        this.scenes.setSceneStatus(scene, 'hide')
      })
    } else {
      // 如果场景做进入动画，现将场景内容器移至可视窗口两侧
      this._isInWindow(containers) && this._moveOutSubArea(area)
      // 将需要移入场景状态置为显示
      this.scenes.setSceneStatus(scene, 'show')

      // 为不同区域设置不同动画，并执行移入动画
      const areaAnimator = this._getAnimationOpts(area, action)
      this.parent.sceneTransition.createAnimation(areaAnimator)
    }
  }

  /**
   * @desc 判断场景是否在窗口内
   */
  _isInWindow(containers) {
    let res = false
    let len = containers.length
    const { canvasWidth } = this.parent.opts
    const saveDistance = 10
    while (len > 0) {
      const style = containers[len - 1].style
      const { width, translate, left, scale } = style
      if (
        width * scale[0] + translate[0] + left > saveDistance &&
        translate[0] + left < canvasWidth * scale[0] - saveDistance
      ) {
        res = true
        break
      }
      len--
    }
    return res
  }

  /**
   * @desc 把次场景不需要展示的containers移到窗口可视区域两侧
   * @param {object} area 不需要展示的场景分区内容
   */
  _moveOutSubArea(area) {
    if (!area) {
      return
    }
    const moveOutTypeMap = {
      left: 'toLeft',
      right: 'toRight'
    }
    Object.keys(area).forEach(key => {
      const containers = area[key]
      containers.forEach(container => {
        if (key === 'mid') {
          container.style.opacity = 0
        } else {
          const style = this.parent.sceneTransition._getTranslate(
            container,
            moveOutTypeMap[key]
          )
          const translate = container.style.translate
          container.style.translate = [
            translate && translate[0] + style[0],
            translate && translate[1] + style[1]
          ]
        }
        container.update()
      })
    })
  }

  /**
   * @desc 为不同区域容器设置不同动画
   * @param {object} area 区域对象
   * @param {string} type 场景切换动画的类型，in/out，进/出
   */
  _getAnimationOpts(area, type) {
    let res = []
    if (!area) {
      return res
    }
    const defaultAnimationMap = {
      left: {
        out: ['toLeft', 'fadeOut'],
        in: ['fromLeft', 'fadeIn']
      },
      mid: {
        out: 'fadeOut',
        in: 'fadeIn'
      },
      right: {
        out: ['toRight', 'fadeOut'],
        in: ['fromRight', 'fadeIn']
      }
    }
    // console.log('area', area)
    Object.keys(area).forEach(key => {
      const opts = this._getAnimationGroups(
        area[key],
        defaultAnimationMap[key][type],
        type === 'out' ? 'linear' : 'easeOut'
      )
      // console.log('groups', groups)
      // res.push({
      //   target: groups,
      //   animation: defaultAnimationMap[key][type],
      //   duration: 500,
      //   delay: 100
      // })
      res = [...res, ...opts]
    })
    return res
  }

  /**
   * @desc 获取动画的配置参数
   * @param {object} containers 容器
   * @param {Array} animation 动画类型
   */
  _getAnimationGroups(containers, animation, easing) {
    const groups = this._getGroupsByPos(containers)
    const res = []
    groups.forEach((group, index) => {
      res.push({
        target: group,
        animation: animation,
        easing,
        duration: easing === 'linear' ? 600 : 900,
        delay: 100 * index
      })
    })
    return res
  }

  /**
   * @desc 通过容器的位置对容器进行分组，自上而下，重叠的容器同时进行动画
   * @param {Array} containers 容器
   */
  _getGroupsByPos(containers) {
    if (!util.confirmArr(containers)) {
      return []
    }
    containers.sort((containerA, containerB) => {
      const topA = this._getTop(containerA)
      const topB = this._getTop(containerB)
      return topA - topB
    })
    let currentPos = null
    const res = []
    let group = []
    containers.forEach((container, index) => {
      const start = this._getTop(container)
      const ratio = container.style.scale[0]
      const height = container.style.height * ratio
      if (!currentPos) {
        currentPos = {
          start,
          height
        }
      }
      if (
        start >= currentPos.start &&
        start <= currentPos.start + currentPos.height
      ) {
        group.push(container)
      } else {
        res.push(group)
        group = [container]
        currentPos = {
          start,
          height
        }
      }
      if (index === containers.length - 1) {
        res.push(group)
      }
    })
    return res
  }

  /**
   * @desc 获取容器top
   * @param {object} container 容器
   */
  _getTop(container) {
    return (
      container.parent.pos.y +
      container.style.top +
      container.style.translate[1]
    )
  }

  /**
   * @desc 获取当前场景下所有container
   * @param {Arrany} scene 场景
   */
  _getSceneContainers(scene) {
    const layers = scene.layers
    if (!util.confirmArr(layers)) {
      return []
    }
    let containers = []
    layers.forEach(layer => {
      containers = [...containers, ...layer.getContainers()]
    })
    return containers
  }

  /**
   * @desc 划分containers到对应的区域
   * @param {Array} containers 容器数组
   */
  _setArea(containers) {
    const area = {}
    if (!util.confirmArr(containers)) {
      return area
    }
    containers.forEach(container => {
      const position = this._getArea(container, this.parent.root)
      if (!util.isType(area[position], 'Array')) {
        area[position] = [container]
      } else {
        area[position].push(container)
      }
    })
    return area
  }

  /**
   * @desc 判断当前container所处区域
   */
  _getArea(container, root) {
    const width = root.clientWidth
    const layer = container.parent
    const positionLeft =
      layer.pos.x + container.style.translate[0] + container.style.left
    const positionRight =
      layer.pos.x +
      container.style.translate[0] +
      container.style.left +
      container.style.width
    let res = ''
    if (positionLeft <= width / 3) {
      res = 'left'
    } else if (positionRight >= width * (2 / 3)) {
      res = 'right'
    } else {
      res = 'mid'
    }
    return res
  }

  /**
   * @param {Object} param0 需要执行动画的元素
   *  - {Layer|Container} target 需要执行动画的实例
   *  - {Object} animation 动画样式集合
   *  - {String} type 元素的隐藏或展示: show|hidden
   *  - {Number} duration 动画执行时间
   *  - {Number} delay 动画延迟时间
   *  - {function} callback 动画执行完的回调
   * @param {function} callback 每组animate队列执行完毕的回调列表
   */
  run(opts, callback) {
    let ticks = []
    ticks = util.isType(opts.animation, 'String')
      ? this._dealCustomAnimation(opts)
      : this._dealDefaultAnimation(opts)
    this.animationSequence.addTicks(ticks, callback)
    this._startLoop()
    return this
  }

  /**
   * @desc 注册自定义动画
   * @param {object} opts 注册动画需要的参数
   */
  registAnimation(opts) {
    this.customAnimations.set(opts.name, opts)
  }
  /**
   * 移除自定义动画
   * @param {string} name 动画名称
   */
  removeAnimation(name) {
    this.customAnimations.has(name) && this.customAnimations.delete(name)
  }

  /**
   * @desc 处理自定义动画ticks
   * @param {object} opts 自定义动画的参数
   */
  _dealCustomAnimation(opts) {
    const customAnimation = this.customAnimations.get(opts.animation)
    const { before, tick, after } = customAnimation
    return this._getTicks({ ...opts, animation: tick, before, callback: after })
  }

  /**
   * @desc 处理默认动画ticks
   * @param {*} opts 默认动画参数
   */
  _dealDefaultAnimation(opts) {
    let ticks = []
    if (util.isType(opts, 'Array')) {
      opts.forEach(opt => {
        ticks = [...ticks, ...this._getTicks(opt)]
      })
    } else {
      ticks = this._getTicks(opts)
    }
    return ticks
  }

  /**
   * @desc 处理动画的options
   * @param {Array|object} opts 动画的配置参数
   */
  _getTicks(opts) {
    if (!opts) {
      return []
    }
    const { target } = opts
    let ticks = []
    if (util.confirmArr(target)) {
      target.forEach(ct => {
        if (ct.constructor.name !== 'Container') {
          return
        }
        ticks = [...ticks, ...Animator.factory({ ...opts, target: ct }).start()]
      })
    } else {
      if (target.constructor.name !== 'Container') {
        return ticks
      }
      ticks = Animator.factory({ ...opts }).start()
    }
    return ticks
  }

  /**
   * @desc 每一帧执行的内容
   */
  _flush() {
    return () => {
      const ticks = this.animationSequence.getCurrentTicks()
      ticks.forEach((tick, i) => {
        !tick() && ticks.splice(i, 1)
      })

      // 每组动画执行完毕的动画列表
      const cbs = this.animationSequence.callbacks
      if (ticks.length < 1 && cbs.length) {
        typeof cbs[0] === 'function' && cbs[0]()
        cbs.shift()
      }

      if (this.animationSequence.isFinish()) {
        this.pause()
        return false
      }
      return true
    }
  }

  /**
   * @desc 开始动画循环渲染
   */
  _startLoop() {
    taskQueue.addTask(this._flush(), 'flush')
  }

  /**
   * @desc 停止渲染
   */
  pause() {
    this._isRunning = false
  }

  /**
   * @desc 销毁
   */
  destroy() {
    this.parent = null
    this._isRunning = null
    this.animationSequence = null
  }
}
export default AnimationManager
