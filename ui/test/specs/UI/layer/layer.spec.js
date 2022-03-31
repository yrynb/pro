import Container from '@/UI/container/Container'
import Layer from '@/UI/layer/Layer'
import Layout from '@/UI/layout/Layout'
import register from '@/UI/registe/registe'

register.registClazz('Container', Container)
const layout = new Layout(document.createElement('div'), {})
// class Test {
//   constructor() {
//     this.pos = { x: 0, y: 0 }
//     this.layout = layout
//   }
//   setLayout() {
//     return {
//       scale: 0.75,
//       translate: [30, 150]
//     }
//   }
// }

describe('test Layer.js', () => {
  const instance = new Layer(layout, { id: '111' })
  // instance.root = document.createElement('div')
  let layer

  it('_setLayout', () => {
    layer = new Layer(layout, {})
    layer.createContainer({
      opts: {
        top: 2,
        left: 3
      }
    })
    const spyFn = jest.spyOn(layer, '_setLayout')
    layer._doLayout()
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('show', () => {
    instance.show()
    expect(instance.isShow).toBe(true)
  })

  it('hide', () => {
    instance.hide()
    expect(instance.isShow).toBe(false)
  })

  it('factory', () => {
    instance.isShow = true
    expect(Layer.factory(layout)).toBeInstanceOf(Layer)
    expect(Layer.factory(layout, { id: '111' })).toEqual(instance)
  })

  it('createContainer', () => {
    expect(instance.createContainer()).toBeInstanceOf(Container)
    expect(instance.createContainer({ id: 'ct1' })).toBeInstanceOf(Container)
  })

  it('removeContainer', () => {
    const _layer = new Layer(layout, { id: 'layer-testRemoveCt' })
    const ct = _layer.createContainer({ id: 'ct' })

    const spyFn = jest.spyOn(_layer, '_removeContainer')
    _layer.removeContainer('ct')
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('removeContainer array', () => {
    const _layer = new Layer(layout, { id: 'layer-testRemoveCt' })
    const ct1 = _layer.createContainer({ id: 'ct1' })
    const ct2 = _layer.createContainer({ id: 'ct2' })

    const spyFn = jest.spyOn(_layer, '_removeContainer')
    _layer.removeContainer([ct1, ct2])
    expect(spyFn).toHaveBeenCalledTimes(2)
  })

  it('_removeContainer', () => {
    const _layer = new Layer(layout, { id: 'layer-testRemoveCt' })
    expect(_layer.removeContainer('ct')).toBeFalsy()
  })

  it('hasContainer', () => {
    expect(instance.hasContainer()).toBeFalsy()
  })

  it('getContainer', () => {
    const _layer = new Layer(layout, { id: 'layer-testGetcontainer' })
    const ct1 = _layer.createContainer({ id: 'ct1' })
    expect(instance.getContainer('ct1')).toBeInstanceOf(Container)
  })

  it('getContainers', () => {
    expect(instance.getContainers()).not.toHaveLength(0)
  })

  it('getContainerIds', () => {
    expect(instance.getContainerIds()).not.toHaveLength(0)
  })

  it('setOption', () => {
    expect(() => instance.setOption({ id: '22' })).toThrowError(
      '图层id不能改变'
    )
    expect(instance.setOption()).toBeInstanceOf(Layer)
    expect(instance.setOption({ x: 200, y: 200 })).toBeInstanceOf(Layer)
  })

  it('destroy', () => {
    const spyFn = jest.spyOn(instance, '_offEvent')
    instance.destroy()
    expect(instance.getContainerIds()).toHaveLength(0)
    expect(spyFn).toHaveBeenCalledTimes(1)
  })

  it('test set x,y', () => {
    layer = new Layer(layout, { id: 'layer-testSet' })
    layer.createContainer({ id: 'ct-testSet' })
    layer.x = 100
    layer.y = 100
    expect(layer.pos.x).toBe(100)
    expect(layer.pos.y).toBe(100)
  })

  it('test get x,y', () => {
    instance.x = 200
    instance.y = 200
    expect(instance.x).toBe(200)
    expect(instance.y).toBe(200)
  })
})
