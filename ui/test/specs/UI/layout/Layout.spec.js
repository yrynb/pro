import Container from '@/UI/container/Container'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'
import util from '@/common/util'
register.registClazz('Layout', Layout)
register.registClazz('Layer', Layer)
register.registClazz('Container', Container)

class Frame {
  constructor() {
    this.afterLoad = {
      inject: this.inject
    }
    this.beforeDestroy = {
      inject: this.inject
    }
  }
  inject(callback) {
    callback()
  }
}
const frame = new Frame()
describe('test Layout.js', () => {
  const root = document.createElement('div')
  let layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
  let callback = () => {}
  it('check Layout factory', () => {
    expect(
      Layout.factory(root, {
        canvasWidth: 100,
        canvasHeight: 100
      })
    ).toBeInstanceOf(Layout)
  })

  it('check Layout apply', () => {
    expect(layout.apply()).toBeFalsy()
    const spyOn = jest.spyOn(frame.afterLoad, 'inject')
    const spyInit = jest.spyOn(layout, 'init')
    layout.apply(frame)
    expect(spyOn).toHaveBeenCalled()
    expect(spyInit).toHaveBeenCalled()

    layout.setOption({ threeFirst: false })
    layout.apply(frame)
    expect(spyInit).toHaveBeenCalled()
  })

  it('check Layout init', () => {
    expect(layout.init({})).toStrictEqual([])
    expect(layout.init({ layerOpts: [{ x: 0, y: 0 }] })[0]).toBeInstanceOf(
      Layer
    )
  })

  it('check Layout createLayer', () => {
    const spyOn = jest.spyOn(layout, '_setMap')
    expect(layout.createLayer()).toBeInstanceOf(Layer)
    expect(spyOn).toHaveBeenCalled()
  })

  it('check Layout removeLayer', () => {
    const _layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const ly = _layout.createLayer({ id: 'ly' })

    const spyFn = jest.spyOn(_layout, '_removeLayer')
    _layout.removeLayer('ly')
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('check Layout removeLayer array', () => {
    const _layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const ly1 = _layout.createLayer({ id: 'ly1' })
    const ly2 = _layout.createLayer({ id: 'ly2' })

    const spyFn = jest.spyOn(_layout, '_removeLayer')
    _layout.removeLayer([ly1, ly2])
    expect(spyFn).toHaveBeenCalledTimes(2)
  })

  it('check Layout _removeLayer', () => {
    const _layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    expect(_layout.removeLayer('ly')).toBeFalsy()
  })

  it('check Layout hasLayer', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer = layout.createLayer({})
    const id = layer.id
    expect(layout.hasLayer(id)).toBe(true)
  })

  it('check Layout getLayer', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer = layout.createLayer({})
    const id = layer.id
    expect(layout.getLayer(id)).toStrictEqual(layer)
  })

  it('check Layout getLayers', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const arr = [1, 2, 3]
    const layers = arr.map(() => layout.createLayer({}))
    expect(layout.getLayers()).toStrictEqual(layers)
  })

  it('check Layout getLayerIds', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const arr = [1, 2, 3]
    arr.map(id => layout.createLayer({ id }))
    expect(layout.getLayerIds()).toStrictEqual(arr)
  })

  it('check Layout setLayer', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer1 = layout.createLayer({})
    const layer2 = layout.createLayer({})
    expect(layout.setLayer()).toBe(false)

    const spyFn = jest.spyOn(layout, 'setLayers')
    layout.setLayer([layer1, layer2], {})
    expect(spyFn).toHaveBeenCalled()

    const spyFn2 = jest.spyOn(layer1, 'setOption')
    layout.setLayer(layer1, { x: 100 })
    expect(spyFn2).toHaveBeenCalled()
    expect(layer1.pos).toStrictEqual({ x: 100, y: 0 })
  })

  it('check Layout setLayers', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer1 = layout.createLayer({})
    const layer2 = layout.createLayer({})
    const spyFn = jest.spyOn(util, 'confirmArr')
    const spyFn2 = jest.spyOn(layout, 'setLayer')

    layout.setLayers()
    expect(spyFn).toHaveBeenCalled()
    expect(layout.setLayers()).toBe(false)

    layout.setLayers([layer1, layer2], { x: 100 })
    expect(spyFn2).toHaveBeenCalled()
    expect(layer1.pos).toStrictEqual({ x: 100, y: 0 })
    expect(layer2.pos).toStrictEqual({ x: 100, y: 0 })

    expect(layout.setLayers([layer1, layer2], { x: 100 })).toStrictEqual([
      layer1,
      layer2
    ])
  })

  it('check Layout setOption', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const spyFn = jest.spyOn(layout, 'init')
    layout.setOption({ canvasWidth: 100 })
    expect(spyFn).toHaveBeenCalled()
    expect(layout.canvasWidth).toBe(100)
  })

  it('check Layout setLayout', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer = layout.createLayer({})
    const container = layer.createContainer({
      id: 1,
      style: {
        width: 637,
        height: 198,
        top: 200,
        left: 40
      }
    })
    const spyFn = jest.spyOn(layout, 'doLayout')
    layout.setLayout(container, {})
    expect(spyFn).toHaveBeenCalled()
  })

  it('check Layout setNewCoord', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const layer = layout.createLayer({})
    const container = layer.createContainer({
      id: 1,
      style: {
        width: 637,
        height: 198,
        top: 200,
        left: 40
      }
    })
    const spyFn = jest.spyOn(layout, 'computeNewCoord')
    layout.setNewCoord(container, {})
    expect(spyFn).toHaveBeenCalled()
  })

  it('check Layout _onEvent', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const spyFn = jest.spyOn(window, 'addEventListener')
    layout._onEvent('resize', callback)
    expect(spyFn).toHaveBeenCalled()
  })

  it('check Layout _offEvent', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const spyFn = jest.spyOn(window, 'removeEventListener')
    layout._offEvent('resize', callback)
    expect(spyFn).toHaveBeenCalled()
  })

  it('check Layout _handleResize', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const spyFn = jest.spyOn(layout, 'emit')
    layout._handleResize()
    expect(spyFn).toHaveBeenCalled()
  })

  it('check Layout destroy', () => {
    layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
    const spyFn1 = jest.spyOn(layout, 'removeLayer')
    const spyFn2 = jest.spyOn(layout, 'getLayers')
    const spyFn3 = jest.spyOn(layout, '_offEvent')

    layout.destroy()
    expect(spyFn1).toHaveBeenCalled()
    expect(spyFn2).toHaveBeenCalled()
    expect(spyFn3).toHaveBeenCalled()
  })

  // it('check Layout flush', () => {
  //   layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
  //   const spyFn1 = jest.spyOn(layout.animationSequence, 'getCurrentTicks')
  //   const spyFn2 = jest.spyOn(layout.animationSequence, 'isFinish')
  //   const spyFn3 = jest.spyOn(layout, 'pause')

  //   layout.flush()
  //   expect(spyFn1).toHaveBeenCalled()
  //   expect(spyFn2).toHaveBeenCalled()
  //   expect(spyFn3).toHaveBeenCalled()
  // })

  // it('check Layout startLoop', () => {
  //   layout = new Layout(root, { canvasWidth: 100, canvasHeight: 100 })
  //   const spyFn = jest.spyOn(layout, 'flush')

  //   layout.startLoop()
  //   expect(spyFn).toHaveBeenCalled()
  // })
})
