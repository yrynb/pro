/**
 * UI 工具类
 */
class Util {
  constructor() {
    this.seed = new Date().getTime()
  }
  rnd(seed) {
    this.seed = (seed * 9301 + 49297) % 233280
    return this.seed / 233280.0
  }
  randomNum(number) {
    return Math.ceil(this.rnd(this.seed) * number)
  }

  /**
   * @desc 根据列表的key排序
   * @param {array} list
   * @param {string} key
   * @param {number} def
   */
  sortByKey(list, key, def = 0) {
    return [...list].sort((a, b) => {
      return (b[key] || def) - (a[key] || def)
    })
  }

  /**
   * @desc 判断数据类型是否已知的数据类型，String,Array,Number,Boolean,Null,Undefined,Symbol首字母大写，HTMLDivElement等
   * @param {object} obj 被判断的数据类型
   * @param {string} type 数据类型值
   */
  isType(obj, type) {
    return Object.prototype.toString.call(obj).includes(type)
  }

  /**
   * @desc 深合并
   * @param {Object} target 目标对象
   * @param {Object|Array<Object>} source 源对象
   * @return {Object}
   */
  deepMixinOpts(target, ...source) {
    if (!this.isType(target, 'Object')) {
      return console.error('参数错误: ' + target)
    }

    if (!source.length) {
      return target
    }

    const sourceIsObject = source.every(item => {
      return this.isType(item, 'Object')
    })

    if (!sourceIsObject) {
      return console.error('source参数错误: ' + source)
    }

    source.forEach(item => {
      this._deepMixinOpts(target, item)
    })

    return target
  }

  /**
   * @desc 深合并
   * @param {Object} target 目标对象
   * @param {Object} source 源对象
   * @private
   */
  _deepMixinOpts(target, source) {
    Object.keys(source).forEach(key => {
      if (this.isType(source[key], 'Object')) {
        if (!target[key]) {
          target[key] = {}
        }

        this._deepMixinOpts(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    })
  }
  /**
   * @example
   * let name = createElementName() // output:framwork-xyz098xx
   * let name = createElementName('layer') // output:layer-def018bb
   * @desc 生成：元素名称+8位随机字符串（0-9，a-z）
   * @param {string} name 名称前缀
   * @returns {string}
   */
  createElementName(name = 'framwork') {
    return `${name.toLowerCase()}-${(this.randomNum(10000) / 100000)
      .toString(36)
      .slice(-8)}`
  }

  /**
   * @desc 混入对象的方法
   * @param {object} target 目标类，需要从基类并入prototype属性
   * @param {Class} source 基类，将prototype中的属性并入目标类
   * @private
   */
  _applyMixin(target, source) {
    const proto = source.prototype ? source.prototype : source
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (name !== 'constructor') {
        target.prototype[name] = proto[name]
      }
    })
  }

  /**
   * @desc 对象混入,用于将一个Class的成员方法混入到另一个类中，实现Class从多个类继承的效果，主要用于团队并行开发，提高开发效率
   * @param {object} target 目标类，需要从基类并入prototype属性
   * @param {Array|Object} sources 基类，将prototype中的属性并入目标类
   */
  applyMixins(target, sources) {
    if (Array.isArray(sources)) {
      sources.forEach(item => {
        this._applyMixin(target, item)
      })
    } else {
      this._applyMixin(target, sources)
    }
  }

  /**
   * @desc 校验目标是数组且有值
   * @param {*} target 校验的值
   */
  confirmArr(target) {
    return Array.isArray(target) && target.length > 0
  }

  /**
   * @desc 复制对象
   * @param {*} o
   */
  inheritObject(o) {
    class F {}
    Object.setPrototypeOf(F.prototype, o)
    return new F()
  }
  /**
   * @desc 寄生组合式继承
   * @param {*} SubClass 子类
   * @param {*} SuperClass 父类
   */
  inheritPrototype(SubClass, SuperClass) {
    if (SubClass.prototype && SubClass.prototype instanceof SuperClass) {
      return false
    }
    const p = this.inheritObject(SuperClass.prototype)
    p.constructor = SubClass
    Object.setPrototypeOf(SubClass.prototype, p)
    return true
  }
}

export default new Util()
