// import queue from './queue'
import util from './util'
const _events = new Map()

/**
 * @desc 根据事件名称获取eventbus数组
 * @param {String} event 事件名称
 */
const _get = event => {
  return _events.get(event)
}

/**
 * @desc 循环触发emit事件
 * @param {Array} handler 根据事件名称获取的事件列对象
 * @param {...any} args 参数
 */
const _doEmitMap = (handler, args) => {
  handler.forEach(v => {
    // queue.addTask(() => {
    v.ctx ? v.fn.apply(v.ctx, args) : v.fn(...args)
    // })
  })
}

/**
 * @desc off方法条件
 * - 存在ctx
 * @param {Array} handler 根据事件名称获取的事件列对象
 * @param {Function} fn  off方法的参数fn
 * @param {Function} ctx off方法的参数ctx
 */
function _offCtx(handler, fn, ctx) {
  return handler.filter(v => {
    if (v.fn === fn && v.ctx === ctx && v.name === ctx._name) {
      return false
    }
    return true
  })
}
/**
 * @desc off方法条件
 * - 不存在ctx
 * @param {Array} handler 根据事件名称获取的事件列对象
 * @param {Function} fn  off方法的参数fn
 * @param {Function} ctx off方法的this
 */
function _offNoCtx(handler, fn, ctx) {
  return handler.filter(v => {
    if (ctx._name) {
      return !(v.fn === fn && v.name === ctx._name)
    } else {
      return v.fn !== fn
    }
  })
}

// function eventBus() {
//   throw new Error('eventBusMixin cannot be created')
// }
/**
 * EventBus 实现类
 */
class EventBus {
  /**
   * @desc 监听注册事件
   * @param {String} event 监听事件名称
   * @param {Function} fn 监听事件
   * @param {*} ctx 执行上下文
   */
  on(event, fn, ctx) {
    if (!(typeof fn === 'function' || Array.isArray(fn))) {
      throw new Error('The event object is not properly formatted')
    }
    const handler = _get(event)
    const _object = { fn, name: ctx ? ctx._name : this._name, ctx }
    if (!handler) {
      _events.set(event, Array.isArray(fn) ? [] : [_object])
    } else {
      handler.push(_object)
    }
  }

  /**
   * @desc 对事件进行一次性监听
   * @param {String} event 监听事件名称
   * @param {Function} fn 监听事件
   */
  once(event, fn) {
    const _this = this
    const _handler = function (...args) {
      fn(...args)
      _this.off(event, _handler)
    }
    this.on(event, _handler)
  }
  /**
   * @desc  触发监听事件并给监听事件传递参数
   * @param {String} event 监听事件名称
   * @param {...Any} args 事件执行参数
   */
  emit(event, ...args) {
    let _name = ''
    let handler = null
    if (event.split(':').length > 1) {
      ;[_name, event] = event.split(':')
      handler = _get(event) && _get(event).filter(v => v.name === _name)
    } else {
      handler = _get(event)
    }
    if (!util.confirmArr(handler)) {
      return false
    }
    _doEmitMap(handler, args)
    return true
  }

  /**
   * @desc 单个事件销毁
   * @param {String} event 事件名称
   * @param {Function|Array} event 销毁条件
   */
  off(event, fn, ctx) {
    if (!fn || typeof fn !== 'function') {
      throw new Error('fn is not a function')
    }
    let handler = _get(event)
    if (!util.confirmArr(handler)) {
      return false
    }
    if (ctx) {
      handler = _offCtx(handler, fn, ctx)
    } else {
      handler = _offNoCtx(handler, fn, this)
    }
    _events.set(event, handler)
    return true
  }
  /**
   *@desc 删除当前组件的所有名称为`event`的事件
   * @param {String} event 事件名称
   */
  clear(event, ctx) {
    const _this = this
    const handler = _get(event)
    if (!util.confirmArr(handler)) {
      return false
    }
    const _getCondition = function (v) {
      return ctx
        ? !(v.ctx === ctx && v.name === ctx._name)
        : v.name !== _this._name
    }
    _events.set(
      event,
      handler.filter(v => _getCondition(v))
    )
    return true
  }
  /**
   *@desc 删除所有名称为`event`的事件
   * @param {String} event 事件名称
   */
  clearAll(event) {
    if (!util.confirmArr(_get(event))) {
      return false
    }
    _events.delete(event)
    return true
  }
}
export default EventBus
