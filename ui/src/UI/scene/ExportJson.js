import util from '../../common/util'
/**
 * 管理导入导出
 */
let configs = null
function reset() {
  configs = {
    component: [],
    img: {},
    fonts: {}
  }
}

class ExportJson {
  /**
   * @desc 导出场景
   * @returns JSON字符串
   */
  toJson() {
    reset()

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
        }

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
    const _containers = Array.from(data)

    return _containers.map(item => {
      if (item[1].adapter) {
        this._configToJson(item[1].adapter)
      }
      const { id, order, top, left } = item[1].opts
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
    configs.component.push(data.name.substr(1))
    configs.component = [...new Set(configs.component)]

    if (data.componentInstance.img) {
      configs.img = { ...data.componentInstance.img, ...configs.img }
    }
    if (data.componentInstance.fonts) {
      configs.fonts = data.componentInstance.fonts
    }
  }
}

export default ExportJson
