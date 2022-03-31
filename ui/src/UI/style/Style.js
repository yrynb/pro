import taskQueue from '../../common/queue'
import util from '../../common/util'

const STYLELIST = [
  'position',
  'top',
  'left',
  'width',
  'height',
  'transform',
  'transformOrigin',
  'filter',
  'right',
  'bottom',
  'outline',
  'backgroundImage',
  'backgroundColor',
  'background',
  'backgroundPosition',
  'flex',
  'padding',
  'margin',
  'display',
  'border',
  'opacity',
  'zIndex',
  'pointerEvents',
  'cursor',
  'flexDirection',
  'justifyContent',
  'alignItems',
  'backgroundRepeat',
  'backgroundSize',
  'backdropFilter',
  'visibility'
]

function setTransform(k) {
  return function (v) {
    this._setTransform(k, v)
  }
}
function setDistance(k, i) {
  return function (v) {
    this._setDistance(k, i, v)
  }
}
// 记录赋值时需要特殊处理的style及其处理方法
const styleFnMap = {
  translate: setTransform('translate'),
  scale: setTransform('scale'),
  skew: setTransform('skew'),
  rotate: setTransform('rotate'),
  matrix: setTransform('matrix')
}
;['padding', 'margin'].forEach(t => {
  ;['Top', 'Right', 'Bottom', 'Left'].forEach(
    (k, i) => (styleFnMap[t + k] = setDistance(t, i))
  )
})

/**
 * 布局容器的样式类，控制样式的设置，输出等，使样式可控，不可以随意设置
 * - 对于padding和margin采用长度为4的数组保存，index的顺序0-3依次为：上右下左
 */
class Style {
  /**
   * @desc 构造函数
   * @param {Container} parent 从属的父级元素,一般是图层或者布局等元素
   */
  constructor(parent) {
    /**
     * @desc 父级元素,一般是容器等元素
     */
    this.parent = parent

    this.layout = this.parent.layout

    /**
     * @desc 所有样式存储
     */
    this._style = {}

    this.dirtyMap = {}

    return new Proxy(this, {
      get(target, key, proxy) {
        if (STYLELIST.indexOf(key) !== -1 || Reflect.has(styleFnMap, key)) {
          return target._style[key]
        }
        const value = Reflect.get(target, key, proxy)
        return value
      },
      set(target, key, value, proxy) {
        if (STYLELIST.indexOf(key) !== -1) {
          target._setStyle(key, value)
          return true
        } else if (styleFnMap[key]) {
          styleFnMap[key].call(target, value)
          return true
        } else {
          return Reflect.set(target, key, value, proxy)
        }
      }
    })
  }

  /**
   * @desc 创建Style对象实例的工厂方法
   * @param {Container} parent 从属的父级元素,一般是图层或者布局等元素
   */
  static factory(parent) {
    return new Style(parent)
  }

  /**
   * @desc 根据传入的option修改Style对象实例的成员变量值，一般在el初始化获取opts的style值后使用
   * @param {Object} options 样式的配置参数
   * @return {boolean}
   */
  setOption(options) {
    if (!util.isType(options, 'Object')) {
      return false
    }

    Object.keys(options).forEach(item => {
      this[item] = options[item]
    })

    return true
  }

  /**
   * @desc 获取样式值
   * @return {string|null}
   */
  getValue(name) {
    if (name === 'backgroundImage' && this._style[name]) {
      return `url(${this._style[name]})`
    }

    if (name === 'transform') {
      return this._getTransformStyleValue()
    }

    if (
      (name === 'width' || name === 'height') &&
      !Number.isNaN(Number(this._style[name]))
    ) {
      return this._style[name] + 'px'
    }

    if (
      (name === 'margin' || name === 'padding') &&
      util.isType(this._style[name], 'Array')
    ) {
      return this._style[name].join('px ') + 'px'
    }

    if (util.isType(this._style[name], 'Array')) {
      return this._style[name].join(' ')
    }

    if (
      (name === 'top' ||
        name === 'left' ||
        name === 'right' ||
        name === 'bottom') &&
      util.isType(this._style[name], 'Number')
    ) {
      return this._style[name] + 'px'
    }

    return this._style[name]
  }

  /**
   * @desc 获取transform样式值
   * @return {string}
   * @private
   */
  _getTransformStyleValue() {
    let style = ''

    if (this._style.translate && this._style.translate.length === 2) {
      style += `translate(${this._style.translate[0]}px, ${this._style.translate[1]}px)`
    }

    if (this._style.scale && this._style.scale.length === 2) {
      style.length && (style += ' ')
      style += `scale(${this._style.scale[0]}, ${this._style.scale[1]})`
    }

    if (this._style.rotate) {
      style.length && (style += ' ')
      style += `rotate(${this._style.rotate}deg)`
    }

    if (this._style.skew && this._style.skew.length === 2) {
      style.length && (style += ' ')
      style += `skew(${this._style.skew[0]}deg, ${this._style.skew[1]}deg)`
    }

    if (this._style.matrix && this._style.matrix.length === 6) {
      style.length && (style += ' ')
      style += `matrix(${this._style.matrix.join(',')})`
    }

    return style
  }

  /**
   * @desc 获取脏数据样式列表
   * @return {Array<Object>}
   */
  getDirtyStyleList() {
    const result = []

    for (const key in this.dirtyMap) {
      const value = this.getValue(key)
      this.dirtyMap[key] = false
      if (value === null || value === undefined) {
        continue
      }
      result.push({ name: key, value: value })
    }

    return result
  }

  _setStyle(key, value) {
    if (util.isType(value, 'Object')) {
      this._style[value.name] = value.value
    } else {
      this._style[key] = value
    }
    this.dirtyMap[key] = true
    this.parent.dirty = true
    taskQueue.addTask(this.parent.update())
  }

  /**
   * @desc 设置内外边距，按照上下左右[0,1,2,3]的顺序
   * @param {string} type 边距类型，padding或margin
   * @param {number} index 边距位置
   * @param {number} value 距离
   */
  _setDistance(type, index, value) {
    if (type !== 'margin' && type !== 'padding') {
      return
    }
    let distance = this[type]

    if (!util.isType(distance, 'Array')) {
      distance = [0, 0, 0, 0]
    }
    distance[index] = value

    this._setStyle(type, distance)
  }

  _setTransform(type, value) {
    const needTransformArr = ['translate', 'scale', 'skew']
    const content = needTransformArr.includes(type)
      ? this.formatValue(value)
      : value
    this._setStyle('transform', { name: type, value: content })
  }

  formatValue(value) {
    let res = ''
    if (util.isType(value, 'Number')) {
      res = [value, value]
    }

    // 2.如果是一个数组，则要判断两个值都是数值型，然后赋值给,x,y
    if (
      util.isType(value, 'Array') &&
      util.isType(value[0], 'Number') &&
      util.isType(value[1], 'Number')
    ) {
      res = [value[0], value[1]]
    }
    return res
  }

  /**
   * @desc 接收单样式更新数据，提示Displayable有样式需要更新
   * @param {boolean} value
   */
  set dirty(value) {
    this.parent.dirty = value
  }

  /**
   * @desc 获取单样式更新数据
   */
  get dirty() {
    return this.parent.dirty
  }
}
export default Style
