
(function (){
    if (document.getElementById('reload-script')) return;
    const script = document.createElement('script');
    script.id = 'reload-script';
    script.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':8001/livereload.js?snipver=1';
    document.head.appendChild(script);
}());
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UI = factory());
}(this, (function () { 'use strict';

  /**
   * Map Handle
   */
  class MapHandle {
    constructor() {
      this._map = new Map();
    }
    /**
     * 添加类
     * @param {*} k 类的名称
     * @param {*} v 类并且必须有 factory 静态方法
     */
    _set(k, v) {
      if (this._map.has(k)) {
        console.warn('重复注册' + k);
        return
      }
      if (!v.factory) {
        throw new Error('注册的对象缺失factory静态方法')
      }
      this._map.set(k, v);
    }
    /**
     * 根据名称创建
     * @param {*} k 名称
     * @param  {...any} args 创建参数
     * @returns {*} 实例化对象
     */
    _create(k, ...args) {
      if (!this._map.has(k)) {
        console.warn(`${k}尚未注册，请检查参数`);
        return false
      }
      //创建对象
      try {
        return this._map.get(k).factory(...args)
      } catch (error) {
        throw new Error(`创建${k}出错` + error)
      }
    }
  }

  /**
   * Adapter 管理器
   */
  class AdapterManager extends MapHandle {
    /**
     * @desc 注册组件适配器，注册后可在组件中进行实例化
     * @param {string} type 注册适配器名称
     * @param {object} adapterClass 注册的适配器
     */
    regist(type, adapterClass) {
      this._set(type, adapterClass);
    }

    /**
     * @desc 基于组件适配器创建一个组件
     * @param {string} type 组件适配器名称
     * @param {*} parent 组件适配器实例所属的可视化元素对象实例
     * @param {string} name 组件名称
     */
    creatComponent(type, parent, name) {
      return this._create(type, parent, name)
    }
  }

  var adapter = new AdapterManager();

  /**
   * 组件适配器
   */
  class BaseAdapter {
    constructor(parent, name) {
      /**
       * 组件所属父级元素
       * @type {*}
       */
      this.parent = parent;

      /**
       * 组件名称
       * @type {string}
       */
      this.name = name;

      /**
       * 组件实例
       * @type {object}
       */
      this.instance = null;

      /**
       * 组件配置参数
       * @type {object}
       */
      this.opts = null;

      /**
       * 组件所需数据
       * @type {object | array}
       */
      this.sourceData = null;

      /**
       * 组件是否初始化完成
       * @type {boolean}
       */
      this.complete = false;

      this.initDom();
    }

    /**
     * @desc 初始化 dom 节点
     */
    initDom() {
      const size = this.parent.getSize();
      const dom = document.createElement('div');
      dom.style.width = `${size.width}px`;
      dom.style.height = `${size.height}px`;

      this.dom = dom;
    }

    /**
     * @desc 重置组件参数
     * @param {object} opts 组件属性参数
     */
    setOption(opts) {
      this.opts = opts;
    }

    /**
     * @desc 重置组件数据
     * @param {object | Array} data 组件数据
     */
    setData(data) {
      this.sourceData = data;
    }

    /**
     * @desc 获取组件参数
     */
    getOption() {
      return this.opts
    }

    /**
     * @desc 获取组件数据
     */
    getData() {
      return this.sourceData
    }

    /**
     * @desc 获取组件实例
     */
    getInstance() {
      return this.instance
    }

    /**
     * @desc 注销组件并释放资源
     */
    destroy() {
      this.dom && this.parent.getDom().removeChild(this.dom);
    }
  }

  let conch;

  /**
   * Conch组件适配器
   */
  class ConchAdapter extends BaseAdapter {
    constructor(parent, name) {
      super(parent, name);
    }
    /**
     * 装在 conch
     * @returns conch
     */
    static _loadConch() {
      if (!window.conch) {
        console.warn('请先加载spray-conch，否则组件将无法使用');
        return false
      }
      conch = window.conch;
      return conch
    }
    /**
     * 通过工厂生产 conchAdapter
     * @param {*} parent container
     * @param {*} name conch 名称
     * @returns conchAdapter
     */
    static factory(parent, name) {
      let instance = null;

      if (!conch) {
        ConchAdapter._loadConch();
      }
      if (!conch || !conch[name]) {
        throw new Error(`Conch没有加载或Conch中没有ID为${name}的组件`)
      }

      instance = new ConchAdapter(parent, name);

      return instance
    }
    /**
     * 初始化 conchAdapter
     * @param {*} opts 参数
     */
    init(opts) {
      const layout = this.parent.layout;
      if (!layout) {
        return
      }
      this.opts = opts;

      // this.parent && (conch = window.conch)

      if (!conch[this.name]) {
        throw new Error(
          `组件${this.name}未检测到，请先到spray-conch中下载对应的组件包`
        )
      }
      this.parent.getDom() && this.parent.getDom().appendChild(this.dom);
      this.parent &&
        !this.componentInstance &&
        this.dom &&
        (this.componentInstance = new conch[this.name](this.dom, this.opts));

      if (this.parent.staticData) {
        this.setData(this.parent.staticData);
      } else {
        // 首次，获取Conch数据并保存
        this.sourceData = this.componentInstance.data;
      }

      this.componentInstance.render();
    }

    /**
     * @desc 重置组件参数
     * @param {object} opts 组件属性参数
     */
    setOption(opts) {
      super.setOption(opts);
      this.instance && this.instance.setOption(this.opts);
    }

    /**
     * @desc 重置组件数据
     * @param {object | Array} data 组件数据
     */
    setData(data) {
      super.setData(data);
      this.instance && this.instance.setData(data);
    }

    /**
     * @desc 重置组件大小
     */
    resize() {
      const size = this.parent.getSize();
      const width = size.width;
      const height = size.height;
      this.dom.style.width = `${width}px`;
      this.dom.style.height = `${height}px`;
      this.instance && this.instance.resize && this.instance.resize();
    }

    /**
     * @desc 注销组件并释放资源
     */
    destroy() {
      this.instance && this.instance.destroy();
      super.destroy();
      this.parent = null;
    }
  }

  /**
   * UI 工具类
   */
  class Util {
    constructor() {
      this.seed = new Date().getTime();
    }
    rnd(seed) {
      this.seed = (seed * 9301 + 49297) % 233280;
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
      });

      if (!sourceIsObject) {
        return console.error('source参数错误: ' + source)
      }

      source.forEach(item => {
        this._deepMixinOpts(target, item);
      });

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
            target[key] = {};
          }

          this._deepMixinOpts(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      });
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
      const proto = source.prototype ? source.prototype : source;
      Object.getOwnPropertyNames(proto).forEach(name => {
        if (name !== 'constructor') {
          target.prototype[name] = proto[name];
        }
      });
    }

    /**
     * @desc 对象混入,用于将一个Class的成员方法混入到另一个类中，实现Class从多个类继承的效果，主要用于团队并行开发，提高开发效率
     * @param {object} target 目标类，需要从基类并入prototype属性
     * @param {Array|Object} sources 基类，将prototype中的属性并入目标类
     */
    applyMixins(target, sources) {
      if (Array.isArray(sources)) {
        sources.forEach(item => {
          this._applyMixin(target, item);
        });
      } else {
        this._applyMixin(target, sources);
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
      Object.setPrototypeOf(F.prototype, o);
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
      const p = this.inheritObject(SuperClass.prototype);
      p.constructor = SubClass;
      Object.setPrototypeOf(SubClass.prototype, p);
      return true
    }
  }

  var util = new Util();

  /**
   * store的实现类
   */
  class Store {
    constructor(modlue, name) {
      this.name = name;
      const { state, get, set } = modlue;
      this.state = state;
      this.get = get;
      this.set = set;
    }

    /**
     * @desc 给StoreManager对象添加从modules中获取到的方法
     * @param {object} vm StoreManager对象
     */
    registerToManager(vm) {
      const store = (vm[this.name] = {});
      const funs = ['get', 'set'];
      funs.forEach(k => {
        for (const key in this[k]) {
          store[key] = this[k][key].bind(null, this.state);
        }
      });
    }
  }

  /**
   * store管理类
   */
  class StoreManager {
    constructor(modules) {
      // 存储分区
      if (!modules) {
        return
      }
      for (const key in modules) {
        const store = new Store(modules[key], key);
        store.registerToManager(this);
      }
    }
  }

  const comp = {
    state: {
      compContext: null
    },
    get: {
      getContext: state => state.compContext
    },
    set: {
      setContext: (state, context) => (state.compContext = context),
      clearContext: state => (state.compContext = null)
    }
  };

  const UI = {
    state: {
      root: null,
      isDrag: null
    },
    get: {
      getRoot: state => state.root,
      getDrag: state => state.isDrag
    },
    set: {
      setRoot: (state, root) => (state.root = root),
      setDrag: (state, isDrag) => (state.isDrag = isDrag)
    }
  };
  const THING$1 = {
    state: {
      THING: null
    },
    set: {
      setTHING: (state, thing) => (state.THING = thing)
    },
    get: {
      getApp: state => state.THING && state.THING.App.current
    }
  };

  /**
   * @desc 告警
   */
  const alarm = {
    state: {
      alarmTime: {}
    },
    set: {
      setAlarmTime: (state, times) => (state.alarmTime = times)
    },
    get: {
      getAlarmTime: state => state.alarmTime
    }
  };

  var store = new StoreManager({
    comp,
    UI,
    THING: THING$1,
    alarm
  });

  // import queue from './queue'
  const _events = new Map();

  /**
   * @desc 根据事件名称获取eventbus数组
   * @param {String} event 事件名称
   */
  const _get = event => {
    return _events.get(event)
  };

  /**
   * @desc 循环触发emit事件
   * @param {Array} handler 根据事件名称获取的事件列对象
   * @param {...any} args 参数
   */
  const _doEmitMap = (handler, args) => {
    handler.forEach(v => {
      // queue.addTask(() => {
      v.ctx ? v.fn.apply(v.ctx, args) : v.fn(...args);
      // })
    });
  };

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
      const handler = _get(event);
      const _object = { fn, name: ctx ? ctx._name : this._name, ctx };
      if (!handler) {
        _events.set(event, Array.isArray(fn) ? [] : [_object]);
      } else {
        handler.push(_object);
      }
    }

    /**
     * @desc 对事件进行一次性监听
     * @param {String} event 监听事件名称
     * @param {Function} fn 监听事件
     */
    once(event, fn) {
      const _this = this;
      const _handler = function (...args) {
        fn(...args);
        _this.off(event, _handler);
      };
      this.on(event, _handler);
    }
    /**
     * @desc  触发监听事件并给监听事件传递参数
     * @param {String} event 监听事件名称
     * @param {...Any} args 事件执行参数
     */
    emit(event, ...args) {
      let _name = '';
      let handler = null;
      if (event.split(':').length > 1) {
  [_name, event] = event.split(':');
        handler = _get(event) && _get(event).filter(v => v.name === _name);
      } else {
        handler = _get(event);
      }
      if (!util.confirmArr(handler)) {
        return false
      }
      _doEmitMap(handler, args);
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
      let handler = _get(event);
      if (!util.confirmArr(handler)) {
        return false
      }
      if (ctx) {
        handler = _offCtx(handler, fn, ctx);
      } else {
        handler = _offNoCtx(handler, fn, this);
      }
      _events.set(event, handler);
      return true
    }
    /**
     *@desc 删除当前组件的所有名称为`event`的事件
     * @param {String} event 事件名称
     */
    clear(event, ctx) {
      const _this = this;
      const handler = _get(event);
      if (!util.confirmArr(handler)) {
        return false
      }
      const _getCondition = function (v) {
        return ctx
          ? !(v.ctx === ctx && v.name === ctx._name)
          : v.name !== _this._name
      };
      _events.set(
        event,
        handler.filter(v => _getCondition(v))
      );
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
      _events.delete(event);
      return true
    }
  }

  /**
   * UI 基类
   * 提供基础配置参数
   * 提供map存储功能
   * 提供基础属性获取功能
   */
  class Displayable extends EventBus {
    constructor(parent, opts, root) {
      super();
      this.parent = parent;
      this.opts = opts || {};
      this.root = root || store.UI.getRoot();
      this.id = null;
      // console.log(this)
      this.clazzMap = new Map();
      // console.log(this)
      this._initRootStyle(this.root);
    }

    /**
     * @desc 将clazz实例添加到map集
     * @param {String|Number} id
     * @param {object} clazz
     * @returns {object} clazz
     */
    _setMap(id, clazz) {
      if (this.clazzMap.has(id)) {
        throw new Error('id不能重复')
      }

      this.clazzMap.set(id, clazz);
      return this.clazzMap
    }
    /**
     * 是否含有 map
     * @param {*} id
     * @returns 是否含有id的对象
     */
    _hasMap(id) {
      return this.clazzMap.has(id)
    }
    /**
     * 根据id删除对象
     * @param {*} id
     * @returns 是否删除
     */
    _deleteMap(id) {
      if (!id) {
        throw new Error('id不能为空')
      }
      return this.clazzMap.delete(id)
    }

    _getMapById(id) {
      return id ? this.clazzMap.get(id) : null
    }

    _getMapKeys() {
      return Array.from(this.clazzMap.keys())
    }

    _getMapValues() {
      return Array.from(this.clazzMap.values())
    }

    _clearMap() {
      this.clazzMap.clear();
    }

    /**
     * @desc 初始化id
     * @param {string} type 类型
     */
    _initId(type) {
      if (this.opts.id) {
        this.id = this.opts.id;
      } else {
        this.id = util.createElementName(type || this.name);
      }
      return this.id
    }

    /**
     * @desc 初始化根节点的样式
     */
    _initRootStyle(root) {
      if (!root || !root.style) {
        return
      }
      root.style.position = 'relative';
      root.style.overflow = 'hidden';
    }

    destroy() {
      this._clearMap();
    }

    /**
     * @desc 获取挂载根节点
     */
    getAppRoot() {
      return this.root
    }

    get type() {
      return this.constructor.name.toLowerCase()
    }
  }

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
      this.adapter = adapter.creatComponent(type, this, name);
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
        );
        return
      }
      this.adapter.init(opts);
    },

    /**
     * @desc 注销组件适配器并释放相关资源
     */
    destroyAdapter() {
      this.adapter && this.adapter.destroy();
      this.adapter = null;
    }
  };

  /**
   * Drag类
   */
  class Drag {
    constructor(parent) {
      // 鼠标距容器左边距
      this.leftSpace = 0;
      // 鼠标距容器上边距
      this.topSpace = 0;
      this.isdown = false;
      // Container对象
      this.parent = parent;
      // 获取dom节点
      this.dom = parent.getDom();
      // 修改this指向
      this.down = this._down.bind(this);
      this.up = this._up.bind(this);
      this.move = this._move.bind(this);

      this.initDrag();
    }

    /**
     * @desc 添加拖拽模块
     */
    initDrag() {
      // 添加鼠标按下监听
      this.dom.addEventListener('mousedown', this.down);
    }

    /**
     * @desc 移除mousedown监听
     */
    removeDown() {
      this.dom.removeEventListener('mousedown', this.down);
    }

    /**
     * @desc 鼠标按下
     * @param {event} e down事件
     */
    _down(e) {
      this.leftSpace = e.clientX - this.dom.offsetLeft;
      this.topSpace = e.clientY - this.dom.offsetTop;
      this.isdown = true;
      this.parent.style.cursor = 'move';
      // 添加鼠标移动监听
      window.addEventListener('mousemove', this.move);

      // 添加鼠标抬起监听
      window.addEventListener('mouseup', this.up);

      e.stopPropagation();
    }

    /**
     * @desc 移动
     * @param {event} e move事件
     */
    _move(e) {
      if (!this.isdown) {
        return
      }

      this.parent.style.left = e.clientX - this.leftSpace;
      this.parent.style.top = e.clientY - this.topSpace;
    }

    /**
     * @desc 抬起
     */
    _up() {
      this.isdown = false;
      window.removeEventListener('mousemove', this.move);
      window.removeEventListener('mouseup', this.up);
      this.parent.style.cursor = 'default';
    }
  }

  /**
   * 任务队列
   */
  class Queue {
    constructor() {
      /**
       * @desc 任务列表
       * @type {Array<Function>}
       */
      this.queues = [];

      /**
       * @desc 如果不在同一帧，则返回不执行，保证重新执行的唯一性
       * @type {Number}
       */
      this._reDrawId = null;

      /**
       * @desc rAF是否执行
       * @type {Boolean}
       */
      this._isRunning = false;
      this.taskMap = new Map();
    }

    /**
     * @desc 添加任务
     * @param {Function} task 任务
     */
    addTask(task, name) {
      if (!task || typeof task !== 'function') {
        console.warn('添加任务队列失败，请检查任务是否为Function');
        return false
      }
      name
        ? !this.taskMap.has(name) && this.taskMap.set(name, task)
        : this.queues.push(task);
      this.start();
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
      this._isRunning = true;
      this._reDrawId = util.randomNum(1e5);
      this._exect(this.queues, this._reDrawId);
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
      ;[...this.taskMap.values()].forEach(fn => fn());
      const self = this;
      window.requestAnimationFrame(function () {
        self._exect(list, reDrawId);
      });
      return true
    }

    /**
     * @desc 将任务队列的所有任务按照顺序一一执行
     * @param {Array<Function>} list 任务列表
     * @returns {Boolean} 一帧是否执行完毕
     */
    _doExect(list) {
      let finished = true;
      if (util.confirmArr(list)) {
        const startTime = this._getNow();
        for (let i = 0, len = list.length; i < len; i++) {
          list[0]();
          list.shift();
          if (this._getNow() - startTime > 15 && list.length > 0) {
            finished = false;
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

  const queue = new Queue();

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
  ];

  function setTransform(k) {
    return function (v) {
      this._setTransform(k, v);
    }
  }
  function setDistance(k, i) {
    return function (v) {
      this._setDistance(k, i, v);
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
  ['Top', 'Right', 'Bottom', 'Left'].forEach(
      (k, i) => (styleFnMap[t + k] = setDistance(t, i))
    );
  });

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
      this.parent = parent;

      this.layout = this.parent.layout;

      /**
       * @desc 所有样式存储
       */
      this._style = {};

      this.dirtyMap = {};

      return new Proxy(this, {
        get(target, key, proxy) {
          if (STYLELIST.indexOf(key) !== -1 || Reflect.has(styleFnMap, key)) {
            return target._style[key]
          }
          const value = Reflect.get(target, key, proxy);
          return value
        },
        set(target, key, value, proxy) {
          if (STYLELIST.indexOf(key) !== -1) {
            target._setStyle(key, value);
            return true
          } else if (styleFnMap[key]) {
            styleFnMap[key].call(target, value);
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
        this[item] = options[item];
      });

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
      let style = '';

      if (this._style.translate && this._style.translate.length === 2) {
        style += `translate(${this._style.translate[0]}px, ${this._style.translate[1]}px)`;
      }

      if (this._style.scale && this._style.scale.length === 2) {
        style.length && (style += ' ');
        style += `scale(${this._style.scale[0]}, ${this._style.scale[1]})`;
      }

      if (this._style.rotate) {
        style.length && (style += ' ');
        style += `rotate(${this._style.rotate}deg)`;
      }

      if (this._style.skew && this._style.skew.length === 2) {
        style.length && (style += ' ');
        style += `skew(${this._style.skew[0]}deg, ${this._style.skew[1]}deg)`;
      }

      if (this._style.matrix && this._style.matrix.length === 6) {
        style.length && (style += ' ');
        style += `matrix(${this._style.matrix.join(',')})`;
      }

      return style
    }

    /**
     * @desc 获取脏数据样式列表
     * @return {Array<Object>}
     */
    getDirtyStyleList() {
      const result = [];

      for (const key in this.dirtyMap) {
        const value = this.getValue(key);
        this.dirtyMap[key] = false;
        if (value === null || value === undefined) {
          continue
        }
        result.push({ name: key, value: value });
      }

      return result
    }

    _setStyle(key, value) {
      if (util.isType(value, 'Object')) {
        this._style[value.name] = value.value;
      } else {
        this._style[key] = value;
      }
      this.dirtyMap[key] = true;
      this.parent.dirty = true;
      queue.addTask(this.parent.update());
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
      let distance = this[type];

      if (!util.isType(distance, 'Array')) {
        distance = [0, 0, 0, 0];
      }
      distance[index] = value;

      this._setStyle(type, distance);
    }

    _setTransform(type, value) {
      const needTransformArr = ['translate', 'scale', 'skew'];
      const content = needTransformArr.includes(type)
        ? this.formatValue(value)
        : value;
      this._setStyle('transform', { name: type, value: content });
    }

    formatValue(value) {
      let res = '';
      if (util.isType(value, 'Number')) {
        res = [value, value];
      }

      // 2.如果是一个数组，则要判断两个值都是数值型，然后赋值给,x,y
      if (
        util.isType(value, 'Array') &&
        util.isType(value[0], 'Number') &&
        util.isType(value[1], 'Number')
      ) {
        res = [value[0], value[1]];
      }
      return res
    }

    /**
     * @desc 接收单样式更新数据，提示Displayable有样式需要更新
     * @param {boolean} value
     */
    set dirty(value) {
      this.parent.dirty = value;
    }

    /**
     * @desc 获取单样式更新数据
     */
    get dirty() {
      return this.parent.dirty
    }
  }

  /**
   * Container容器
   */
  class Container extends Displayable {
    /**
     * @desc 构造函数
     * @param {Layer} parent 父级元素
     * @param {Object} opts 传入容器的配置对象
     */
    constructor(parent, opts) {
      super(parent, opts);

      // 容器默认参数
      const defaultOpts = {
        id: null,
        style: {
          width: 500,
          height: 500,
          position: 'absolute'
        }
      };

      this.layout = this.parent.layout;

      this.dom = null;
      // 合并options，深拷贝
      this.opts = util.deepMixinOpts(defaultOpts, opts);
      // this.width = this.opts.width
      // this.height = this.opts.height
      this.dealOpts();

      this.isShow = true;

      // style实例
      this.style = Style.factory(this);

      // 名称
      this._initId('container');

      this.drag = null;

      this.initDom();

      if (store.UI.getDrag()) {
        this.drag = new Drag(this);
      }

      // 根据opts初始化样式
      this.style.setOption(this.opts.style);

      // 适配器实例
      this.adapter = null;

      this.dirty = false;

      // this.update()
      this.loadAdapter();
    }

    /**
     * @desc 通过工厂创建Container实例
     * @param {Container} parent Container对象
     * @param {object} opts 配置参数
     */
    static factory(parent, opts) {
      return new Container(parent, opts)
    }

    /**
     * @desc 转换创建容器时传入的top和left
     */
    dealOpts() {
      this.opts.top = this.opts.top || this.opts.style.top || 0;
      this.opts.left = this.opts.left || this.opts.style.left || 0;
      this.opts.style.top = 0;
      this.opts.style.left = 0;
    }

    /**
     * @desc 初始化Dom节点,挂载到页面
     */
    initDom() {
      this.dom = this._createDom();
      this.dom.style.pointerEvents = 'auto';
      this.mount();
    }

    /**
     * @desc 创建dom
     * @param {string} type 元素类型
     */
    _createDom() {
      const dom = document.createElement('div');
      dom.dataset.id = this.id;
      return dom
    }
    /**
     * 获取容器的 dom 节点
     * @returns {HTMLDivElement} 容器 dom 节点
     */
    getDom() {
      return this.dom
    }

    /**
     * @desc 挂载
     */
    mount() {
      this.root.appendChild(this.dom);
    }

    /**
     * @desc 卸载
     */
    unmount() {
      this.dom && this.root.removeChild(this.dom);
    }

    /**
     * @desc 调用适配器渲染组件,注册、初始化
     */
    loadAdapter() {
      if (this.opts.adapter) {
        const adapterOpts = this.opts.adapter;
        this.createAdapter(adapterOpts.type, adapterOpts.name);
        this.initAdapter(adapterOpts.option);
      }
    }

    /**
     * @desc 提供width、height给conch组件
     */
    getSize() {
      return {
        width: this.width,
        height: this.height
      }
    }

    /**
     * @desc 显示
     */
    show() {
      if (this.isShow) {
        return
      }
      this.isShow = true;

      this.style.display = '';
      // this.update()
    }

    /**
     * @desc 隐藏
     */
    hide() {
      if (!this.isShow) {
        return
      }
      this.isShow = false;

      this.style.display = 'none';
      // this.update()
    }

    /**
     * @desc 更新可显示元素样式
     */
    update() {
      return () => {
        const dirtyStyleList = this.style.getDirtyStyleList();
        dirtyStyleList.forEach(item => {
          this.dom.style[item.name] = item.value;
        });
      }
    }

    /**
     * @desc 更新样式
     * @param {string} opts 传入的配置参数对象
     */
    setOption(opts) {
      if (Reflect.has(opts, 'id')) {
        throw new Error('配置更新失败, 容器id无法更新, 请输入正确的配置')
      }
      this.opts = util.deepMixinOpts(this.opts, opts);
      this.style.setOption(opts);
      // this.update()
      this.adapter && this.adapter.resize && this.adapter.resize();
    }

    /**
     * @desc 销毁容器
     */
    destroy() {
      // 销毁组件（适配器）、销毁节点、销毁对象（ID，parent等）
      this.destroyAdapter();
      this.unmount();
      this.drag && this.drag.removeDown();
      this.id = null;
      this.dom = null;
    }

    get width() {
      return this.style.width
    }

    get height() {
      return this.style.height
    }
  }

  util.applyMixins(Container, [adapterMixin]);

  /**
   * class 注册管理模块
   */
  class ClazzMap extends MapHandle {
    /**
     * 通过对象名称创建对象，对象必须是通过registClazz注册
     * @param {*} key 已注册的类名称
     * @param {*} parent 该对象所属的父级对象
     * @param {*} opts 创建对象实例所需的配置参数
     * @param  {...any} args 其余参数
     * @returns 实例化的对象
     */
    newFromRegistedClazz(key, parent, opts, ...args) {
      return this._create(key, parent, opts, ...args)
    }

    /**
     * @desc 将对象注册到注册表中，用于后续创建使用
     * @param {string} key 注册Class时使用的名称
     * @param {object} clazz 注册的Class
     */
    registClazz(key, clazz) {
      this._set(key, clazz);
    }
  }

  var register = new ClazzMap();

  /**
   * 图层对象
   */
  class Layer extends Displayable {
    /**
     * @desc 构造函数
     * @param {Layout} parent 父级元素对象实例
     * @param {Object} opts 传入的图层配置参数
     */
    constructor(parent, opts) {
      super(parent, opts);

      this.pos = {
        x: opts.x || 0,
        y: opts.y || 0
      };

      this.layout = this.parent;

      this.sceneId = null;

      this.isShow = true;
      this._initId('layer');

      this._onEvent();
    }

    /**
     * @desc 初始化事件
     */
    _onEvent() {
      this.on('windowResize', this._doLayout, this);
    }

    /**
     * @desc 销毁事件
     */
    _offEvent() {
      this.off('windowResize', this._doLayout);
    }

    /**
     * @desc 计算容器布局
     */
    _doLayout() {
      this.getContainers().forEach(ct => {
        this._setLayout(ct);
      });
    }

    /**
     * @desc 布局操作
     * @param {Container} ct 容器对象
     */
    _setLayout(ct) {
      this.parent.setLayout(ct, {
        top: this.pos.y + ct.opts.top, //相对于root的top
        left: this.pos.x + ct.opts.left //相对于root的left
      });

      ct.update();
    }

    /**
     * @desc 控制容器的显示
     */
    show() {
      this.isShow = true;
      this.getContainers().forEach(ct => ct.show());
    }

    /**
     * @desc 控制容器的隐藏
     */
    hide() {
      this.isShow = false;
      this.getContainers().forEach(ct => ct.hide());
    }

    /**
     * @desc 通过工厂方法制造Layer实例
     * @param {Layout} parent layout对象
     * @param {Object} opts 传入的容器可配置参数
     * @returns {Layer} 返回图层实例
     */
    static factory(parent, opts = {}) {
      return new Layer(parent, opts)
    }

    /**
     * @desc 创建容器
     * @param {Object} opts 创建容器所需的opts
     */
    createContainer(opts = {}) {
      opts = { ...this.pos, ...opts };
      const ct = register.newFromRegistedClazz('Container', this, opts);
      // 将容器实例添加到map集
      this._setMap(ct.id, ct);

      this._setLayout(ct);

      return ct
    }

    /**
     * @desc 销毁容器
     * @param {Array|Object|String} option 需要销毁的容器，支持容器对象、容器对象数组、容器id、容器id数组
     */
    removeContainer(option) {
      if (util.isType(option, 'Array')) {
        return option.every(opt => {
          return this._removeContainer(opt)
        })
      } else {
        return this._removeContainer(option)
      }
    }

    /**
     * @desc 销毁单个容器
     * @param {Object|String} opt 容器对象或容器id
     */
    _removeContainer(opt) {
      const _ct = util.isType(opt, 'Object') ? opt : this.getContainer(opt);
      let _r = false;

      if (_ct) {
        // 将容器从map集中删除
        _r = this._deleteMap(_ct.id);
        // 销毁容器
        _ct.destroy();
      }

      return _r
    }

    /**
     * @desc 判断是否存在容器
     * @param {string} id 需要判断是否存在的容器的id
     */
    hasContainer(id) {
      return this._hasMap(id)
    }

    /**
     * @desc 通过id获取对应的容器
     * @param {string} id 容器id
     */
    getContainer(id) {
      return this._getMapById(id)
    }

    /**
     * @desc 查找所有容器
     */
    getContainers() {
      return this._getMapValues()
    }

    /**
     * @desc 获取当前所有容器对象的id
     */
    getContainerIds() {
      return this._getMapKeys()
    }

    /**
     * @param {Object} opts 图层配置参数
     */
    setOption(opts = {}) {
      if (Reflect.has(opts, 'id')) {
        throw new Error('图层id不能改变')
      }

      if (Reflect.has(opts, 'x')) {
        this.pos.x = opts.x;
      }
      if (Reflect.has(opts, 'y')) {
        this.pos.y = opts.y;
      }

      this._doLayout();

      return this
    }

    /**
     * @override
     * @desc 重写父类，释放图层及其子对象的所有资源
     */
    destroy() {
      this.removeContainer(this.getContainers());
      this._offEvent();
      super.destroy();
    }

    set x(value) {
      this.pos.x = value;
      this.getContainers().forEach(ct => {
        ct.setOption({
          x: value
        });
      });
    }

    get x() {
      return this.pos.x
    }

    set y(value) {
      this.pos.y = value;
      this.getContainers().forEach(ct => {
        ct.setOption({
          y: value
        });
      });
    }

    get y() {
      return this.pos.y
    }
  }

  /**
   * Sequence类
   */
  class Sequence {
    /**
     * @desc 动画切换的先后顺序
     * @param {parent} parent  实例
     */
    constructor(parent) {
      this.parent = parent;
      /**
       * 动画执行总集合
       * @type {Array}
       */
      this.totalTicks = [];
      /**
       * 当前执行动画
       * @type {Array}
       */
      this.ticks = [];
      /**
       * 每组animate队列执行完毕的回调列表
       * @type {Array}
       */
      this.callbacks = [];
    }

    static factory(parent) {
      return new Sequence(parent)
    }

    /**
     * @desc 添加动画,并创建化动画类
     */
    addTicks(ticks, callback) {
      if (util.confirmArr(ticks)) {
        this.totalTicks.push(ticks);
        this.callbacks.push(callback);
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
        this.ticks = this.totalTicks[0];
        this.totalTicks.shift();
      }
      return this.ticks
    }
  }

  /**
   * @desc 动画列表
   * @type {Array}
   */
  const ANIMATE_LIST = [
    'FROMTOP',
    'FROMBOTTOM',
    'FROMLEFT',
    'FROMRIGHT',
    'TOTOP',
    'TOBOTTOM',
    'TOLEFT',
    'TORIGHT'
  ];

  /**
   * Tick类
   */
  class Tick {
    constructor(parent, opts) {
      // 动画类
      this.parent = parent;
      // 动画执行的目标元素
      this.target = this.parent.target;
      this.layout = this.target.parent.parent;
      this.opts = opts;
      // 动画的类型，translate|scale 等
      this.type = this.opts.type;
      this.duration = this.parent.duration;
      this.delay = this.parent.delay || 0;
      this.callback = this.parent.callback;

      this.startValue = null;
      this.currentValue = null;
      this.endValue = null;

      this.startTime = 0;
      this.endTime = 0;
      this.pauseTime = 0;

      this.stopped = false;
      this.ended = false;

      this.easingType = this.parent.easing || 'linear';

      this.easing = {
        linear: (t, b, c, d) => {
          return c * (t / d) + b
        },
        easeOut: (t, b, c, d) => {
          const s = t / d - 1;
          return -c * (Math.pow(s, 4) - 1) + b
        }
      };
    }

    static factory(parent, opts) {
      return new Tick(parent, opts)
    }

    /**
     * @desc 开始动画
     */
    init() {
      return () => {
        this.startTime = this.startTime || this.getNow();
        if (this.getNow() - this.startTime < this.delay) {
          return true
        }
        const currentTime = this.getNow();
        if (currentTime > this.startTime + this.duration + this.delay) {
          this.ended = true;
          this.callback &&
            typeof this.callback === 'function' &&
            this.callback(this.target);
        } else {
          this.run();
          return true
        }
        return false
      }
    }

    /**
     * @desc 结束动画
     */
    stop() {
      this.stopped = true;
    }

    /**
     * @desc 暂停动画
     */
    pause() {
      this.stopped = true;
      this.pauseTime = this.getNow();
    }

    /**
     * @desc 运行动画
     * @param {number} progress 动画的进度
     */
    run() {
      if (!this.target) {
        return false
      }
      this.type === 'custom' ? this._runCustom() : this._runDefault();
      return true
    }

    /**
     * @desc 执行自定义动画
     */
    _runCustom() {
      const { animation } = this.parent;
      util.isType(animation, 'Function') && animation(this.target);
    }

    /**
     * @desc 执行默认动画
     */
    _runDefault() {
      this.startValue = this.startValue || this.getValue(this.type);
      this.endValue = this.endValue || this.getEndValue(this.opts.endValue);
      const currentTime = this.getNow();

      if (['translate', 'scale', 'skew'].includes(this.type)) {
        this.currentValue = [];
        this.currentValue[0] = this.easing[this.easingType](
          currentTime - this.startTime - this.delay,
          this.startValue[0],
          this.endValue[0] - this.startValue[0],
          this.duration
        );
        this.currentValue[1] = this.easing[this.easingType](
          currentTime - this.startTime,
          this.startValue[1],
          this.endValue[1] - this.startValue[1],
          this.duration
        );
      } else {
        this.currentValue = this.easing[this.easingType](
          currentTime - this.startTime,
          this.startValue,
          this.endValue - this.startValue,
          this.duration
        );
      }

      this.target.setOption({ [this.type]: this.currentValue });
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
        const opacity = this.target.style[this.type];
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
          const val1 = this.target.style._style[this.type][0] + Number(value);
          const val2 = this.target.style._style[this.type][1] + Number(value);
          return [val1, val2]
        }

        if (util.isType(value, 'Number')) {
          const val1 = this.target.style._style[this.type][0] + value;
          const val2 = this.target.style._style[this.type][1] + value;
          return [val1, val2]
        }

        if (util.isType(value, 'Array')) {
          const val1 = this.target.style._style[this.type][0] + value[0];
          const val2 = this.target.style._style[this.type][1] + value[1];
          return [val1, val2]
        }
      }

      if ('opacity'.includes(this.type)) {
        return Number(value)
      }

      if (util.isType(value, 'String')) {
        const val = this.target.style[this.type] + Number(value);
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
      this.id = util.createElementName();
      this.opts = opts;
      /**
       * @desc 需要执行动画的实例
       */
      this.target = opts.target;
      /**
       * @desc 动画样式集合
       */
      this.animation = opts.animation || {};
      /**
       * @desc 元素的隐藏或展示
       */
      // this.type = type || 'show'
      /**
       * @desc 动画执行时间
       */
      this.duration = opts.duration || 0;
      /**
       * @desc 动画延迟时间
       */
      this.delay = opts.delay || 0;

      this.easing = opts.easing;

      this.callback = opts.callback;

      this.tweens = [];

      this.init();
    }

    /**
     * @desc 初始化
     */
    init() {
      util.isType(this.animation, 'Function')
        ? this._initCustomTweens()
        : this._initDefaultTweens();
    }

    /**
     * @desc 初始化自定义动画
     */
    _initCustomTweens() {
      const tween = new Tick(this, { type: 'custom' });
      this.tweens.push(tween);
    }

    /**
     * @desc 初始化默认动画
     */
    _initDefaultTweens() {
      Object.keys(this.animation).forEach(css => {
        const options = {
          type: css,
          endValue: this.animation[css]
        };
        const tween = new Tick(this, options);
        this.tweens.push(tween);
      });
    }

    /**
     * @desc 开始动画
     * @return {Animator} Animator实例
     */
    start() {
      const ticks = [];
      this._runBefore();
      this.tweens.forEach(tween => ticks.push(tween.init()));
      this.tweens.length && (this.paused = false);
      return ticks
    }

    /**
     * @desc 在动画开始前执行的回调
     */
    _runBefore() {
      const { before } = this.opts;
      util.isType(before, 'Function') && before(this.target);
    }

    /**
     * @desc 暂停动画
     */
    pause() {
      this.tweens.forEach(tween => tween.pause());
      this.tweens.length && (this.paused = true);
      return this
    }

    /**
     * @desc 关闭动画
     */
    stop() {
      this.tweens.forEach(tween => tween.stop());
      this.destroy();
    }

    /**
     * @desc 最终
     */
    destroy() {
      this.tweens = [];
      this.target = {};
    }
    static factory(target, animation, duration, delay, callback) {
      return new Animator(target, animation, duration, delay, callback)
    }
  }

  /**
   * AnimationManager类
   */
  class AnimationManager {
    constructor(parent) {
      this.parent = parent;
      this._isRunning = false;
      this.animationSequence = Sequence.factory(this.parent);

      // 自定义动画
      this.customAnimations = new Map();
      this.init();

      this.scenes = this.parent.scenes;
    }

    /**
     * @desc 动画名称挂载
     */
    init() {
      ANIMATE_LIST.forEach(v => {
        this[v] = v;
      });
    }
    // static factory(parent) {
    //   return new AnimationManager(parent)
    // }

    /**
     * @desc 场景切换
     * @param {String} sceneId 需要显示的场景id
     */
    toggle(sceneId) {
      const curScene = this.scenes.getVisibleScene();
      // 单个场景移入
      util.isType(sceneId, 'String') && this._singleIn(curScene, sceneId);
    }

    /**
     * @desc 将当前页面的场景全部移除，并移入指定场景
     * @desc {object} curScene 当前场景
     * @desc {string} sceneId 需要移入的场景的id
     */
    _singleIn(curScene, sceneId) {
      const curSceneIds = Object.keys(curScene);
      // 将当前场景移出
      if (curSceneIds.includes(sceneId)) {
        return
      }
      curSceneIds.forEach(id => this._sceneAnimator(curScene[id]));

      // 将需要显示的场景移入
      const subScene = this.scenes.getSceneById(sceneId);
      this._sceneAnimator(subScene);
    }

    /**
     * @desc 场景动画
     * @param {Object} scene 场景
     */
    _sceneAnimator(scene) {
      // 获取场景内所有容器
      const containers = this._getSceneContainers(scene);
      // 划分容器到可视窗口的对应区域
      const area = this._setArea(containers);
      // 判断场景动画方向
      const action = scene.status === 'show' ? 'out' : 'in';
      if (action === 'out') {
        // 为不同区域设置不同动画，并执行移出动画
        const areaAnimator = this._getAnimationOpts(area, action);
        this.parent.sceneTransition.createAnimation(areaAnimator, () => {
          // 将移出场景状态置为隐藏
          this.scenes.setSceneStatus(scene, 'hide');
        });
      } else {
        // 如果场景做进入动画，现将场景内容器移至可视窗口两侧
        this._isInWindow(containers) && this._moveOutSubArea(area);
        // 将需要移入场景状态置为显示
        this.scenes.setSceneStatus(scene, 'show');

        // 为不同区域设置不同动画，并执行移入动画
        const areaAnimator = this._getAnimationOpts(area, action);
        this.parent.sceneTransition.createAnimation(areaAnimator);
      }
    }

    /**
     * @desc 判断场景是否在窗口内
     */
    _isInWindow(containers) {
      let res = false;
      let len = containers.length;
      const { canvasWidth } = this.parent.opts;
      const saveDistance = 10;
      while (len > 0) {
        const style = containers[len - 1].style;
        const { width, translate, left, scale } = style;
        if (
          width * scale[0] + translate[0] + left > saveDistance &&
          translate[0] + left < canvasWidth * scale[0] - saveDistance
        ) {
          res = true;
          break
        }
        len--;
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
      };
      Object.keys(area).forEach(key => {
        const containers = area[key];
        containers.forEach(container => {
          if (key === 'mid') {
            container.style.opacity = 0;
          } else {
            const style = this.parent.sceneTransition._getTranslate(
              container,
              moveOutTypeMap[key]
            );
            const translate = container.style.translate;
            container.style.translate = [
              translate && translate[0] + style[0],
              translate && translate[1] + style[1]
            ];
          }
          container.update();
        });
      });
    }

    /**
     * @desc 为不同区域容器设置不同动画
     * @param {object} area 区域对象
     * @param {string} type 场景切换动画的类型，in/out，进/出
     */
    _getAnimationOpts(area, type) {
      let res = [];
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
      };
      // console.log('area', area)
      Object.keys(area).forEach(key => {
        const opts = this._getAnimationGroups(
          area[key],
          defaultAnimationMap[key][type],
          type === 'out' ? 'linear' : 'easeOut'
        );
        // console.log('groups', groups)
        // res.push({
        //   target: groups,
        //   animation: defaultAnimationMap[key][type],
        //   duration: 500,
        //   delay: 100
        // })
        res = [...res, ...opts];
      });
      return res
    }

    /**
     * @desc 获取动画的配置参数
     * @param {object} containers 容器
     * @param {Array} animation 动画类型
     */
    _getAnimationGroups(containers, animation, easing) {
      const groups = this._getGroupsByPos(containers);
      const res = [];
      groups.forEach((group, index) => {
        res.push({
          target: group,
          animation: animation,
          easing,
          duration: easing === 'linear' ? 600 : 900,
          delay: 100 * index
        });
      });
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
        const topA = this._getTop(containerA);
        const topB = this._getTop(containerB);
        return topA - topB
      });
      let currentPos = null;
      const res = [];
      let group = [];
      containers.forEach((container, index) => {
        const start = this._getTop(container);
        const ratio = container.style.scale[0];
        const height = container.style.height * ratio;
        if (!currentPos) {
          currentPos = {
            start,
            height
          };
        }
        if (
          start >= currentPos.start &&
          start <= currentPos.start + currentPos.height
        ) {
          group.push(container);
        } else {
          res.push(group);
          group = [container];
          currentPos = {
            start,
            height
          };
        }
        if (index === containers.length - 1) {
          res.push(group);
        }
      });
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
      const layers = scene.layers;
      if (!util.confirmArr(layers)) {
        return []
      }
      let containers = [];
      layers.forEach(layer => {
        containers = [...containers, ...layer.getContainers()];
      });
      return containers
    }

    /**
     * @desc 划分containers到对应的区域
     * @param {Array} containers 容器数组
     */
    _setArea(containers) {
      const area = {};
      if (!util.confirmArr(containers)) {
        return area
      }
      containers.forEach(container => {
        const position = this._getArea(container, this.parent.root);
        if (!util.isType(area[position], 'Array')) {
          area[position] = [container];
        } else {
          area[position].push(container);
        }
      });
      return area
    }

    /**
     * @desc 判断当前container所处区域
     */
    _getArea(container, root) {
      const width = root.clientWidth;
      const layer = container.parent;
      const positionLeft =
        layer.pos.x + container.style.translate[0] + container.style.left;
      const positionRight =
        layer.pos.x +
        container.style.translate[0] +
        container.style.left +
        container.style.width;
      let res = '';
      if (positionLeft <= width / 3) {
        res = 'left';
      } else if (positionRight >= width * (2 / 3)) {
        res = 'right';
      } else {
        res = 'mid';
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
      let ticks = [];
      ticks = util.isType(opts.animation, 'String')
        ? this._dealCustomAnimation(opts)
        : this._dealDefaultAnimation(opts);
      this.animationSequence.addTicks(ticks, callback);
      this._startLoop();
      return this
    }

    /**
     * @desc 注册自定义动画
     * @param {object} opts 注册动画需要的参数
     */
    registAnimation(opts) {
      this.customAnimations.set(opts.name, opts);
    }
    /**
     * 移除自定义动画
     * @param {string} name 动画名称
     */
    removeAnimation(name) {
      this.customAnimations.has(name) && this.customAnimations.delete(name);
    }

    /**
     * @desc 处理自定义动画ticks
     * @param {object} opts 自定义动画的参数
     */
    _dealCustomAnimation(opts) {
      const customAnimation = this.customAnimations.get(opts.animation);
      const { before, tick, after } = customAnimation;
      return this._getTicks({ ...opts, animation: tick, before, callback: after })
    }

    /**
     * @desc 处理默认动画ticks
     * @param {*} opts 默认动画参数
     */
    _dealDefaultAnimation(opts) {
      let ticks = [];
      if (util.isType(opts, 'Array')) {
        opts.forEach(opt => {
          ticks = [...ticks, ...this._getTicks(opt)];
        });
      } else {
        ticks = this._getTicks(opts);
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
      const { target } = opts;
      let ticks = [];
      if (util.confirmArr(target)) {
        target.forEach(ct => {
          if (ct.constructor.name !== 'Container') {
            return
          }
          ticks = [...ticks, ...Animator.factory({ ...opts, target: ct }).start()];
        });
      } else {
        if (target.constructor.name !== 'Container') {
          return ticks
        }
        ticks = Animator.factory({ ...opts }).start();
      }
      return ticks
    }

    /**
     * @desc 每一帧执行的内容
     */
    _flush() {
      return () => {
        const ticks = this.animationSequence.getCurrentTicks();
        ticks.forEach((tick, i) => {
          !tick() && ticks.splice(i, 1);
        });

        // 每组动画执行完毕的动画列表
        const cbs = this.animationSequence.callbacks;
        if (ticks.length < 1 && cbs.length) {
          typeof cbs[0] === 'function' && cbs[0]();
          cbs.shift();
        }

        if (this.animationSequence.isFinish()) {
          this.pause();
          return false
        }
        return true
      }
    }

    /**
     * @desc 开始动画循环渲染
     */
    _startLoop() {
      queue.addTask(this._flush(), 'flush');
    }

    /**
     * @desc 停止渲染
     */
    pause() {
      this._isRunning = false;
    }

    /**
     * @desc 销毁
     */
    destroy() {
      this.parent = null;
      this._isRunning = null;
      this.animationSequence = null;
    }
  }

  /**
   * @desc 封装移入移出动画
   */
  class SceneTransition {
    constructor() {
      this.layout = null;
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
      const { x, y, left, top } = container.opts;

      const width = container.style.width;
      const height = container.style.height;

      const canvasWidth = container.root.offsetWidth;
      const canvasHeight = container.root.offsetHeight;

      const scale = container.style.scale[0];

      const animateList = {
        fromTop: [0, (height + top + y) * scale],
        fromLeft: [(width + left + x) * scale, 0],
        fromRight: [-canvasWidth + (left + x) * scale, 0],
        fromBottom: [0, -(canvasHeight - top - y) * scale],

        toTop: [0, -(height + top + y) * scale],
        toLeft: [-(width + left + x) * scale, 0],
        toRight: [canvasWidth - (left + x) * scale, 0],
        toBottom: [0, (canvasHeight - top - y) * scale]
      };

      return animateList[type]
    }

    /**
     * @desc 解析opts的animation，实现动画效果自由组合
     * @param {object} opts 参数
     * @param {number} index 同一target里container的延迟倍数
     */
    _animator(opts, index) {
      const { target, animation, duration, delay, easing } = opts;
      const container = target;
      let animations = [];
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
      };

      this.layout = container.parent.parent;

      if (util.isType(animation, 'Array')) {
        animations = animation.map((type, n) => {
          return {
            target: container,
            animation: map[type],
            duration: util.isType(duration, 'Array') ? duration[n] : duration,
            delay: delay,
            easing
          }
        });
      } else {
        animations = [
          {
            target: container,
            animation: map[animation],
            duration: duration,
            delay: delay,
            easing
          }
        ];
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
      const containerList = this._loop(opts, this._getTarget.bind(this));
      this.layout.animation.run(containerList, callback);
    }

    /**
     * @desc 获取目标容器
     * @param {object} opts
     */
    _getTarget(opts) {
      const { target, animation, duration, delay, easing } = opts;
      let optsArray = [];
      if (util.isType(target, 'Array')) {
        optsArray = target
          .map((container, index) => {
            return this._animator(
              { target: container, animation, duration, delay, easing },
              index + 1
            )
          })
          .flat();
      } else {
        optsArray = [...this._animator(opts)];
      }
      return optsArray
    }

    /**
     * @desc opts是数组循环执行
     * @param {array|object} opts
     * @param {function} fn
     */
    _loop(opts, fn) {
      let containerList = [];
      if (util.isType(opts, 'Array')) {
        containerList = opts
          .map(opt => {
            return fn(opt)
          })
          .flat();
      } else {
        containerList = fn(opts);
      }
      return containerList
    }
  }

  function layoutMixin() {
    throw new Error('layoutMixin cannot be created')
  }
  /**
   * @lends Layout.prototype
   */
  layoutMixin.prototype = {
    /**
     * @desc 对元素按照传入的位置和放缩比例进行布局设置
     * @param {Layer|Container} el 需要进行布局的元素
     * @param {Object} opts {top, left, width, height}
     */
    doLayout(el, opts) {
      if (el.style) {
        el.style.transformOrigin = ['top', 'left'];
      }

      const coord = this._computeNewCoord(el, {
        top: opts.top,
        left: opts.left,
        width: opts.width,
        height: opts.height
      });
      return this._doLayout(el, coord.top, coord.left, coord.ratio)
    },

    /**
     * @desc 对元素按照计算后的位置和放缩比例进行布局设置
     * @param {Layer|Container} el 需要进行布局的元素
     * @param {number} top 计算后的元素相对于root节点的top
     * @param {number} left 计算后的元素相对于root节点的left
     * @param {number} ratio 元素的放缩比例
     */
    _doLayout(el, top, left, ratio) {
      if (el.style) {
        el.style.translate = [left, top];
        el.style.scale = ratio;
      }

      return {
        translate: [left, top],
        scale: ratio
      }
    },

    _computeNewCoord(
      el,
      { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
    ) {
      // TODO: constraints
      const index = el.constraints || 1;

      // 获取调整到新布局后的元素放缩比例
      // TODO: scaleConstraints
      const ratio = this._getElRatio(
        el.scaleConstraints || 0,
        { width: el.root.clientWidth, height: el.root.clientHeight }, //newSize
        { width: canvasSizeX, height: canvasSizeY } //oldSize
      );

      // 获取新老布局上9点参照物位置
      const [oldTargetCoord, newTargetCoord] = this._getCoord(
        el.root.clientWidth,
        el.root.clientHeight,
        canvasSizeX,
        canvasSizeY
      );

      // 计算top left的差值
      const topDiff = (oldTargetCoord[index - 1][1] - oldTop) * ratio;
      const leftDiff = (oldTargetCoord[index - 1][0] - oldLeft) * ratio;

      // 按照差值计算新的top和left
      const top = newTargetCoord[index - 1][1] - topDiff;
      const left = newTargetCoord[index - 1][0] - leftDiff;

      return { left, top, ratio }
    },

    /**
     * @desc 按照新老画布尺寸和元素的constraints参照物目标计算新的放缩比例
     * @param {number} scaleConstraints 放缩比受影响方向 0横向，1纵向，2双向
     * @param {object} newSize 具有w,h属性的新画布尺寸
     * @param {*} oldSize 具有w,h属性的老画布尺寸
     */
    _getElRatio(scaleConstraints, newSize, oldSize) {
      let ratio = 1;

      scaleConstraints === 0 && (ratio = newSize.width / oldSize.width);
      scaleConstraints === 1 && (ratio = newSize.height / oldSize.height);

      return ratio
    },

    /**
     * @desc 获取新老布局的9点参照物位置
     * @param {number} nw 新布局下的画布宽
     * @param {number} nh 新布局下的画布高
     * @param {number} w 老布局画布的宽
     * @param {number} h 老布局画布高
     */
    _getCoord(nw, nh, w, h) {
      return [this._computeCoord(w, h), this._computeCoord(nw, nh)]
    },

    /**
     * @desc 根据画布尺寸计算老的9点参照点位置
     * @param {object} canvasSize 画布尺寸
     */
    _computeCoord(w, h) {
      return [
        [0, 0],
        [w / 2, 0],
        [w, 0],
        [0, h / 2],
        [w / 2, h / 2],
        [w, h / 2],
        [0, h],
        [w / 2, h],
        [w, h]
      ]
    },

    computeNewCoord(
      el,
      { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
    ) {
      return this._computeNewCoord(el, {
        top: oldTop,
        left: oldLeft,
        width: canvasSizeX,
        height: canvasSizeY
      })
    }
  };

  /**
   * 管理导入导出
   */
  let configs = null;
  function reset() {
    configs = {
      component: [],
      img: {},
      fonts: {}
    };
  }

  class ExportJson {
    /**
     * @desc 导出场景
     * @returns JSON字符串
     */
    toJson() {
      reset();

      // console.log(
      //   Object.assign({ config: configs }, { def: this._layoutToJson() })
      // )

      return JSON.stringify(
        Object.assign({ config: configs }, { def: this._layoutToJson() })
      )
    }

    /**
     * @desc layout序列化
     * @returns {}
     */
    _layoutToJson() {
      return {
        option: {
          opts: this.opts
        },
        type: 'layout',
        children: this._layersToJson(this.getLayers())
      }
    }

    /**
     * @desc layers序列化
     * @param {Element} _layers layers实例
     * @returns []
     */
    _layersToJson(_layers) {
      if (_layers && util.isType(_layers, 'Array') && _layers.length) {
        return _layers.map(_layer => {
          const obj = {
            ..._layer.opts,
            id: _layer.id,
            sceneId: _layer.sceneId
          };

          return {
            option: {
              isShow: _layer.isShow,
              opts: obj,
              pos: _layer.pos
            },
            type: 'layer',
            children: this._containersToJson(_layer.clazzMap)
          }
        })
      }
      return false
    }

    /**
     * @desc conatiners序列化
     * @param {*} data containers实例
     * @returns []
     */
    _containersToJson(data) {
      const _containers = Array.from(data);

      return _containers.map(item => {
        if (item[1].adapter) {
          this._configToJson(item[1].adapter);
        }
        const { id, order, top, left } = item[1].opts;
        return {
          option: {
            isShow: item[1].isShow,
            opts: { id: id || item[1].id, order, top, left },
            style: item[1].opts.style,
            adapter: item[1].opts.adapter
          },
          type: 'container'
        }
      })
    }

    /**
     * @desc config序列化
     * @param {Element} data adapter实例
     */
    _configToJson(data) {
      configs.component.push(data.name.substr(1));
      configs.component = [...new Set(configs.component)];

      if (data.componentInstance.img) {
        configs.img = { ...data.componentInstance.img, ...configs.img };
      }
      if (data.componentInstance.fonts) {
        configs.fonts = data.componentInstance.fonts;
      }
    }
  }

  /**
   * ParseCore 解析场景核心类
   */
  class ParseCore {
    constructor() {
      this.baseFolderName = null;
    }
    /**
     * @desc 渲染UI
     * @param {Object} data UI参数
     * @param {Element} parent layout实例
     * @param {Function} transform 场景json转换器
     */
    renderUI(data, parent, transform) {
      data.children &&
        data.children.forEach(item => {
          this.renderLayer(transform.layer(item), item, parent, transform);
        });
    }

    /**
     * 渲染layer
     * @param {Object} template layer参数
     * @param {Object} template layer参数
     * @param {Element} parent layout实例
     * @param {Function} transform 场景json转换器
     */
    renderLayer(opts, item, parent, transform) {
      const layer = parent.createLayer(opts);

      transform.hasChildren(item.children).forEach(child => {
        this.renderContainer(transform.container(child), layer);
      });

      return layer
    }

    /**
     * 渲染container
     * @param {Array} opts containers参数
     * @param {Element} parent layer实例
     */
    renderContainer(opts, parent) {
      parent.createContainer(opts);
    }

    /**
     * @desc 引入base包
     * @param {String} link 文件名称
     */
    importBase(link) {
      return new Promise((resolve, reject) => {
        if (util.isType(link, 'String') && link !== this.baseFolderName) {
          this.baseFolderName = link;
          const script = this.pullIn('base', link);
          script.onload = () => {
            resolve(1);
          };
        } else {
          reject(0);
        }
      })
    }

    /**
     * @desc 按需循环引入Conch组件
     * @param {object} config 文件名称
     */
    importComponent(config) {
      const list = [];
      config &&
        config.component &&
        config.component.map(component => {
          list.push(
            new Promise(resolve => {
              const script = this.pullIn('component', component);
              script.onload = () => {
                resolve(1);
              };
            })
          );
        });
      return Promise.all(list)
    }

    /**
     * @desc script引入
     * @param {string} folder 文件夹
     * @param {string} link 文件名
     */
    pullIn(folder, link) {
      const script = document.createElement('script');
      script.setAttribute('src', `${this.basePath}/web/${folder}/${link}.js`);
      document.head.appendChild(script);
      return script
    }
  }

  /**
   * @desc 解析Spray-ps资源
   */
  class Parse {
    constructor(parent) {
      this.sceneManager = parent;
      this.parent = parent.parent;
    }
    /**
     * @desc 场景解析
     * @param {Object} opts 场景解析参数
     * -basePath: 场景解析包路径
     * -scenes: 场景id集合
     */
    async init({ basePath, scenes }) {
      this.basePath = basePath;
      // 加载base文件
      await this.importBase('base');

      // 拉取解析资源
      if (util.isType(scenes, 'Array')) {
        await Promise.all(
          scenes.map(async scene => {
            await this.fetchJson(scene);
          })
        );
      } else {
        await this.fetchJson(scenes);
      }

      const ids = this.parent.scenes.getScenesGroup();
      // 等待所有场景加载完之后再显示第一个场景。保证永远显示且仅显示scenes队列的第一个场景
      // 避免由于场景定义文件加载的时间不同，导致展示的场景不一致问题
      this.sceneManager.hideOtherScenes(ids[0]);
    }

    /**
     * @desc 拉取解析资源
     * @param {Object} scene 场景
     */
    fetchJson(scene) {
      return new Promise(resolve => {
        const path = `${this.basePath}/web/scene-data/${scene}.json`;
        fetch(path).then(res => {
          res.json().then(async data => {
            const config = util.isType(data.config, 'Object')
              ? data.config
              : JSON.parse(data.config);

            try {
              data = util.isType(data.def, 'Object')
                ? data.def
                : JSON.parse(data.def);
            } catch (error) {
              throw new Error(`parse json ${error}`)
            }

            await this.importComponent(config);

            this.renderUI(data, this.parent, this.transform(scene, this.basePath));
            resolve();
          });
        });
      })
    }

    /**
     * @desc 场景json转化器
     * @param {String} id 场景id
     * @param {String} path json文件路径
     * @returns functions
     */
    transform(id, path) {
      return {
        layer(opt) {
          return {
            id: opt.option.id || opt.option.opts.id,
            order: opt.option.order || opt.option.opts.order,
            sceneId:
              Reflect.has(opt.option, 'opts') &&
              Reflect.has(opt.option.opts, 'sceneId')
                ? opt.option.opts.sceneId
                : id
          }
        },
        hasChildren(opt) {
          if (!util.confirmArr(opt)) {
            return []
          } else if (opt[0].children) {
            return opt[0].children
          } else {
            return opt
          }
        },
        container(opt) {
          const options = {};
          if (opt.type !== 'Group') {
            options.id = opt.option.id || opt.option.opts.id;
            options.order = Reflect.has(opt.option, 'order')
              ? opt.option.order
              : opt.option.opts.order;
            options.style = opt.option.style;
            options.width = Reflect.has(opt.option, 'width')
              ? opt.option.width
              : opt.option.style.width;
            options.height = Reflect.has(opt.option, 'height')
              ? opt.option.height
              : opt.option.style.height;
            // options.style.backgroundImage =
            //   options.style.backgroundImage &&
            //   options.style.backgroundImage.replace(/\/s-static/g, path + '/web')
            options.top = Reflect.has(opt.option, 'top')
              ? opt.option.top
              : opt.option.opts.top;
            options.left = Reflect.has(opt.option, 'left')
              ? opt.option.left
              : opt.option.opts.left;

            if (options.style) {
              options.style.visibility =
                options.style.display === 'none' ? 'hidden' : '';
              options.style.backgroundImage =
                options.style.backgroundImage &&
                options.style.backgroundImage.replace(
                  /\/s-static/g,
                  path + '/web'
                );
            }

            const adapter = (options.adapter = opt.option.adapter);
            if (adapter) {
              adapter.option.prefix = adapter.option.prefix.replace(
                /\/s-static/g,
                path + '/web'
              );
            }
            return options
          } else {
            return {}
          }
        }
      }
    }

    static factory(parent) {
      return new Parse(parent)
    }
  }

  util.applyMixins(Parse, ParseCore);

  const DEFAULTID = 'defaultSceneId';
  /**
   * Scene 场景管理类
   */
  class Scene {
    constructor() {
      this.sceneObj = new Map();
    }
    /**
     * @desc 添加场景分组
     * @param {String} sceneId 场景ID
     * @param {Element} layer layer实例
     */
    _set(sceneId, layer) {
      this._unique(layer);

      const currentSceneId = this.sceneObj.get(sceneId);
      currentSceneId
        ? currentSceneId.layers.push(layer)
        : this.sceneObj.set(sceneId, {
            layers: [layer],
            status: 'hide'
          });
    }

    /**
     * @desc 默认场景分组去重
     * @param {Element} layer layer实例
     */
    _unique(layer) {
      if (this.sceneObj.has(DEFAULTID)) {
        const filterScene = this.sceneObj
          .get(DEFAULTID)
          .layers.filter(i => i !== layer);
        this.sceneObj.set(DEFAULTID, {
          layers: filterScene,
          status: 'show'
        });
      }
    }

    /**
     * @desc 根据ID删除场景
     * @param {String} id 场景ID
     */
    _deleteById(id) {
      if (this.sceneObj.has(id)) {
        this.sceneObj.delete(id);
      }
      return false
    }

    /**
     * @desc 根据ID获取场景
     * @param {String} id 场景ID
     * @returns 拥有相同场景ID的对象
     */
    _getById(id) {
      return this.sceneObj.get(id)
    }

    /**
     * @desc 获取场景集合
     * @returns [] 场景ID数组
     */
    _getScenesGroup() {
      return Array.from(this.sceneObj.keys())
    }

    /**
     * @desc 获取当前场景
     * @returns {} 当前场景ID，及其所属layers
     */
    _getVisible() {
      const res = {};
      Array.from(this.sceneObj).forEach(([id, item]) => {
        item.status === 'show' && (res[id] = item);
      });
      return res
    }
  }

  class SceneManager {
    constructor(parent) {
      this.parent = parent;
      this.defaultSceneId = DEFAULTID;

      this.parse = Parse.factory(this);

      this._scenes = new Scene();
    }

    static factory(parent) {
      return new SceneManager(parent)
    }

    /**
     * @desc 场景解析
     * @param {Object} opts 场景解析参数
     */
    parseScenes(opts) {
      return this.parse.init(opts)
    }

    /**
     * @desc 划分场景
     * @param {Element} layer layer实例
     * @param {String} sceneId 场景ID
     */
    divideScene(layer, sceneId) {
      if (util.isType(sceneId, 'String')) {
        layer.sceneId = sceneId;
        this._scenes._set(layer.sceneId, layer);
      }
    }

    /**
     * 根据场景ID删除
     * @param {String} id 场景ID
     */
    deleteSceneById(id) {
      if (util.isType(id, 'String')) {
        this._scenes._deleteById(id);
      }
    }

    /**
     * @desc 根据场景ID查询
     * @param {String} id 场景ID
     * @returns 拥有相同场景ID的对象
     */
    getSceneById(id) {
      if (util.isType(id, 'String')) {
        return this._scenes._getById(id)
      }
      return false
    }

    /**
     * @desc 显示一个场景，隐藏其余场景
     * @param {String} 需要显示的场景id
     * 说明：如果有主场景，显示主场景；如果有id，根据id显示次场景；否则，显示场景队列的第一个场景
     */
    hideOtherScenes(id) {
      let targetId;
      if (this._scenes.sceneObj.has(DEFAULTID)) {
        targetId = DEFAULTID;
      } else if (id && util.isType(id, 'String')) {
        targetId = id;
      } else {
        const iterator = this._scenes.sceneObj.keys();
        targetId = iterator.next().value;
      }
      const scene = this.getSceneById(targetId);
      this._hideOtherScene(scene);
    }

    /**
     * @desc 显示传入场景，隐藏其余场景
     * @param {Object} scene 场景
     */
    _hideOtherScene(scene) {
      this._scenes.sceneObj.forEach(s => {
        s.status = 'hide';
        s.layers.forEach(layer => layer.hide());
      });
      this.setSceneStatus(scene, 'show');
    }

    /**
     * @desc 根据ID隐藏场景
     */
    hideSceneById(id) {
      const scene = this.getSceneById(id);
      this.setSceneStatus(scene, 'hide');
    }

    /**
     * @desc 根据ID显示场景
     */
    showSceneById(id) {
      const scene = this.getSceneById(id);
      this.setSceneStatus(scene, 'show');
    }

    /**
     * @desc 设置场景状态
     * @param {Object} scene 场景
     * @param {String} status 场景状态
     */
    setSceneStatus(scene, status) {
      if (!status && status !== 'show' && status !== 'hide') {
        console.warn('参数错误：请设置场景状态为show或者hide');
        return false
      }
      scene.status = status;
      scene.layers.forEach(layer => layer[status]());
      return true
    }

    /**
     * @desc 获取场景集合
     * @returns [] 场景集合
     */
    getScenesGroup() {
      return this._scenes._getScenesGroup()
    }

    /**
     * @desc 获取当前场景
     * @returns {} 当前场景ID，及其所属layers
     */
    getVisibleScene() {
      return this._scenes._getVisible()
    }
  }

  /**
   * UI 主类
   * @class Layout
   */
  class Layout extends Displayable {
    constructor(root, opts) {
      store.UI.setRoot(root);
      opts && opts.isDrag && store.UI.setDrag(opts.isDrag);
      super({}, opts);
      if (!opts.pointerEvents) {
        root.style.pointerEvents = 'none';
      }
      // 默认渲染区域宽高
      this.canvasWidth = root.clientWidth;
      this.canvasHeight = root.clientHeight;
      this.defaultOpts = {
        threeFirst: true,
        layerOpts: null
      };
      this.opts = util.deepMixinOpts(
        {},
        {
          ...this.defaultOpts,
          canvasWidth: this.canvasWidth,
          canvasHeight: this.canvasHeight,
          ...opts
        }
      );

      // rFA是否开始
      this._isRunning = false;

      this.handleResize = this._handleResize.bind(this);

      this.sceneTransition = SceneTransition.factory();

      this.scenes = SceneManager.factory(this);

      this.animation = new AnimationManager(this);

      this._onEvent('resize', this.handleResize);
    }

    static factory(root, opts) {
      return new Layout(root, opts)
    }

    apply(frame) {
      if (!frame) {
        return
      }
      this.opts.threeFirst
        ? frame.afterLoad.inject(() => this.init(this.opts))
        : this.init(this.opts);
      frame.beforeDestroy.inject(this.destroy.bind(this));
    }

    /**
     * @desc 初始化布局
     * @param {object} opts 布局所需配置项
     */
    init(opts) {
      return util.confirmArr(opts.layerOpts)
        ? opts.layerOpts.map(opt => this.createLayer(opt))
        : []
    }

    /**
     * @desc 新增图层
     * @param {object}opts 新增图层所需的配置
     */
    createLayer(opts = { x: 0, y: 0 }) {
      const layer = register.newFromRegistedClazz('Layer', this, opts);
      this.scenes.divideScene(layer, opts.sceneId || this.scenes.defaultSceneId);

      this._setMap(layer.id, layer);

      return layer
    }

    /**
     * @desc 销毁图层
     * @param {Array|Object|String} option 需要销毁的图层，支持图层对象、图层对象数组、图层id、图层id数组
     */
    removeLayer(option) {
      if (util.isType(option, 'Array')) {
        return option.every(opt => {
          return this._removeLayer(opt)
        })
      } else {
        return this._removeLayer(option)
      }
    }

    /**
     * @desc 销毁单个图层
     * @param {Object|String} opt 图层对象或图层id
     */
    _removeLayer(opt) {
      const _layer = util.isType(opt, 'Object') ? opt : this.getLayer(opt);
      let _r = false;

      if (_layer) {
        // 将图层从map集中删除
        _r = this._deleteMap(_layer.id);
        // 销毁图层
        _layer.destroy();
      }

      return _r
    }

    /**
     * @desc 判断是否存在图层
     * @param {string} id 需要判断是否存在的图层的id
     */
    hasLayer(id) {
      return this._hasMap(id)
    }

    /**
     * @desc 通过id获取对应的图层
     * @param {string} id 图层id
     */
    getLayer(id) {
      return this._getMapById(id)
    }

    /**
     * @desc 获取当前所有图层对象
     */
    getLayers() {
      return this._getMapValues()
    }

    /**
     * @desc 获取当前所有图层对象的id
     */
    getLayerIds() {
      return this._getMapKeys()
    }

    /**
     * @desc 操作图层的配置
     * @param {object} layer 图层对象
     * @param {object} opts 图层配置
     */
    setLayer(layer, opts) {
      if (!layer) {
        return false
      }
      if (Array.isArray(layer)) {
        this.setLayers(layer, opts);
        return true
      }
      layer.setOption(opts);
      return true
    }

    /**
     * @desc 给多个图层进行配置
     * @param {Array} layers 图层数组
     * @param {object} opts 图层的配置项
     * @returns 返回修改后的图层对象
     */
    setLayers(layers, opts) {
      if (!util.confirmArr(layers)) {
        return false
      }
      layers.forEach(layer => {
        this.setLayer(layer, opts);
      });
      return layers
    }

    /**
     * @desc 配置布局
     * @param {object} opts 布局所需配置
     */
    setOption(opts) {
      this.opts = { ...opts };
      this.canvasWidth = this.opts.canvasWidth;
      this.canvasHeight = this.opts.canvasHeight;
      this.init(opts);
    }

    /**
     * @desc 缩放布局
     * @param {object} el 需要布局的对象
     */
    setLayout(el, pos) {
      return this.doLayout(el, {
        top: pos.top,
        left: pos.left,
        width: this.opts.canvasWidth,
        height: this.opts.canvasHeight
      })
    }

    setNewCoord(
      el,
      { top: oldTop, left: oldLeft, width: canvasSizeX, height: canvasSizeY }
    ) {
      return this.computeNewCoord(el, {
        top: oldTop,
        left: oldLeft,
        width: canvasSizeX,
        height: canvasSizeY
      })
    }

    /**
     * @desc 绑定事件
     * @param {string} eventName 事件名称
     * @param {function} callback 事件的回调函数
     */
    _onEvent(eventName, callback) {
      window.addEventListener(eventName, callback);
    }

    /**
     * @desc 解绑事件
     * @param {*} eventName 事件名称
     * @param {*} callback 回调函数
     */
    _offEvent(eventName, callback) {
      window.removeEventListener(eventName, callback);
    }

    /**
     * @desc 窗口缩放事件
     */
    _handleResize() {
      this.emit('windowResize');
    }

    /**
     * @desc 销毁布局实例
     */
    destroy() {
      this.removeLayer(this.getLayers());
      this._offEvent('resize', this.handleResize);
      this.canvasWidth = null;
      this.canvasHeight = null;
      this.defaultOpts = null;
      this.opts = null;
      this.handleResize = null;
      this.animation.destroy();
      super.destroy();
    }
  }

  util.applyMixins(Layout, [layoutMixin, ExportJson]);

  // 注册 layout layer container 类
  register.registClazz('Layout', Layout);
  register.registClazz('Layer', Layer);
  register.registClazz('Container', Container);
  // 将 conchAdapter 注册到 adapterManager 中
  adapter.regist('ConchAdapter', ConchAdapter);

  Layout.adapter = Layout.prototype.adapter = adapter;
  Layout.BaseAdapter = BaseAdapter;
  if (THING) {
    THING.UI = Layout;
  }

  return Layout;

})));
//# sourceMappingURL=UI-dev.js.map
