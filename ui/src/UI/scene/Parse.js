import util from '../../common/util'
import ParseCore from './ParseCore'

/**
 * @desc 解析Spray-ps资源
 */
class Parse {
  constructor(parent) {
    this.sceneManager = parent
    this.parent = parent.parent
  }
  /**
   * @desc 场景解析
   * @param {Object} opts 场景解析参数
   * -basePath: 场景解析包路径
   * -scenes: 场景id集合
   */
  async init({ basePath, scenes }) {
    this.basePath = basePath
    // 加载base文件
    await this.importBase('base')

    // 拉取解析资源
    if (util.isType(scenes, 'Array')) {
      await Promise.all(
        scenes.map(async scene => {
          await this.fetchJson(scene)
        })
      )
    } else {
      await this.fetchJson(scenes)
    }

    const ids = this.parent.scenes.getScenesGroup()
    // 等待所有场景加载完之后再显示第一个场景。保证永远显示且仅显示scenes队列的第一个场景
    // 避免由于场景定义文件加载的时间不同，导致展示的场景不一致问题
    this.sceneManager.hideOtherScenes(ids[0])
  }

  /**
   * @desc 拉取解析资源
   * @param {Object} scene 场景
   */
  fetchJson(scene) {
    return new Promise(resolve => {
      const path = `${this.basePath}/web/scene-data/${scene}.json`
      fetch(path).then(res => {
        res.json().then(async data => {
          const config = util.isType(data.config, 'Object')
            ? data.config
            : JSON.parse(data.config)

          try {
            data = util.isType(data.def, 'Object')
              ? data.def
              : JSON.parse(data.def)
          } catch (error) {
            throw new Error(`parse json ${error}`)
          }

          await this.importComponent(config)

          this.renderUI(data, this.parent, this.transform(scene, this.basePath))
          resolve()
        })
      })
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
        const options = {}
        if (opt.type !== 'Group') {
          options.id = opt.option.id || opt.option.opts.id
          options.order = Reflect.has(opt.option, 'order')
            ? opt.option.order
            : opt.option.opts.order
          options.style = opt.option.style
          options.width = Reflect.has(opt.option, 'width')
            ? opt.option.width
            : opt.option.style.width
          options.height = Reflect.has(opt.option, 'height')
            ? opt.option.height
            : opt.option.style.height
          // options.style.backgroundImage =
          //   options.style.backgroundImage &&
          //   options.style.backgroundImage.replace(/\/s-static/g, path + '/web')
          options.top = Reflect.has(opt.option, 'top')
            ? opt.option.top
            : opt.option.opts.top
          options.left = Reflect.has(opt.option, 'left')
            ? opt.option.left
            : opt.option.opts.left

          if (options.style) {
            options.style.visibility =
              options.style.display === 'none' ? 'hidden' : ''
            options.style.backgroundImage =
              options.style.backgroundImage &&
              options.style.backgroundImage.replace(
                /\/s-static/g,
                path + '/web'
              )
          }

          const adapter = (options.adapter = opt.option.adapter)
          if (adapter) {
            adapter.option.prefix = adapter.option.prefix.replace(
              /\/s-static/g,
              path + '/web'
            )
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

util.applyMixins(Parse, ParseCore)

export default Parse
