import ExportJson from '@/UI/scene/ExportJson'
import Layout from '@/UI/layout/Layout'

describe('test ExportJson.js', () => {
  const instance = new ExportJson()
  const root = document.createElement('div')
  let layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })

  it('has toJson', () => {
    const spyFn = jest.spyOn(layout, '_layoutToJson')
    layout.toJson()
    expect(spyFn).toHaveBeenCalled()
  })

  it('has _layersToJson', () => {
    const _layers = [
      {
        id: '111',
        sceneId: '111',
        opts: {
          id: '111',
          sceneId: '111',
          order: '1'
        },
        pos: [0, 0],
        isShow: true,
        clazzMap: {}
      }
    ]
    expect(layout._layersToJson([])).toBeFalsy()

    expect(typeof layout._layersToJson(_layers)).toBe('object')
  })

  it('has _containersToJson', () => {
    const data = [
      [
        '1234',
        {
          id: '1234',
          isShow: true,
          opts: {
            order: '2',
            top: 0,
            left: 0,
            style: {}
          },
          adapter: null
        }
      ]
    ]
    const adapter = {
      name: 'C1',
      componentInstance: {
        img: {},
        fonts: {}
      }
    }

    expect(typeof layout._containersToJson(data)).toBe('object')
    data[0][1].adapter = adapter
    expect(typeof layout._containersToJson(data)).toBe('object')
  })

  it('has _configToJson', () => {
    const adapter = {
      name: 'C1',
      componentInstance: {}
    }
    const spyFn = jest.spyOn(layout, '_configToJson')
    layout._configToJson(adapter)

    adapter.componentInstance.img = { 1: '1' }
    layout._configToJson(adapter)

    expect(spyFn).toHaveBeenCalled()
  })
})
