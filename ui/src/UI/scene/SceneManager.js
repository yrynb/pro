import util from '../../common/util'
import Parse from './Parse'

const DEFAULTID = 'defaultSceneId'
/**
 * Scene 场景管理类
 */
class Scene {
  constructor() {
    this.sceneObj = new Map()
  }
  /**
   * @desc 添加场景分组
   * @param {String} sceneId 场景ID
   * @param {Element} layer layer实例
   */
  _set(sceneId, layer) {
    this._unique(layer)

    const currentSceneId = this.sceneObj.get(sceneId)
    currentSceneId
      ? currentSceneId.layers.push(layer)
      : this.sceneObj.set(sceneId, {
          layers: [layer],
          status: 'hide'
        })
  }

  /**
   * @desc 默认场景分组去重
   * @param {Element} layer layer实例
   */
  _unique(layer) {
    if (this.sceneObj.has(DEFAULTID)) {
      const filterScene = this.sceneObj
        .get(DEFAULTID)
        .layers.filter(i => i !== layer)
      this.sceneObj.set(DEFAULTID, {
        layers: filterScene,
        status: 'show'
      })
    }
  }

  /**
   * @desc 根据ID删除场景
   * @param {String} id 场景ID
   */
  _deleteById(id) {
    if (this.sceneObj.has(id)) {
      this.sceneObj.delete(id)
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
    const res = {}
    Array.from(this.sceneObj).forEach(([id, item]) => {
      item.status === 'show' && (res[id] = item)
    })
    return res
  }
}

class SceneManager {
  constructor(parent) {
    this.parent = parent
    this.defaultSceneId = DEFAULTID

    this.parse = Parse.factory(this)

    this._scenes = new Scene()
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
      layer.sceneId = sceneId
      this._scenes._set(layer.sceneId, layer)
    }
  }

  /**
   * 根据场景ID删除
   * @param {String} id 场景ID
   */
  deleteSceneById(id) {
    if (util.isType(id, 'String')) {
      this._scenes._deleteById(id)
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
    let targetId
    if (this._scenes.sceneObj.has(DEFAULTID)) {
      targetId = DEFAULTID
    } else if (id && util.isType(id, 'String')) {
      targetId = id
    } else {
      const iterator = this._scenes.sceneObj.keys()
      targetId = iterator.next().value
    }
    const scene = this.getSceneById(targetId)
    this._hideOtherScene(scene)
  }

  /**
   * @desc 显示传入场景，隐藏其余场景
   * @param {Object} scene 场景
   */
  _hideOtherScene(scene) {
    this._scenes.sceneObj.forEach(s => {
      s.status = 'hide'
      s.layers.forEach(layer => layer.hide())
    })
    this.setSceneStatus(scene, 'show')
  }

  /**
   * @desc 根据ID隐藏场景
   */
  hideSceneById(id) {
    const scene = this.getSceneById(id)
    this.setSceneStatus(scene, 'hide')
  }

  /**
   * @desc 根据ID显示场景
   */
  showSceneById(id) {
    const scene = this.getSceneById(id)
    this.setSceneStatus(scene, 'show')
  }

  /**
   * @desc 设置场景状态
   * @param {Object} scene 场景
   * @param {String} status 场景状态
   */
  setSceneStatus(scene, status) {
    if (!status && status !== 'show' && status !== 'hide') {
      console.warn('参数错误：请设置场景状态为show或者hide')
      return false
    }
    scene.status = status
    scene.layers.forEach(layer => layer[status]())
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

export default SceneManager
